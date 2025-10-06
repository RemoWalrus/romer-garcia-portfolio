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
  const [prompt, setPrompt] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [gender, setGender] = useState("");
  const [generatedCharacter, setGeneratedCharacter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCharacter = async () => {
    if (!prompt.trim() && !characterName.trim() && !gender.trim()) {
      toast.error("Please provide at least a gender, character name, or description");
      return;
    }

    setIsGenerating(true);
    try {
      const fullPrompt = `Generate a detailed character for the Paradoxxia universe. ${
        characterName ? `Character name: ${characterName}.` : ""
      } ${gender ? `Gender: ${gender}.` : ""} ${prompt ? `Additional details: ${prompt}` : ""}
      
      Include:
      - Full character description and appearance
      - Personality traits and quirks
      - Background story
      - Special abilities or skills
      - Role in the Paradoxxia universe
      - Notable relationships or conflicts
      
      Make it creative, unique, and fitting for a dark sci-fi/fantasy setting.`;

      const { data, error } = await supabase.functions.invoke("generate-character", {
        body: { prompt: fullPrompt },
      });

      if (error) throw error;

      setGeneratedCharacter(data.character);
      toast.success("Character generated!");
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
        <span className="font-bold">paradoxxia</span>
        <span className="font-thin ml-4">character</span>
        <span className="font-bold ml-4">generator</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-24 mt-16">
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
                className="hero-title text-6xl md:text-8xl lg:text-9xl font-bold text-foreground px-4 relative z-10"
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
                  className="hero-title text-6xl md:text-8xl lg:text-9xl font-bold text-foreground px-4 opacity-70"
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

          {/* Input Section */}
          <Card className="p-6 space-y-6 bg-card border-border">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Name (Optional)
              </Label>
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name..."
                className="bg-background"
              />
            </div>

            <Button
              onClick={generateCharacter}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Character...
                </>
              ) : (
                "Generate Character"
              )}
            </Button>
          </Card>

          {/* Output Section */}
          {generatedCharacter && (
            <Card className="p-6 bg-card border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Generated Character
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">
                  {generatedCharacter}
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AICharacterGenerator;
