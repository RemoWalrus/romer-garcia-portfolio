import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const AICharacterGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [generatedCharacter, setGeneratedCharacter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCharacter = async () => {
    if (!prompt.trim() && !characterName.trim()) {
      toast.error("Please provide at least a character name or description");
      return;
    }

    setIsGenerating(true);
    try {
      const fullPrompt = `Generate a detailed character for the Paradoxxia universe. ${
        characterName ? `Character name: ${characterName}.` : ""
      } ${prompt ? `Additional details: ${prompt}` : ""}
      
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              Paradoxxia Character Generator
            </h1>
            <p className="text-xl text-muted-foreground">
              Forge unique beings from the depths of the Paradoxxia universe
            </p>
          </div>

          {/* Input Section */}
          <Card className="p-6 space-y-6 bg-card border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Character Name (Optional)
              </label>
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name..."
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Character Details (Optional)
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your character (traits, role, species, abilities, etc.)..."
                className="min-h-32 bg-background"
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
