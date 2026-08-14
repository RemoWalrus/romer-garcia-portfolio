import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Send, RotateCcw, Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const CHAT_ENDPOINT = "https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/story-chat";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aWd0YnhxZ2JkY2ZwbW5yenZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNzQyNjUsImV4cCI6MjA1NDY1MDI2NX0.N9TKpkYmeitE3kthByFOnmR0gKBvBrMshEXez6D5IU8";

// how many assistant replies between scene illustrations
const SCENE_EVERY = 3;

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



const OPTION_CLASSES =
  "flex-1 min-w-[100px] font-roc font-medium dark:border-[#00d4ff]/30 dark:text-neutral-300";
const ACTIVE_CLASSES =
  "flex-1 min-w-[100px] font-roc font-medium bg-[#0a1e5c] dark:bg-[#00d4ff] dark:text-neutral-950 hover:bg-[#0a1e5c]/90 dark:hover:bg-[#00d4ff]/90 dark:border-transparent";

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
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState("");
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const replyCount = useRef(0);
  const autoStarted = useRef(false);
  const introRequested = useRef(false);
  const cardImageRef = useRef("");

  const setCardImageAndRef = (url: string) => {
    cardImageRef.current = url;
    setCardImage(url);
  };




  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-start from query params or persisted character data
  useEffect(() => {
    if (autoStarted.current || started) return;

    const autoStart = searchParams.get("autostart");
    const autoName = searchParams.get("name")?.trim();
    const autoSpecies = searchParams.get("species")?.trim();
    const autoGender = searchParams.get("gender")?.trim();

    let source: { name: string; species: string; gender: string } | null = null;
    if (autoStart && autoName && autoSpecies && autoGender) {
      source = { name: autoName, species: autoSpecies, gender: autoGender };
    } else {
      try {
        const saved = localStorage.getItem("paradoxxia_story_character");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.autostart && parsed.name?.trim() && parsed.species?.trim() && parsed.gender?.trim()) {
            source = { name: parsed.name.trim(), species: parsed.species.trim(), gender: parsed.gender.trim() };
          }
        }
      } catch {
        // ignore malformed storage
      }
    }

    if (source) {
      autoStarted.current = true;
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
        `A cinematic full-body character card portrait of ${finalName}, a ${startGender ?? gender} ${startSpecies ?? species} survivor in the Cyber Boondocks — a scorched dystopian sci-fi frontier of rust, dust, neon and static. Battered functional clothing and improvised gear, weathered skin, dramatic moody rim lighting with cool cyan and deep blue accents, shallow depth of field, dark atmospheric background.${uploadedPhoto ? " CRITICAL: the attached reference photo is this character — faithfully match the reference face's structure, features, skin tone and hair so they are recognisably the same person." : ""} Ultra photorealistic cinematic still, no text or captions other than the required watermark.`,
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
  const playIntroVideo = async (
    portrait: string,
    finalName: string,
    startSpecies?: string,
    startGender?: string,
  ) => {
    if (introRequested.current || !portrait) return;
    introRequested.current = true;
    setIntroStatus("rendering");
    try {
      const { data, error } = await supabase.functions.invoke("story-video", {
        body: {
          action: "create",
          imageDataUrl: portrait.startsWith("data:") ? portrait : undefined,
          prompt: `Cinematic 5 second intro of ${finalName}, a ${startGender ?? gender} ${startSpecies ?? species} survivor, standing in the scorched Cyber Boondocks. Slow camera push-in, drifting dust, flickering failing neon, wind moving hair and battered clothing, a slow turn of the head toward camera. Ultra photorealistic, moody cool cyan rim light, no text.`,
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
          character: { name, species, gender },
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
    const clean = sceneText.replace(/[*"]/g, "").slice(0, 700);
    const mentionsParadoxxia = /paradoxxia/i.test(clean);
    const androidClause = mentionsParadoxxia
      ? "If a white-faced android figure appears, she is distant, half-hidden or barely glimpsed — never posed, never centered, never facing the camera directly: a domestic android with a porcelain-white synthetic face, long dark hair, faint glowing cyan eyes and battered chrome plating, seen far off through dust, doorways or wreckage."
      : "Do NOT include any white-faced android character in this image. Show only the world and whatever the described moment contains — scavengers in small wary groups, collective-minded androids moving in eerie unison, or a lone feral robot or mutant.";
    try {
      const url = await generateImage(
        `${reference ? `TASK: take the attached reference image of ${name} and place THAT EXACT SAME CHARACTER into a new scene. This is a character-consistency task, not a new character design. Copy from the reference, without altering them: face shape, facial features, eye colour, skin tone, hair colour/length/style, facial hair, age, body type, and their outfit, armour, gear and colour palette. Same person, same wardrobe — only the pose, camera angle, lighting and background change. If any detail is unclear in the reference, keep it as close to the reference as possible rather than inventing something new. ` : ""}Scene to depict: a cinematic third-person film still of ${name}, a ${gender} ${species} survivor, caught in the middle of this exact moment in the Cyber Boondocks — a lawless scorched no man's land: "${clean}". The camera watches from outside, showing the character interacting with the world rather than looking through their eyes. Dramatic rim lighting with cool cyan and deep blue accents. ${androidClause} Emphasize place and action: rust, dust, failing neon, static, volumetric light, ruined architecture, dead machinery, makeshift camps. The character should be clearly visible and recognisable as the reference person, but part of the scene, not posed for a portrait. Ultra photorealistic cinematic film still, natural framing, no text or captions other than the required watermark.`,
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
        body: JSON.stringify({ messages: history, character: { name, species, gender } }),
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
            if (!placed) {
              placed = true;
              setMessages((prev) => [...prev, { role: "assistant", content: assistantText, id: msgId }]);
            } else {
              setMessages((prev) =>
                prev.map((m) => (m.id === msgId ? { ...m, content: assistantText } : m)),
              );
            }
          } catch {
            // partial JSON chunk — ignore
          }
        }
      }

      if (!assistantText) throw new Error("No response from Paradoxxia.");

      // illustrate the scene every few replies to keep the story visual
      replyCount.current += 1;
      if (replyCount.current % SCENE_EVERY === 1) {
        void generateSceneImage(assistantText, msgId);
      }
      void fetchOptions([...history, { role: "assistant", content: assistantText }]);
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
    trackEvent("Story", "Begin Encounter", `${startSpecies ?? species}-${startGender ?? gender}-${finalName}`);
    replyCount.current = 0;
    setOptions([]);
    void generateCard(finalName, startSpecies, startGender).then((portrait) => {
      if (portrait) void playIntroVideo(portrait, finalName, startSpecies, startGender);
    });
    const opening: ChatMessage[] = [
      {
        role: "user",
        content: `I am ${finalName}, a ${startGender ?? gender} ${startSpecies ?? species}. Open the story: first, in one short paragraph, describe me — how I look, what I carry, what I have survived — then describe exactly where I am right now and the situation I am caught in at this moment: what I can see, hear and smell, what I need, and what is pressing in on me. Do not introduce Paradoxxia yet. End with an opening that lets me act.`,
      },
    ];

    await streamReply(opening);
    setMessages((prev) => prev.filter((m) => m.role === "assistant"));
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
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
    setCardImageAndRef("");
    setCardLoading(false);
    setOptions([]);
    setIntroVideo("");
    setIntroStatus("idle");
    introRequested.current = false;
    replyCount.current = 0;
  };


  // the setup screen IS the character generator page — it hands the character over here
  const handleGeneratorContinue = (character: {
    name: string;
    species: string;
    gender: string;
    image: string;
    photo: string;
  }) => {
    const finalName = character.name.trim() || randomName();
    setName(finalName);
    setSpecies(character.species);
    setGender(character.gender);
    setUploadedPhoto(character.photo || "");
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
    <div className="fixed inset-0 bg-background overflow-x-hidden overflow-y-auto">
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Paradoxxia Story | Roleplay an Encounter" />
        <meta
          name="twitter:description"
          content="Create your character and roleplay a live encounter with Paradoxxia in the Cyber Boondocks."
        />
      </Helmet>

      <div className="min-h-full flex flex-col pb-safe">
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
          className={`container mx-auto px-4 relative z-10 flex-1 pb-10 ${
            started ? "pt-20 sm:pt-24" : "py-16 mt-16"
          } transition-all duration-500`}
        >
          <div className={`max-w-3xl mx-auto ${started ? "space-y-4" : "space-y-8"}`}>
            <div className={`text-center ${started ? "space-y-2" : "space-y-6"}`}>
              <h1
                className={`hero-title font-bold text-foreground px-4 ${
                  started ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                } transition-all duration-500`}
              >
                <GlitchTitle
                  subtitleWords={started ? ["story", "mode"] : ["character", "generator"]}
                  compact={started}
                />
              </h1>
              {!started && (
                <p className="text-foreground max-w-2xl mx-auto font-roc text-base sm:text-xl">
                  <span style={{ fontWeight: 300 }}>forge unique beings from the depths</span>{" "}
                  <span className="font-medium">of the</span>{" "}
                  <span style={{ fontWeight: 300 }}>paradoxxia universe</span>
                </p>
              )}

            </div>

            {!started && (
              <Card className="p-4 space-y-4 bg-card border-border dark:border-[#00d4ff]/30">
                {step === 1 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground font-roc">species:</Label>
                    <div className="flex flex-wrap gap-2">
                      {["human", "android", "other"].map((opt) => (
                        <Button
                          key={opt}
                          variant={species === opt ? "default" : "outline"}
                          onClick={() => setSpecies(opt)}
                          className={species === opt ? ACTIVE_CLASSES : OPTION_CLASSES}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground font-roc">gender:</Label>
                    <div className="flex flex-wrap gap-2">
                      {["male", "female", "other"].map((opt) => (
                        <Button
                          key={opt}
                          variant={gender === opt ? "default" : "outline"}
                          onClick={() => setGender(opt)}
                          className={gender === opt ? ACTIVE_CLASSES : OPTION_CLASSES}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground font-roc">name:</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="enter your character name..."
                      className="bg-background w-full"
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-foreground font-roc">
                      upload photo (optional):
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo to use as reference for your character
                    </p>
                    {uploadedPhoto ? (
                      <div className="relative h-[20vh] overflow-hidden flex items-center justify-center bg-black/10 rounded-lg">
                        <img
                          src={uploadedPhoto}
                          alt="Uploaded reference"
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setUploadedPhoto("")}
                          className="absolute top-2 right-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handlePhotoUpload} variant="outline" className="w-full">
                        Take Photo or Choose from Gallery
                      </Button>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleNext}
                  className="w-full font-roc font-medium bg-[#0a1e5c] dark:bg-[#00d4ff] dark:text-neutral-950 hover:bg-[#0a1e5c]/90 dark:hover:bg-[#00d4ff]/90"
                >
                  {step < 4 ? "next" : "begin the encounter"}
                </Button>
              </Card>
            )}


            {started && (
              <Card className="bg-card/90 backdrop-blur-sm border-border dark:border-[#00d4ff]/30 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border dark:border-[#00d4ff]/20">
                  <span className="text-xs font-mono text-muted-foreground">
                    {name} · {gender} {species}
                  </span>
                  <Button variant="ghost" size="sm" onClick={restart} className="text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" /> restart
                  </Button>
                </div>

                <div
                  ref={scrollRef}
                  className="h-[55vh] sm:h-[60vh] overflow-y-auto px-4 py-4 space-y-4"
                >
                  {(cardImage || cardLoading) && (
                    <div className="flex justify-center">
                      <div className="w-40 sm:w-48 rounded-lg overflow-hidden border border-border dark:border-[#00d4ff]/40 bg-muted">
                        {cardImage ? (
                          <div className="relative">
                            <img
                              src={cardImage}
                              alt={`${name}, a ${gender} ${species} in the Cyber Boondocks`}
                              className="w-full aspect-square object-cover"
                              loading="lazy"
                            />
                            <ExpandButton
                              onClick={() => {
                                setLightboxImage(cardImage);
                                setLightboxAlt(`${name}, a ${gender} ${species} in the Cyber Boondocks`);
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
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <div className="px-2 py-1 text-center">
                          <span className="block text-[11px] font-roc font-medium text-foreground truncate">
                            {name}
                          </span>
                          <span className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                            {gender} {species}
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
                        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Download
                          className="h-4 w-4"
                          style={{
                            color: "#00d9ff",
                            filter: "drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))",
                          }}
                        />
                        download intro sequence
                      </button>
                    </div>
                  )}





                  {messages.map((m, i) => (
                    <div
                      key={m.id ?? i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-[#0a1e5c] text-white dark:bg-[#00d4ff] dark:text-neutral-950 font-roc"
                            : "bg-muted text-foreground font-roc text-[15px]"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                            パラドクシア
                          </span>
                        )}
                        {m.role === "assistant" ? (
                          <TypewriterText text={m.content} speed={34} />
                        ) : (
                          m.content
                        )}
                        {m.image && (
                          <div className="relative mt-2 w-full max-w-sm">
                            <img
                              src={m.image}
                              alt="Scene from the encounter with Paradoxxia"
                              className="w-full rounded-md border border-border dark:border-[#00d4ff]/30"
                              loading="lazy"
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

                        {m.imageLoading && !m.image && (
                          <span className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" /> rendering scene...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {isStreaming && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <Loader2 className="w-3 h-3 animate-spin" /> transmitting...
                    </div>
                  )}
                </div>

                {(options.length > 0 || optionsLoading) && !isStreaming && (
                  <div className="border-t border-border dark:border-[#00d4ff]/20 px-3 pt-3 space-y-2">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      choose an action
                    </span>
                    {optionsLoading ? (
                      <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Loader2 className="w-3 h-3 animate-spin" /> weighing your options...
                      </span>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        {options.map((option) => (
                          <Button
                            key={option}
                            variant="outline"
                            onClick={() => void send(option)}
                            className="flex-1 h-auto py-2 whitespace-normal text-left justify-start text-xs font-roc dark:border-[#00d4ff]/30 dark:text-neutral-300"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-border dark:border-[#00d4ff]/20 p-3 flex gap-2 items-end">

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
                    className="bg-background resize-none min-h-[42px] max-h-32 text-sm"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isStreaming || !input.trim()}
                    className="bg-[#0a1e5c] dark:bg-[#00d4ff] dark:text-neutral-950 hover:bg-[#0a1e5c]/90 dark:hover:bg-[#00d4ff]/90"
                  >
                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
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
                <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00d4ff]">
                  <Loader2 className="w-3 h-3 animate-spin" /> rendering intro sequence...
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
                        className="h-12 w-12"
                        style={{
                          color: "#00d9ff",
                          filter: "drop-shadow(0 0 12px rgba(0, 217, 255, 0.8))",
                        }}
                      />
                      <span className="text-sm font-roc font-medium text-[#00d9ff] uppercase tracking-widest">
                        click to download intro sequence
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      onClick={() => setIntroStatus("done")}
                      className="mt-8 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-[#00d4ff]"
                    >
                      continue to story →
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => setIntroStatus("done")}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-[#00d4ff]"
                  >
                    skip intro →
                  </Button>
                )}
              </div>
            )}
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
                  <span className="text-[#00d9ff] text-xs font-bold leading-none">✕</span>
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
