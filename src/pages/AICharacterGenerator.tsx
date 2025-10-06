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

  const generateCharacter = async () => {
    if (!characterName.trim()) {
      toast.error("Please provide a name");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a photorealistic image of ${characterName}, a ${gender} ${species} from a distant future where humans live underground under the desert, androids inhabit the ruins of old cities, and cyborgs exist with different combinations of human, robot and synthetic android parts. ${
        species === "human" ? "This is a human who has adapted to underground life." :
        species === "android" ? "This is an android that roams the ruins of old cities." :
        "This is a cyborg with a unique combination of human, robot and synthetic android parts."
      } The setting is a dark sci-fi dystopian future. Make it highly detailed and atmospheric.`;

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

  const renderTitle = () => {
    return (
      <span className="inline-flex items-baseline">
        <span style={{ fontWeight: 500 }}>paradoxxia</span>
        <span style={{ fontWeight: 100 }} className="ml-4">character</span>
        <span style={{ fontWeight: 500 }} className="ml-4">generator</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Circuit board background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M20 20h40v40h-40z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
              <circle cx="40" cy="40" r="2" fill="currentColor" className="text-primary"/>
              <path d="M60 40h20M40 60v20M100 20h20v20M140 100h20v20" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
              <circle cx="80" cy="40" r="1.5" fill="currentColor" className="text-primary"/>
              <circle cx="40" cy="80" r="1.5" fill="currentColor" className="text-primary"/>
              <circle cx="120" cy="40" r="2" fill="currentColor" className="text-primary"/>
              <circle cx="160" cy="120" r="2" fill="currentColor" className="text-primary"/>
              <path d="M120 40v20h20M40 80h20v20" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border relative">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            ← Back to Home
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
                <Label className="text-sm font-medium text-foreground">Species</Label>
                <RadioGroup value={species} onValueChange={setSpecies} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="human" id="human" />
                    <Label htmlFor="human" className="cursor-pointer">Human</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="android" id="android" />
                    <Label htmlFor="android" className="cursor-pointer">Android</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cyborg" id="cyborg" />
                    <Label htmlFor="cyborg" className="cursor-pointer">Cyborg</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Name
                </Label>
                <Input
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter character name..."
                  className="bg-background"
                />
              </div>
            )}

            <Button
              onClick={step < 3 ? handleNext : generateCharacter}
              disabled={isGenerating}
              variant="outline"
              className="w-full bg-white/20 border-white/20 hover:bg-white/30 text-foreground uppercase tracking-wider"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Character...
                </>
              ) : step < 3 ? (
                "Next"
              ) : (
                "Generate Character"
              )}
            </Button>
          </Card>

          {/* Output Section */}
          {generatedImage && (
            <Card className="p-6 bg-card border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {characterName}
              </h2>
              <img 
                src={generatedImage} 
                alt={characterName}
                className="w-full rounded-lg"
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AICharacterGenerator;
