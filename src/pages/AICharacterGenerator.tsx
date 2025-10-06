import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { glitchVariants, pixelGlitch } from "@/components/hero/animation-variants";
import circuitBg from "@/assets/circuit-background.png";

const AICharacterGenerator = () => {
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (step === 1 && !species) {
      toast.error("Please select a species");
      return;
    }
    if (step === 2 && !gender) {
      toast.error("Please select a gender");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const duplicateX = (text: string) => {
    return text.replace(/x/gi, (match) => match + match);
  };

  const generateCharacter = async () => {
    if (!characterName.trim()) {
      toast.error("Please provide a name");
      return;
    }

    setIsGenerating(true);
    try {
      const processedName = duplicateX(characterName);
      
      const clothingDescription = species === "android" && Math.random() > 0.5 
        ? "wearing practical desert clothing made from hemp, linen, and cotton" 
        : species === "cyborg" && Math.random() > 0.5
        ? "wearing practical desert clothing made from hemp, linen, and cotton"
        : species === "human"
        ? "wearing practical desert clothing made from hemp, linen, and cotton designed to withstand harsh desert weather"
        : "in their typical android form";

      const location = species === "human" 
        ? "an underground human settlement with practical architecture" 
        : species === "android"
        ? "the ruins of an old city with crumbling buildings and overgrown structures"
        : Math.random() > 0.5 
        ? "an underground human settlement" 
        : "the ruins of an old city";

      const nameDisplay = species === "human"
        ? `wearing visible dog tags with the name "${processedName}" clearly engraved on them`
        : species === "android"
        ? `with the name "${processedName}" laser-etched in futuristic typography on a visible body panel`
        : Math.random() > 0.5
        ? `wearing visible dog tags with the name "${processedName}" clearly engraved on them`
        : `with the name "${processedName}" laser-etched in futuristic typography on a visible body panel`;

      const prompt = `Generate a hyper-realistic, 3D rendered full-body sci-fi image of ${processedName}, a ${gender} ${species} in action within ${location}. ${
        species === "human" ? "This human has adapted to underground desert life, with weathered features from the harsh environment." :
        species === "android" ? "This is a sleek synthetic android with realistic human-like features but with subtle mechanical elements visible." :
        "This is a cyborg with seamless integration of human flesh, robotic components, and synthetic android parts."
      } ${clothingDescription}. The character is ${nameDisplay}. Show the full body of the character in a dynamic action pose, clearly visible in the foreground, with the environment visible around them but not dominating the scene. The aesthetic is hard sci-fi, not fantasy - think blade runner meets dune. Photorealistic 3D rendering style. CRITICAL: Show ONLY this single character - absolutely no other people or characters in the image. The name on the dog tags or body panel must be clearly legible. Highly detailed textures and realistic lighting.`;

      const { data, error } = await supabase.functions.invoke("generate-character-image", {
        body: { prompt },
      });

      if (error) throw error;

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Character image generated!");
      }
    } catch (error: any) {
      console.error("Error generating character:", error);
      toast.error(error.message || "Failed to generate character");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderBackButton = () => {
    return (
      <span className="inline-flex items-baseline">
        <span style={{ fontWeight: 100 }}>← back</span>
        <span style={{ fontWeight: 500 }} className="ml-2">to</span>
        <span style={{ fontWeight: 100 }} className="ml-2">home</span>
      </span>
    );
  };

  const renderTitle = () => {
    return (
      <span className="inline-flex items-baseline">
        <span style={{ fontWeight: 500 }}>paradodoxia</span>
        <span style={{ fontWeight: 100 }} className="ml-4">character</span>
        <span style={{ fontWeight: 500 }} className="ml-4">generator</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Circuit board background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${circuitBg})` }}
      />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border relative">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {renderBackButton()}
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-24 mt-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Animated Header */}
          <motion.div 
            className="text-center space-y-6"
            variants={glitchVariants}
            initial="initial"
            animate="animate"
          >
            <div className="relative">
              <h1 
                className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4 relative z-10"
                style={{
                  textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'var(--font-roc)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em'
                }}
              >
                {renderTitle()}
              </h1>
              <motion.div
                className="absolute inset-0 z-0"
                variants={pixelGlitch}
                style={{
                  clipPath: "inset(0 0 0 0)"
                }}
              >
                <h1 
                  className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4 opacity-70"
                  style={{
                    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'var(--font-roc)',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {renderTitle()}
                </h1>
              </motion.div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Forge unique beings from the depths of the Paradoxxia universe
            </p>
          </motion.div>

          {/* Sequential Prompt Section */}
          <Card className="p-6 space-y-6 bg-card border-border">
            {step === 1 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium text-foreground whitespace-nowrap">species:</Label>
                  <RadioGroup value={species} onValueChange={setSpecies} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="human" id="human" />
                      <Label htmlFor="human" className="cursor-pointer">human</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="android" id="android" />
                      <Label htmlFor="android" className="cursor-pointer">android</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cyborg" id="cyborg" />
                      <Label htmlFor="cyborg" className="cursor-pointer">cyborg</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium text-foreground whitespace-nowrap">gender:</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                    name:
                  </Label>
                  <Input
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="enter character name..."
                    className="bg-background flex-1"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={step < 3 ? handleNext : generateCharacter}
              disabled={isGenerating}
              variant="outline"
              className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-foreground tracking-wider"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  generating character...
                </>
              ) : step < 3 ? (
                "next"
              ) : (
                "generate character"
              )}
            </Button>
          </Card>

          {/* Output Section */}
          {generatedImage && (
            <Card className="p-6 bg-card border-border">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {duplicateX(characterName)}
                  </h2>
                  <p className="text-muted-foreground capitalize">
                    {species}
                  </p>
                </div>
                <img 
                  src={generatedImage} 
                  alt={duplicateX(characterName)}
                  className="w-full rounded-lg"
                />
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AICharacterGenerator;
