import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Send, RotateCcw, Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics, trackEvent } from "@/components/GoogleAnalytics";
import GlitchTitle from "@/components/paradoxxia/GlitchTitle";
import circuitBg from "@/assets/paradoxxia-bg.png";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { supabase } from "@/integrations/supabase/client";
import { downloadImage, downloadVideo } from "@/utils/imageDownload";
import TypewriterText from "@/components/story/TypewriterText";
import AICharacterGenerator from "@/pages/AICharacterGenerator";

const CHAT_ENDPOINT = "https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/story-chat";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aWd0YnhxZ2JkY2ZwbW5yenZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNzQyNjUsImV4cCI6MjA1NDY1MDI2NX0.N9TKpkYmeitE3kthByFOnmR0gKBvBrMshEXez6D5IU8";

// how many assistant replies between scene illustrations
const SCENE_EVERY = 3;

// the narrator ends a fatal reply with this marker
const DEATH_MARKER = /\[\s*you\s+died\s*\]/i;
const stripDeathMarker = (text: string) =>
  text.replace(/\[\s*you\s+died\s*\]/gi, "").replace(/\s+$/, "");

// pull the closing beat of the fatal reply — the consequence that actually killed them
const fatalConsequence = (text: string) => {
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  const tail = sentences.slice(-2).join(" ").trim();
  return tail.length > 320 ? `${tail.slice(0, 317).trimEnd()}…` : tail;
};

// the concrete action beat of a reply — the sentences that actually depict something happening
const actionBeat = (text: string) => {
  const sentences = text
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return text.slice(0, 400);
  const scored = sentences.filter((s) => !/^["“]/.test(s.trim()));
  const pool = scored.length ? scored : sentences;
  return pool.slice(-3).join(" ").slice(0, 500);
};

// does the beat depict violence/motion? action beats get a harder, faster camera
const ACTION_WORDS =
  /\b(run|runs|running|sprint|charge|lunge|leap|jump|dive|dodge|strike|strikes|swing|slam|hit|punch|kick|stab|slash|shoot|shot|fire|fires|blast|explode|explosion|grab|grabs|drag|throw|thrown|fall|falls|falling|collapse|crash|smash|chase|flee|scramble|climb|claw|bite|roar|scream|blood|bleed|wound|snap|rip|tear|shove|wrestle|pin|swarm|attack|ambush|recoil|stagger)\b/i;

// a distinct cinematic grammar per shot so consecutive scenes don't look identical
const CAMERA_SETUPS_ACTION = [
  "low-angle wide on a 24mm anamorphic lens, camera tilted into a dutch angle, subject filling the lower third",
  "handheld medium shot on a 35mm lens, whip-pan energy, frame slightly off-balance",
  "over-the-shoulder tracking shot on a 50mm lens, foreground silhouette blurred, subject mid-stride",
  "wide establishing action shot on a 28mm lens, deep focus, subject small against enormous ruin",
];
const CAMERA_SETUPS_QUIET = [
  "medium-wide on a 40mm lens, subject framed by a doorway or wreckage, shallow depth of field",
  "slow-push medium shot on a 50mm lens, subject off-centre, negative space heavy with haze",
  "high-angle wide on a 32mm lens looking down, subject dwarfed by the landscape",
];

const cinematicSetup = (beat: string) => {
  const pool = ACTION_WORDS.test(beat) ? CAMERA_SETUPS_ACTION : CAMERA_SETUPS_QUIET;
  return pool[Math.floor(Math.random() * pool.length)];
};


// intro video cache — keyed per character, short TTL because the URL is a signed link
const INTRO_CACHE_PREFIX = "paradoxxia_story_intro_video:";
const INTRO_CACHE_TTL = 40 * 60 * 1000;

const introCacheKey = (name: string, species?: string, gender?: string) =>
  `${INTRO_CACHE_PREFIX}${[name, species ?? "", gender ?? ""].join("|").toLowerCase()}`;

const readIntroCache = (key: string) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return "";
    const { url, at } = JSON.parse(raw) as { url?: string; at?: number };
    if (!url || !at || Date.now() - at > INTRO_CACHE_TTL) {
      sessionStorage.removeItem(key);
      return "";
    }
    return url;
  } catch {
    return "";
  }
};

const writeIntroCache = (key: string, url: string) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ url, at: Date.now() }));
  } catch {
    // storage unavailable — caching is best effort
  }
};

// graceful copy when the generator did not hand over a species or gender
const describeChar = (g?: string, s?: string) =>
  [(g ?? "").trim(), (s ?? "").trim() || "wasteland survivor"].filter(Boolean).join(" ");




interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id?: string;
  image?: string;
  imageLoading?: boolean;
}

const DownloadOverlayButton = ({ src, fileName }: { src: string; fileName: string }) => (
  <Button
    onClick={() => downloadImage(src, fileName)}
    size="icon"
    variant="ghost"
    aria-label="download image"
    className="absolute top-2 right-2 z-30 bg-transparent hover:bg-transparent p-1"
  >
    <Download
      className="h-6 w-6"
      style={{ color: "#00d9ff", filter: "drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))" }}
    />
  </Button>
);

const ExpandButton = ({ onClick, label }: { onClick: () => void; label?: string }) => (
  <Button
    onClick={onClick}
    size="icon"
    variant="ghost"
    aria-label={label || "expand image"}
    className="absolute top-2 left-2 z-30 bg-black/40 hover:bg-black/60 p-1 rounded-md"
  >
    <Maximize2
      className="h-5 w-5"
      style={{ color: "#00d9ff", filter: "drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))" }}
    />
  </Button>
);




const randomName = () => {
  const prefixes = ["Kry", "Zor", "Ral", "Cal", "Del", "Lur", "Mir", "Pel"];
  const suffixes = ["ion", "us", "is", "os", "yn", "or", "ar", "on", "el"];
  return (
    prefixes[Math.floor(Math.random() * prefixes.length)] +
    suffixes[Math.floor(Math.random() * suffixes.length)]
  );
};

const Story = () => {
  const [searchParams] = useSearchParams();
  
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const [dossier, setDossier] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [cardImage, setCardImage] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [introVideo, setIntroVideo] = useState("");
  const [introStatus, setIntroStatus] = useState<"idle" | "rendering" | "playing" | "ended" | "done">("idle");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [isDead, setIsDead] = useState(false);
  // the exact action that got them killed, and the fatal consequence it triggered
  const [deathRecap, setDeathRecap] = useState<{ choice: string; consequence: string } | null>(null);
  // resident-evil style game over still of how they died
  const [deathImage, setDeathImage] = useState("");
  const [deathImageLoading, setDeathImageLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const replyCount = useRef(0);
  const autoStarted = useRef(false);
  const introRequested = useRef(false);
  const cardImageRef = useRef("");
  const dossierRef = useRef("");

  const setDossierAndRef = (text: string) => {
    dossierRef.current = text;
    setDossier(text);
  };

  const setCardImageAndRef = (url: string) => {
    cardImageRef.current = url;
    setCardImage(url);
  };




  const [typedIds, setTypedIds] = useState<Record<string, boolean>>({});
  const [skipKey, setSkipKey] = useState<string | null>(null);


  const msgKey = (m: ChatMessage, i: number) => String(m.id ?? i);
  const lastMessage = messages[messages.length - 1];
  const lastKey = lastMessage ? msgKey(lastMessage, messages.length - 1) : "";
  const isTyping =
    !!lastMessage &&
    lastMessage.role === "assistant" &&
    lastMessage.content.length > 0 &&
    !typedIds[lastKey];
  // scroll is locked (and follows the typewriter) until the reply finishes typing
  const scrollLocked = isStreaming || isTyping;

  const followScroll = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  // after typing finishes (or is skipped), scroll to the end so the latest options/image are visible
  useEffect(() => {
    if (!scrollLocked) {
      const timer = window.setTimeout(() => followScroll(), 60);
      return () => window.clearTimeout(timer);
    }
  }, [scrollLocked]);


  // Auto-start from query params or persisted character data
  useEffect(() => {
    if (autoStarted.current || started) return;

    const autoStart = searchParams.get("autostart");
    const autoName = searchParams.get("name")?.trim();
    const autoSpecies = searchParams.get("species")?.trim();
    const autoGender = searchParams.get("gender")?.trim();

    let source: { name: string; species: string; gender: string; dossier?: string } | null = null;
    if (autoStart && autoName && autoSpecies && autoGender) {
      source = { name: autoName, species: autoSpecies, gender: autoGender };
    } else {
      try {
        const saved = localStorage.getItem("paradoxxia_story_character");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.autostart && parsed.name?.trim() && parsed.species?.trim() && parsed.gender?.trim()) {
            source = { name: parsed.name.trim(), species: parsed.species.trim(), gender: parsed.gender.trim(), dossier: typeof parsed.dossier === "string" ? parsed.dossier : "" };
          }
        }
      } catch {
        // ignore malformed storage
      }
    }

    if (source) {
      autoStarted.current = true;
      if (source.dossier) setDossierAndRef(source.dossier);
      setName(source.name);
      setSpecies(source.species);
      setGender(source.gender);
      void beginEncounter(source.name, source.species, source.gender);
    }
  }, [searchParams]);

  const generateImage = async (prompt: string, referenceImage?: string) => {
    const { data, error } = await supabase.functions.invoke("generate-character-image", {
      body: { prompt, imageUrl: referenceImage || undefined, timestamp: Date.now() },
    });
    if (error) throw error;
    if (!data?.imageUrl) throw new Error("No image returned");
    return data.imageUrl as string;
  };

  const handlePhotoUpload = async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            setUploadedPhoto(event.target?.result as string);
            toast.success("Photo uploaded successfully!");
          };
          reader.readAsDataURL(file);
        };
        input.click();
        return;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        promptLabelHeader: "Select Photo",
        promptLabelPhoto: "From Gallery",
        promptLabelPicture: "Take Photo",
      });

      if (image.dataUrl) {
        setUploadedPhoto(image.dataUrl);
        toast.success("Photo uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Camera error:", error);
      if (error?.message?.includes("permission")) {
        toast.error("Camera permission denied. Please enable camera access in your device settings.");
      } else if (/cancell?ed/i.test(error?.message ?? "")) {
        toast.info("Photo upload cancelled");
      } else {
        toast.error("Failed to capture photo. Please try again.");
      }
    }
  };

  const generateCard = async (
    finalName: string,
    startSpecies?: string,
    startGender?: string,
  ): Promise<string | undefined> => {
    // already have a portrait handed over from the generator screen
    if (cardImageRef.current) {
      setCardLoading(false);
      return cardImageRef.current;
    }
    // reuse the portrait generated on the character generator page when available
    try {
      const handoff = sessionStorage.getItem("paradoxxia_story_character_image");
      if (handoff) {
        setCardImageAndRef(handoff);
        setCardLoading(false);
        return handoff;
      }
    } catch {
      // ignore storage access issues and fall through to generating a card
    }

    setCardLoading(true);
    try {
      const url = await generateImage(
        `A cinematic full-body character card portrait of ${finalName}, a ${describeChar(startGender ?? gender, startSpecies ?? species)} survivor in the Cyber Boondocks — a scorched dystopian sci-fi frontier of rust, dust, neon and static. Battered functional clothing and improvised gear, weathered skin, dramatic moody rim lighting with cool cyan and deep blue accents, shallow depth of field, dark atmospheric background.${uploadedPhoto ? " CRITICAL: the attached reference photo is this character — faithfully match the reference face's structure, features, skin tone and hair so they are recognisably the same person." : ""} Ultra photorealistic cinematic still, no text or captions other than the required watermark.`,
        uploadedPhoto || undefined,
      );

      setCardImageAndRef(url);
      return url;
    } catch (error) {
      console.error("card image error:", error);
      return undefined;
    } finally {
      setCardLoading(false);
    }
  };

  // 4-5 second cinematic intro animated from the character portrait
  // cached per character so a restart or reload replays it instead of paying for a new render.
  // the stored URL is a short-lived signed URL, so the cache expires well before it does.
  const playIntroVideo = async (
    portrait: string,
    finalName: string,
    startSpecies?: string,
    startGender?: string,
  ) => {
    if (introRequested.current || !portrait) return;
    introRequested.current = true;

    const cacheKey = introCacheKey(finalName, startSpecies ?? species, startGender ?? gender);
    const cached = readIntroCache(cacheKey);
    if (cached) {
      setIntroVideo(cached);
      setIntroStatus("playing");
      return;
    }

    setIntroStatus("rendering");
    try {
      const { data, error } = await supabase.functions.invoke("story-video", {
        body: {
          action: "create",
          imageDataUrl: portrait.startsWith("data:") ? portrait : undefined,
          prompt: `Cinematic 5 second intro of ${finalName}, a ${describeChar(startGender ?? gender, startSpecies ?? species)} survivor, standing in the scorched Cyber Boondocks. Slow camera push-in, drifting dust, flickering failing neon, wind moving hair and battered clothing, a slow turn of the head toward camera. Ultra photorealistic, moody cool cyan rim light, no text.`,
        },
      });
      if (error) throw error;
      const jobId = data?.id as string | undefined;
      if (!jobId) throw new Error("no job");

      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 7000));
        const { data: status, error: statusError } = await supabase.functions.invoke("story-video", {
          body: { action: "status", id: jobId },
        });
        if (statusError) throw statusError;
        if (status?.status === "completed" && status.videoUrl) {
          writeIntroCache(cacheKey, status.videoUrl as string);
          setIntroVideo(status.videoUrl as string);
          setIntroStatus("playing");
          trackEvent("Story", "Intro Video", finalName);
          return;
        }
        if (status?.status === "failed") throw new Error(status.error || "render failed");
      }
      throw new Error("timed out");
    } catch (error) {
      console.error("intro video error:", error);
      setIntroStatus("done");
    }
  };

  const fetchOptions = async (history: ChatMessage[]) => {
    setOptionsLoading(true);
    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          mode: "options",
          messages: history,
          character: { name, species, gender, dossier: dossierRef.current },
        }),
      });
      if (!response.ok) throw new Error("options failed");
      const data = await response.json();
      setOptions(Array.isArray(data?.options) ? data.options.slice(0, 3) : []);
    } catch (error) {
      console.error("options error:", error);
      setOptions([]);
    } finally {
      setOptionsLoading(false);
    }
  };


  const generateSceneImage = async (sceneText: string, msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, imageLoading: true } : m)),
    );
    // the portrait is the visual source of truth — wait briefly for it if it is still rendering
    for (let i = 0; i < 30 && !cardImageRef.current; i++) {
      await new Promise((r) => setTimeout(r, 1000));
    }
    const reference = cardImageRef.current || uploadedPhoto || "";
    const clean = sceneText.replace(/[*"]/g, "").slice(0, 900);
    const beat = actionBeat(sceneText);
    const mentionsParadoxxia = /paradoxxia/i.test(clean);
    const androidClause = mentionsParadoxxia
      ? "If a white-faced android figure appears, she is distant, half-hidden or barely glimpsed — never posed, never centered, never facing the camera directly: a domestic android with a porcelain-white synthetic face, long dark hair, faint glowing cyan eyes and battered chrome plating, seen far off through dust, doorways or wreckage."
      : "Do NOT include any white-faced android character in this image. Show only the world and whatever the described moment contains — scavengers in small wary groups, collective-minded androids moving in eerie unison, or a lone feral robot or mutant.";
    const isAction = ACTION_WORDS.test(beat);
    const setup = cinematicSetup(beat);
    try {
      const url = await generateImage(
        `${reference ? `TASK: take the attached reference image of ${name} and place THAT EXACT SAME CHARACTER into the scene described below. This is a character-consistency task, not a new character design. Copy from the reference, without altering them: face shape, facial features, eye colour, skin tone, hair colour/length/style, facial hair, age, body type, and their outfit, armour, gear and colour palette. Same person, same wardrobe — only the pose, camera angle, lighting and background change. ` : ""}THE MOMENT TO ILLUSTRATE — LITERALLY, exactly as written, nothing invented and nothing left out: "${beat}"

FULL PASSAGE FOR CONTEXT: "${clean}"

Depict the specific ACTION in that moment, not a mood shot: show ${name}'s exact posture and gesture from the text (running, crouching, reaching, striking, falling, hiding, climbing, aiming, bleeding, dragging, being grabbed), the exact objects, creatures, machines and people named in it, and the exact location, time of day and weather it describes. Every element named in the moment must be visible in frame and doing what the text says it is doing. If the text names a threat, show that threat in the shot with the character, mid-attack and close enough to be dangerous.

${isAction
  ? `ACTION SHOT — this is the money frame of the sequence. Freeze the PEAK instant of the action: limbs extended, body weight committed and off-balance, feet leaving the ground or skidding, impact visible. Sell the violence and speed with directional motion blur on the fast-moving parts while the face stays sharp, flying debris, sparks, kicked-up dust, spraying grit or water, muzzle flash or blade glint, shockwave haze, cloth and hair whipping. Strong diagonal composition and forced perspective so the action drives toward the camera.`
  : `TENSION SHOT — no action verb in this beat, so build cinematic dread instead: held breath, coiled body language, eyes reading the dark, one telling detail (a hand on a weapon, a wound, a listening posture). Atmosphere does the work — drifting dust, haze, distant sparks.`}

CINEMATOGRAPHY — treat this as a frame from a big-budget sci-fi film: ${setup}. Anamorphic widescreen composition with rule-of-thirds staging and layered foreground / midground / background depth. Motivated dramatic lighting: hard key from a practical source (failing neon, flare, burning wreck, floodlight), strong cyan and deep-blue rim light separating the subject from the dark, deep crushed shadows, volumetric god rays through dust and smoke, subtle anamorphic lens flare, shallow depth of field with natural bokeh, fine 35mm film grain, high dynamic range, slight chromatic aberration at the frame edges, cinematic teal-and-amber grade kept gritty and desaturated.

Framing: cinematic third-person film still of ${name}, a ${describeChar(gender, species)} survivor, in the Cyber Boondocks — a lawless scorched no man's land. Camera always observes from outside the character, never their POV. ${androidClause} Rust, failing neon, static, ruined architecture, dead machinery. Ultra photorealistic cinematic film still, sharp and professionally lit — no illustration, no cartoon, no text or captions other than the required watermark.`,
        reference || undefined,
      );



      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, image: url, imageLoading: false } : m)),
      );
    } catch (error) {
      console.error("scene image error:", error);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, imageLoading: false } : m)),
      );
    }
  };

  // Resident Evil style game-over still — the exact way this run ended
  const generateDeathImage = async (fatalText: string, choice: string) => {
    setDeathImageLoading(true);
    const reference = cardImageRef.current || uploadedPhoto || "";
    const clean = fatalText.replace(/[*"]/g, "").slice(0, 900);
    const beat = actionBeat(fatalText);
    try {
      const url = await generateImage(
        `${reference ? `TASK: take the attached reference image of ${name} and show THAT EXACT SAME CHARACTER dying in the scene described below. Keep their face, hair, body type, outfit, armour and gear identical to the reference — only the pose, damage, camera angle, lighting and background change. ` : ""}GAME OVER SCENE — depict the character's death exactly as it happened, literally: "${beat}"

FULL FATAL PASSAGE: "${clean}"${choice ? `\n\nTHE ACTION THAT KILLED THEM: "${choice.slice(0, 200)}"` : ""}

Show the precise cause of death named in the text — the creature, machine, fall, blade, gunfire, fire, drowning, collapse or wound — in frame, in the act. ${name} is dead or in the final instant of dying: collapsed, limp, pinned, falling, or overwhelmed, with the wound and the aftermath visible. Do not sanitise it and do not turn it into a heroic pose.

Style: a survival-horror game-over cinematic in the spirit of classic Resident Evil game over screens — grim, low-key, desaturated with sickly red and cold cyan accents, heavy grain, deep shadows crushing the edges of the frame, dust and smoke, a single harsh practical light, dutch-angled or low camera looking at the body, blood and debris on scorched concrete. Ruined Cyber Boondocks setting. Ultra photorealistic cinematic film still, no text or captions other than the required watermark.`,
        reference || undefined,
      );
      setDeathImage(url);
    } catch (error) {
      console.error("death image error:", error);
    } finally {
      setDeathImageLoading(false);
    }
  };


  const streamReply = async (history: ChatMessage[]) => {
    setIsStreaming(true);
    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: history, character: { name, species, gender, dossier: dossierRef.current } }),
      });

      if (!response.ok || !response.body) {
        const err = await response.json().catch(() => ({ error: "Transmission failed." }));
        throw new Error(err.error || "Transmission failed.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let placed = false;
      const msgId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;


      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (!delta) continue;
            assistantText += delta;
            const visible = stripDeathMarker(assistantText);
            if (!placed) {
              placed = true;
              setMessages((prev) => [...prev, { role: "assistant", content: visible, id: msgId }]);
            } else {
              setMessages((prev) =>
                prev.map((m) => (m.id === msgId ? { ...m, content: visible } : m)),
              );
            }
          } catch {
            // partial JSON chunk — ignore
          }
        }
      }

      if (!assistantText) throw new Error("No response from Paradoxxia.");

      const died = DEATH_MARKER.test(assistantText);
      const finalText = stripDeathMarker(assistantText);

      // illustrate the scene every few replies to keep the story visual
      replyCount.current += 1;
      if (!died && replyCount.current % SCENE_EVERY === 1) {
        void generateSceneImage(finalText, msgId);
      }
      if (died) {
        const lastChoice = [...history].reverse().find((m) => m.role === "user")?.content?.trim() || "";
        const choice = lastChoice && !/^I am /i.test(lastChoice) ? lastChoice : "you walked in without a plan";
        setDeathRecap({ choice, consequence: fatalConsequence(finalText) });
        setDeathImage("");
        setIsDead(true);
        setOptions([]);
        void generateDeathImage(finalText, choice);
        trackEvent("Story", "Death", name);
      } else {
        void fetchOptions([...history, { role: "assistant", content: finalText }]);
      }


    } catch (error) {
      console.error("story chat error:", error);
      toast.error((error as Error).message || "Signal lost");
    } finally {
      setIsStreaming(false);
    }
  };

  const beginEncounter = async (startName?: string, startSpecies?: string, startGender?: string) => {
    const finalName = (startName ?? name).trim() || randomName();
    if (!startName && !name.trim()) {
      setName(finalName);
      toast.success("Generated random name");
    }
    setStarted(true);
    setIsDead(false);
    trackEvent("Story", "Begin Encounter", `${startSpecies ?? species}-${startGender ?? gender}-${finalName}`);
    replyCount.current = 0;
    setOptions([]);

    void generateCard(finalName, startSpecies, startGender).then((portrait) => {
      if (portrait) void playIntroVideo(portrait, finalName, startSpecies, startGender);
    });
    const opening: ChatMessage[] = [
      {
        role: "user",
        content: `I am ${finalName}, a ${describeChar(startGender ?? gender, startSpecies ?? species)}. Open the story: first, in one short paragraph, introduce me through what I carry, what I wear, my condition and what I have survived — never my physical features, skin, hair or ethnicity, since my portrait is already shown — then describe exactly where I am right now and the situation I am caught in at this moment: what I can see, hear and smell, what I need, and what is pressing in on me. Do not introduce Paradoxxia yet. End with an opening that lets me act.`,
      },
    ];

    await streamReply(opening);
    setMessages((prev) => prev.filter((m) => m.role === "assistant"));
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || isDead) return;
    setOptions([]);
    const history: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(history);
    await streamReply(history);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await send(text);
  };

  const restart = () => {
    setMessages([]);
    setStarted(false);
    setStep(1);
    setSpecies("");
    setGender("");
    setName("");
    setUploadedPhoto("");
    setDossierAndRef("");
    setCardImageAndRef("");
    setCardLoading(false);
    setOptions([]);
    setIntroVideo("");
    setIntroStatus("idle");
    introRequested.current = false;
    replyCount.current = 0;
    setIsDead(false);
    setDeathRecap(null);
    setDeathImage("");
    setDeathImageLoading(false);
    setTypedIds({});
    setSkipKey(null);
  };

  // die and go again with the exact same character — portrait, dossier and intro are kept
  const tryAgain = () => {
    setIsDead(false);
    setDeathRecap(null);
    setDeathImage("");
    setDeathImageLoading(false);
    setMessages([]);
    setTypedIds({});
    setSkipKey(null);
    setOptions([]);
    setInput("");
    replyCount.current = 0;
    introRequested.current = true;
    setIntroStatus("done");
    trackEvent("Story", "Try Again", name);
    void beginEncounter(name, species, gender);
  };




  // the setup screen IS the character generator page — it hands the character over here
  const handleGeneratorContinue = (character: {
    name: string;
    species: string;
    gender: string;
    image: string;
    photo: string;
    dossier: string;
  }) => {
    const finalName = character.name.trim() || randomName();
    setName(finalName);
    setSpecies(character.species);
    setGender(character.gender);
    setUploadedPhoto(character.photo || "");
    setDossierAndRef(character.dossier || "");
    if (character.image) setCardImageAndRef(character.image);
    void beginEncounter(finalName, character.species, character.gender);
  };

  if (!started) {
    return (
      <>
        <Helmet>
          <title>Paradoxxia Story | Roleplay an Encounter with Paradoxxia</title>
          <meta
            name="description"
            content="Step into the Cyber Boondocks and roleplay a live, AI-driven encounter with Paradoxxia — the android from Romer Garcia's dystopian sci-fi universe."
          />
          <meta property="og:title" content="Paradoxxia Story | Roleplay an Encounter" />
          <meta
            property="og:description"
            content="Create your character and roleplay a live encounter with Paradoxxia in the Cyber Boondocks."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://romergarcia.com/story" />
          <meta property="og:image" content="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/projects/paradoxxia-cover.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Paradoxxia Story | Roleplay an Encounter" />
          <meta
            name="twitter:description"
            content="Create your character and roleplay a live encounter with Paradoxxia in the Cyber Boondocks."
          />
        </Helmet>
        <AICharacterGenerator storyMode onContinueToStory={handleGeneratorContinue} />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Helmet>
        <title>Paradoxxia Story | Roleplay an Encounter with Paradoxxia</title>
        <meta
          name="description"
          content="Step into the Cyber Boondocks and roleplay a live, AI-driven encounter with Paradoxxia — the android from Romer Garcia's dystopian sci-fi universe."
        />
        <meta property="og:title" content="Paradoxxia Story | Roleplay an Encounter" />
        <meta
          property="og:description"
          content="Create your character and roleplay a live encounter with Paradoxxia in the Cyber Boondocks."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romergarcia.com/story" />
        <meta property="og:image" content="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/projects/paradoxxia-cover.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Paradoxxia Story | Roleplay an Encounter" />
        <meta
          name="twitter:description"
          content="Create your character and roleplay a live encounter with Paradoxxia in the Cyber Boondocks."
        />
      </Helmet>

      <div className="flex-1 flex flex-col min-h-0">
        <GoogleAnalytics />
        <ThemeToggle />

        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${circuitBg})` }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-white/60 dark:bg-transparent" />

        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span className="inline-flex items-baseline">
                <span style={{ fontWeight: 100 }}>← back</span>
                <span style={{ fontWeight: 500 }} className="ml-2">to</span>
                <span style={{ fontWeight: 100 }} className="ml-2">home</span>
              </span>
            </Link>
          </div>
        </nav>

        <main
          className="container mx-auto px-4 lg:px-8 xl:px-12 relative z-10 flex-1 flex flex-col min-h-0 pt-20 sm:pt-24 transition-all duration-500"
        >
          <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[85vw] mx-auto w-full flex-1 flex flex-col min-h-0 space-y-4 lg:space-y-6">
            <div className="text-center space-y-2">
              <h1
                className="hero-title font-bold text-foreground px-4 text-xl sm:text-2xl transition-all duration-500"
              >
                <GlitchTitle
                  subtitleWords={["story", "mode"]}
                  compact={true}
                />
              </h1>
            </div>

            {started && (
              <Card className="bg-card/90 backdrop-blur-sm border-border dark:border-[#00d4ff]/30 flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 border-b border-border dark:border-[#00d4ff]/20">
                  <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-mono text-muted-foreground">
                    {name} · {describeChar(gender, species)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={restart} className="text-xs sm:text-sm lg:text-base">
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1" /> restart
                  </Button>
                </div>

                <div
                  ref={scrollRef}
                  className={`flex-1 ${scrollLocked ? "overflow-hidden" : "overflow-y-auto"} flex flex-col px-4 py-4 lg:px-6 lg:py-6 space-y-4 lg:space-y-6`}
                >
                  <div className="flex-1 space-y-4 lg:space-y-6">
                    {(cardImage || cardLoading) && (
                      <div className="flex justify-center">
                        <div className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 2xl:w-80 rounded-lg overflow-hidden border border-border dark:border-[#00d4ff]/40 bg-muted">
                          {cardImage ? (
                            <div className="relative">
                              <img
                                src={cardImage}
                                alt={`${name}, a ${describeChar(gender, species)} in the Cyber Boondocks`}
                                className="w-full aspect-square object-cover"
                                loading="lazy"
                              />
                              <ExpandButton
                                onClick={() => {
                                  setLightboxImage(cardImage);
                                  setLightboxAlt(`${name}, a ${describeChar(gender, species)} in the Cyber Boondocks`);
                                }}
                                label="expand character profile"
                              />
                              <DownloadOverlayButton
                                src={cardImage}
                                fileName={`${name || "character"}_${Date.now()}.png`}
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-square flex items-center justify-center">
                              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 animate-spin text-muted-foreground" />
                            </div>
                          )}
                          <div className="px-2 py-1.5 lg:px-3 lg:py-2 xl:px-4 xl:py-3 text-center">
                            <span className="block text-sm sm:text-base lg:text-lg xl:text-xl font-roc font-medium text-foreground truncate">
                              {name}
                            </span>
                            <span className="block text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-muted-foreground">
                              {describeChar(gender, species)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {introVideo && introStatus === "done" && (
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          downloadVideo(introVideo, `${name || "character"}_intro_${Date.now()}.mp4`)
                        }
                        className="inline-flex items-center gap-2 text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Download
                          className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                          style={{
                            color: "#00d9ff",
                            filter: "drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))",
                          }}
                        />
                        download intro sequence
                      </button>
                    </div>
                    )}





                  {messages.map((m, i) => {
                    const key = msgKey(m, i);
                    const typed = m.role !== "assistant" || !!typedIds[key];
                    return (
                    <div
                      key={key}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`${
                          m.role === "user"
                            ? "max-w-[92%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] rounded-lg"
                            : "w-full rounded-lg"
                        } px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 xl:px-8 xl:py-5 leading-relaxed whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-[#0a1e5c] text-white dark:bg-[#00d4ff] dark:text-neutral-950 font-roc text-base sm:text-lg lg:text-xl xl:text-2xl"
                            : "bg-muted text-foreground font-roc text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <div className="flex items-center justify-between gap-3 mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm lg:text-base xl:text-lg uppercase tracking-widest text-muted-foreground">
                              パラドクシア
                            </span>
                            {!typed && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSkipKey(key)}
                                className="h-auto px-2 py-1 text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
                              >
                                skip
                              </Button>
                            )}
                          </div>
                        )}
                        {m.role === "assistant" ? (
                          <TypewriterText
                            text={m.content}
                            speed={34}
                            skip={skipKey === key}
                            onTick={() => {
                              followScroll();
                              if (typedIds[key]) {
                                setTypedIds((prev) => {
                                  const next = { ...prev };
                                  delete next[key];
                                  return next;
                                });
                              }
                            }}
                            onComplete={() => setTypedIds((prev) => ({ ...prev, [key]: true }))}
                          />
                        ) : (
                          m.content
                        )}
                        {m.image && typed && (
                          <div className="relative mt-3 w-full max-w-sm lg:max-w-md shrink-0">
                            <img
                              src={m.image}
                              alt="Scene from the encounter with Paradoxxia"
                              className="w-full rounded-md border border-border dark:border-[#00d4ff]/30"
                              loading="lazy"
                              onLoad={() => {
                                if (!scrollLocked) followScroll();
                              }}
                            />
                            <ExpandButton
                              onClick={() => {
                                setLightboxImage(m.image || null);
                                setLightboxAlt("Scene from the encounter with Paradoxxia");
                              }}
                              label="expand scene image"
                            />
                            <DownloadOverlayButton
                              src={m.image}
                              fileName={`${name || "scene"}_scene_${Date.now()}.png`}
                            />
                          </div>
                        )}

                        {m.imageLoading && !m.image && typed && (
                          <span className="mt-2 flex items-center gap-2 text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground">
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 animate-spin" /> rendering scene...
                          </span>
                        )}
                      </div>
                    </div>
                    );
                  })}

                  {isStreaming && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground font-mono">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 animate-spin" /> transmitting...
                    </div>
                  )}
                  </div>

                  <div className="sticky bottom-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border dark:border-[#00d4ff]/20 pb-safe shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_-8px_24px_-12px_rgba(0,217,255,0.1)]">
                    {(options.length > 0 || optionsLoading) && !scrollLocked && (
                      <div className="px-3 pt-3 lg:px-4 lg:pt-4 xl:px-6 xl:pt-6 space-y-2 lg:space-y-3 xl:space-y-4">
                        <span className="block text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-muted-foreground">
                          choose an action
                        </span>
                        {optionsLoading ? (
                          <span className="flex items-center gap-2 text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground font-mono">
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 animate-spin" /> weighing your options...
                          </span>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 xl:gap-4">
                            {options.map((option) => (
                              <Button
                                key={option}
                                variant="outline"
                                onClick={() => void send(option)}
                                className="flex-1 h-auto py-2 sm:py-2.5 lg:py-3 xl:py-4 whitespace-normal text-left justify-start text-sm sm:text-base lg:text-lg xl:text-xl font-roc dark:border-[#00d4ff]/30 dark:text-neutral-300"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {isDead ? (
                      <div className="p-3 lg:p-4 xl:px-6 xl:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="font-mono uppercase tracking-widest text-sm sm:text-base lg:text-lg text-red-500">
                          {name} is dead
                        </span>
                        <Button
                          onClick={tryAgain}
                          className="bg-[#0a1e5c] dark:bg-[#00d4ff] dark:text-neutral-950 hover:bg-[#0a1e5c]/90 dark:hover:bg-[#00d4ff]/90 font-mono uppercase tracking-widest"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" /> try again
                        </Button>
                      </div>
                    ) : (
                    <div className="p-3 lg:p-4 xl:px-6 xl:py-5 flex gap-2 lg:gap-3 xl:gap-4 items-end">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="say or do something..."
                        rows={1}
                        className="bg-background resize-none min-h-[44px] sm:min-h-[48px] lg:min-h-[56px] xl:min-h-[64px] max-h-32 text-base sm:text-lg lg:text-xl xl:text-2xl"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isStreaming || !input.trim()}
                        className="bg-[#0a1e5c] dark:bg-[#00d4ff] dark:text-neutral-950 hover:bg-[#0a1e5c]/90 dark:hover:bg-[#00d4ff]/90 px-3 sm:px-4 lg:px-5 xl:px-6"
                      >
                        {isStreaming ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 animate-spin" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />}
                      </Button>
                    </div>
                    )}

                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>

        {(introStatus === "rendering" || introStatus === "playing" || introStatus === "ended") && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {introStatus === "rendering" && (
              <div className="flex flex-col items-center gap-3">
                {cardImage && (
                  <img
                    src={cardImage}
                    alt={`${name} intro frame`}
                    className="w-40 rounded-lg border border-[#00d4ff]/40 opacity-70"
                  />
                )}
                <span className="flex items-center gap-2 text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-[#00d4ff]">
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 animate-spin" /> rendering intro sequence...
                </span>
              </div>
            )}

            {(introStatus === "playing" || introStatus === "ended") && introVideo && (
              <div className="relative w-full h-full">
                <video
                  src={introVideo}
                  autoPlay={introStatus === "playing"}
                  muted
                  playsInline
                  onEnded={() => setIntroStatus("ended")}
                  className="w-full h-full object-contain"
                />
                {introStatus === "ended" ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                    <button
                      onClick={() =>
                        downloadVideo(introVideo, `${name || "character"}_intro_${Date.now()}.mp4`)
                      }
                      className="group flex flex-col items-center gap-3 p-6 rounded-lg transition-colors hover:bg-black/40"
                    >
                      <Download
                        className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                        style={{
                          color: "#00d9ff",
                          filter: "drop-shadow(0 0 12px rgba(0, 217, 255, 0.8))",
                        }}
                      />
                      <span className="text-sm sm:text-base lg:text-lg xl:text-xl font-roc font-medium text-[#00d9ff] uppercase tracking-widest">
                        click to download intro sequence
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      onClick={() => setIntroStatus("done")}
                      className="mt-8 text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-neutral-400 hover:text-[#00d4ff]"
                    >
                      continue to story →
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => setIntroStatus("done")}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs sm:text-sm lg:text-base xl:text-lg font-mono uppercase tracking-widest text-neutral-400 hover:text-[#00d4ff]"
                  >
                    skip intro →
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {isDead && !scrollLocked && !lightboxImage && (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center px-6 py-10 text-center overflow-y-auto">
            {/* the death itself, rendered as a survival-horror game over still */}
            {deathImage && (
              <div className="absolute inset-0">
                <img
                  src={deathImage}
                  alt={`${name} dying in the Cyber Boondocks`}
                  className="w-full h-full object-cover opacity-60 contrast-125 saturate-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/95" />
                <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply" />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
              {deathImage ? (
                <div className="relative mb-6">
                  <img
                    src={deathImage}
                    alt={`${name} dying in the Cyber Boondocks`}
                    className="w-56 sm:w-72 lg:w-80 rounded-lg border border-red-500/40 shadow-[0_0_40px_rgba(0,0,0,0.9)]"
                  />
                  <ExpandButton
                    onClick={() => {
                      setLightboxAlt(`${name} dying in the Cyber Boondocks`);
                      setLightboxImage(deathImage);
                    }}
                    label="expand death scene"
                  />
                  <DownloadOverlayButton src={deathImage} fileName={`${name || "character"}_game_over.png`} />
                </div>
              ) : deathImageLoading ? (
                <div className="mb-6 flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-red-400/70">
                  <Loader2 className="w-4 h-4 animate-spin" /> recovering the last frame…
                </div>
              ) : (
                cardImage && (
                  <img
                    src={cardImage}
                    alt={`${name} in the Cyber Boondocks`}
                    className="w-28 sm:w-32 lg:w-40 rounded-lg border border-red-500/40 grayscale opacity-50 mb-6"
                  />
                )
              )}
              <h2
                className="font-roc font-bold uppercase tracking-[0.2em] text-3xl sm:text-5xl lg:text-6xl text-red-500"
                style={{ textShadow: "0 0 24px rgba(239,68,68,0.5)" }}
              >
                you died
              </h2>
              <p className="mt-4 max-w-md font-mono text-xs sm:text-sm lg:text-base uppercase tracking-widest text-neutral-400">
                the cyber boondocks keeps what it takes. {name}'s run ends here.
              </p>

            {deathRecap && (
              <div className="mt-6 w-full max-w-lg text-left border border-red-500/30 bg-black/60 backdrop-blur-sm rounded-lg p-4 sm:p-5">
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-red-400/80">
                  how you died
                </p>
                <p className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-neutral-500">
                  your choice
                </p>
                <p className="mt-1 text-sm sm:text-base text-neutral-200">“{deathRecap.choice}”</p>
                {deathRecap.consequence && (
                  <>
                    <p className="mt-4 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-neutral-500">
                      what it cost you
                    </p>
                    <p className="mt-1 text-sm sm:text-base text-neutral-300">{deathRecap.consequence}</p>
                  </>
                )}
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={tryAgain}
                className="bg-[#00d4ff] text-neutral-950 hover:bg-[#00d4ff]/90 font-mono uppercase tracking-widest"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> try again as {name}
              </Button>
              <Button
                variant="ghost"
                onClick={restart}
                className="font-mono uppercase tracking-widest text-neutral-400 hover:text-[#00d4ff]"
              >
                new character →
              </Button>
            </div>
            </div>
          </div>

        )}

        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="expanded image"
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={lightboxImage}
                alt={lightboxAlt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg border border-[#00d4ff]/40"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute top-2 right-2">
                <Button
                  onClick={() => setLightboxImage(null)}
                  size="icon"
                  variant="ghost"
                  aria-label="close lightbox"
                  className="bg-black/40 hover:bg-black/60 p-1 rounded-md"
                >
                  <span className="text-[#00d9ff] text-sm sm:text-base lg:text-lg xl:text-xl font-bold leading-none">✕</span>
                </Button>
              </div>
              <div className="absolute top-2 left-2">
                <DownloadOverlayButton
                  src={lightboxImage}
                  fileName={`${name || "image"}_${Date.now()}.png`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Story;
