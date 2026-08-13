import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics, trackEvent } from "@/components/GoogleAnalytics";
import GlitchTitle from "@/components/paradoxxia/GlitchTitle";
import circuitBg from "@/assets/paradoxxia-bg.png";
import { supabase } from "@/integrations/supabase/client";

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
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [cardImage, setCardImage] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyCount = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const generateImage = async (prompt: string) => {
    const { data, error } = await supabase.functions.invoke("generate-character-image", {
      body: { prompt, timestamp: Date.now() },
    });
    if (error) throw error;
    if (!data?.imageUrl) throw new Error("No image returned");
    return data.imageUrl as string;
  };

  const generateCard = async (finalName: string) => {
    setCardLoading(true);
    try {
      const url = await generateImage(
        `A cinematic full-body character card portrait of ${finalName}, a ${gender} ${species} survivor in the Cyber Boondocks — a scorched dystopian sci-fi frontier of rust, dust, neon and static. Battered functional clothing and improvised gear, weathered skin, dramatic moody rim lighting with cool cyan and deep blue accents, shallow depth of field, dark atmospheric background. Ultra photorealistic cinematic still, no text or captions other than the required watermark.`,
      );
      setCardImage(url);
    } catch (error) {
      console.error("card image error:", error);
    } finally {
      setCardLoading(false);
    }
  };

  const generateSceneImage = async (sceneText: string, msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, imageLoading: true } : m)),
    );
    try {
      const url = await generateImage(
        `An atmospheric cinematic sci-fi scene illustrating this moment in a scorched dystopian frontier called the Cyber Boondocks: "${sceneText.replace(/[*"]/g, "").slice(0, 700)}". Include PARADOXXIA where relevant — an android with a porcelain-white synthetic face, long dark hair, glowing cyan eyes and battered chrome armor over an exposed robotic endoskeleton. Rust, dust, neon, static, volumetric light. Ultra photorealistic cinematic film still, no text or captions other than the required watermark.`,
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
    } catch (error) {
      console.error("story chat error:", error);
      toast.error((error as Error).message || "Signal lost");
    } finally {
      setIsStreaming(false);
    }
  };

  const beginEncounter = async () => {
    const finalName = name.trim() || randomName();
    if (!name.trim()) {
      setName(finalName);
      toast.success("Generated random name");
    }
    setStarted(true);
    trackEvent("Story", "Begin Encounter", `${species}-${gender}-${finalName}`);
    replyCount.current = 0;
    void generateCard(finalName);
    const opening: ChatMessage[] = [
      {
        role: "user",
        content: `I am ${finalName}, a ${gender} ${species}. Begin the encounter: describe the moment we meet in the Cyber Boondocks and speak your first words to me.`,
      },
    ];
    await streamReply(opening);
    setMessages((prev) => prev.filter((m) => m.role === "assistant"));
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    await streamReply(history);
  };

  const restart = () => {
    setMessages([]);
    setStarted(false);
    setStep(1);
    setSpecies("");
    setGender("");
    setName("");
    setCardImage("");
    setCardLoading(false);
    replyCount.current = 0;
  };

  const handleNext = () => {
    if (step === 1 && !species) return toast.error("choose a species");
    if (step === 2 && !gender) return toast.error("choose a gender");
    if (step < 3) return setStep(step + 1);
    beginEncounter();
  };

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
                <GlitchTitle subtitleWords={["story", "mode"]} compact={started} />
              </h1>
              {!started && (
                <p className="text-foreground max-w-2xl mx-auto font-roc text-base sm:text-xl">
                  <span style={{ fontWeight: 300 }}>step into the wastes and</span>{" "}
                  <span className="font-medium">encounter</span>{" "}
                  <span style={{ fontWeight: 300 }}>paradoxxia</span>
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

                <Button
                  onClick={handleNext}
                  className="w-full font-roc font-medium bg-[#0a1e5c] dark:bg-[#00d4ff] dark:text-neutral-950 hover:bg-[#0a1e5c]/90 dark:hover:bg-[#00d4ff]/90"
                >
                  {step < 3 ? "next" : "begin the encounter"}
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
                          <img
                            src={cardImage}
                            alt={`${name}, a ${gender} ${species} in the Cyber Boondocks`}
                            className="w-full aspect-square object-cover"
                            loading="lazy"
                          />
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

                  {messages.map((m, i) => (
                    <div
                      key={m.id ?? i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-[#0a1e5c] text-white dark:bg-[#00d4ff] dark:text-neutral-950 font-roc"
                            : "bg-muted text-foreground font-mono"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                            パラドクシア
                          </span>
                        )}
                        {m.content}
                        {m.image && (
                          <img
                            src={m.image}
                            alt="Scene from the encounter with Paradoxxia"
                            className="mt-2 w-full max-w-sm rounded-md border border-border dark:border-[#00d4ff]/30"
                            loading="lazy"
                          />
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
      </div>
    </div>
  );
};

export default Story;
