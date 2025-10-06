import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, SquareArrowUp } from "lucide-react";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { glitchVariants, pixelGlitch } from "@/components/hero/animation-variants";
import circuitBg from "@/assets/circuit-background.png";
import paradoxxiaPoster from "@/assets/paradoxxia-poster.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";

const AICharacterGenerator = () => {
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState("");
  const [actualSpecies, setActualSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [displayName, setDisplayName] = useState("");
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

  const handleStartOver = () => {
    setStep(1);
    setSpecies("");
    setActualSpecies("");
    setGender("");
    setCharacterName("");
    setDisplayName("");
    setGeneratedImage("");
  };

  const duplicateX = (text: string) => {
    // Don't duplicate x if it's already part of a consecutive xx
    return text.replace(/x/gi, (match, offset, str) => {
      const prevChar = str[offset - 1];
      const nextChar = str[offset + 1];
      
      // Don't duplicate if previous OR next character is also x
      if ((prevChar && prevChar.toLowerCase() === 'x') || 
          (nextChar && nextChar.toLowerCase() === 'x')) {
        return match;
      }
      return match + match;
    });
  };

  const hasTripleX = (text: string) => {
    return /xxx/i.test(text);
  };

  const generateRandomName = () => {
    const prefixes = ["Kry", "Zor", "Ral", "Cal", "Del", "Lur", "Mir", "Pel"];
    const middles = ["ar", "er", "or", "yn", "an", "el", "il", "on"];
    const suffixes = ["ion", "us", "is", "os", "yn", "or", "ar", "on", "el"];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const middle = Math.random() > 0.5 ? middles[Math.floor(Math.random() * middles.length)] : "";
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return prefix + middle + suffix;
  };

  const generateCharacter = async () => {
    let finalName = characterName.trim();
    
    if (!finalName) {
      finalName = generateRandomName();
      toast.success("Generated random name");
    }

    setIsGenerating(true);
    try {
      // Process name through duplicateX first
      let processedName = duplicateX(finalName);
      console.log("Original name:", finalName);
      console.log("Processed name after duplicateX:", processedName);
      
      // If it's a Paradoxia variant with 3+ X's, normalize to Paradoxxia
      if (/parado[x]{3,}ia/i.test(processedName)) {
        processedName = "Paradoxxia";
        console.log("Normalized to Paradoxxia due to 3+ x's");
      }
      
      // Store the processed name for display
      setDisplayName(processedName);
      
      console.log("Checking if paradoxxia:", processedName.toLowerCase() === "paradoxxia");
      
      // Check if name is "Paradoxxia" or becomes "Paradoxxia" after processing (case-insensitive)
      if (processedName.toLowerCase() === "paradoxxia") {
        setActualSpecies("android"); // Paradoxxia is always an android
        setDisplayName(processedName);
        
        // Generate a new pose using the provided image with a public URL
        const publicImageUrl = `${window.location.origin}/paradoxxia-poster.jpg`;
        const editPrompt = "Generate a closer, more zoomed-in dynamic pose of this exact character maintaining ALL the same visual characteristics: the same face, same long dark hair, same bright cyan/neon blue glowing eyes, same golden/bronze armored suit design, same body proportions, and same overall appearance. Show the character from mid-thigh up or closer (NOT full body - zoom in more) in a new dramatic action pose from an interesting angle in a DIFFERENT dystopian sci-fi environment - NOT ruins, but perhaps an abandoned industrial complex, a desolate wasteland with strange structures, a dark underground facility, or a dystopian cityscape. Frame the shot to show the character LARGER and more prominent - closer camera angle, heroic perspective. Keep EVERYTHING about the character's visual design identical - only change the pose, camera angle (closer/zoomed), and the background environment completely. Hyper-realistic 3D rendering style with the same dark, grim atmosphere. MANDATORY: The image MUST be 1:1 square format (1024x1024 pixels) - this is NON-NEGOTIABLE.";
        
        const { data, error } = await supabase.functions.invoke("generate-character-image", {
          body: { 
            prompt: editPrompt,
            imageUrl: publicImageUrl
          },
        });

        if (error) throw error;

        if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
          toast.success("Paradoxxia revealed in new pose!");
        }
        setIsGenerating(false);
        return;
      }

      
      
      // Special case: names with exactly 3 X's create a defective being
      const isDefective = hasTripleX(processedName);
      
      // Special case: both "other" selections create a non-humanoid creature
      let selectedSpecies = species;
      if (isDefective) {
        selectedSpecies = "defective";
      } else if (species === "other" && gender === "other") {
        selectedSpecies = "creature";
      } else if (species === "other") {
        const otherOptions = ["cyborg", "mutant", "robot"];
        selectedSpecies = otherOptions[Math.floor(Math.random() * otherOptions.length)];
      }
      setActualSpecies(selectedSpecies);
      
      const clothingDescription = selectedSpecies === "defective"
        ? "with damaged, malfunctioning cybernetic parts and torn, deteriorating clothing showing severe wear and malfunction"
        : selectedSpecies === "creature"
        ? "with organic or biomechanical elements integrated into its form"
        : selectedSpecies === "android" && Math.random() > 0.5
        ? "wearing practical desert clothing made from hemp, linen, and cotton" 
        : selectedSpecies === "cyborg" && Math.random() > 0.5
        ? "wearing practical desert clothing made from hemp, linen, and cotton"
        : selectedSpecies === "human"
        ? "wearing practical desert clothing made from hemp, linen, and cotton designed to withstand harsh desert weather"
        : selectedSpecies === "robot"
        ? "in their mechanical form with possible clothing elements"
        : selectedSpecies === "mutant"
        ? "wearing practical desert clothing made from hemp, linen, and cotton, with visible mutations"
        : "in their typical android form";

      const location = selectedSpecies === "defective"
        ? "a junkyard or scrapyard filled with broken machinery and failed experiments"
        : selectedSpecies === "creature"
        ? Math.random() > 0.5 ? "the desert surface with alien rock formations" : "underground caverns with bioluminescent features"
        : selectedSpecies === "human" 
        ? "an underground human settlement with practical architecture" 
        : selectedSpecies === "android"
        ? "the ruins of an old city with crumbling buildings and overgrown structures"
        : selectedSpecies === "robot"
        ? "the ruins of an old city with mechanical debris"
        : selectedSpecies === "mutant"
        ? Math.random() > 0.5 ? "the desert surface" : "underground caverns"
        : Math.random() > 0.5
        ? "an underground human settlement" 
        : "the ruins of an old city";

      const nameDisplay = selectedSpecies === "defective"
        ? `with the name "${processedName}" partially erased or glitching on a damaged display panel or broken tag`
        : selectedSpecies === "creature"
        ? `with the name "${processedName}" marked or etched somewhere on its body in an alien script or biomechanical marking`
        : selectedSpecies === "human"
        ? `wearing visible dog tags with the name "${processedName}" clearly engraved on them`
        : selectedSpecies === "android"
        ? `with the name "${processedName}" subtly laser-etched in small, refined futuristic typography on a body panel - barely visible but present`
        : selectedSpecies === "robot"
        ? `with the name "${processedName}" etched in futuristic typography on a visible body panel`
        : selectedSpecies === "mutant"
        ? `wearing visible dog tags with the name "${processedName}" clearly engraved on them`
        : Math.random() > 0.5
        ? `wearing visible dog tags with the name "${processedName}" clearly engraved on them`
        : `with the name "${processedName}" laser-etched in futuristic typography on a visible body panel`;

      const androidFaceDescription = gender === "other"
        ? "This synthetic android has an androgynous humanoid form with a distinctive white face plate made of 1-4 smooth panels. The face has gender-neutral features with soft, balanced contours, subtle nose and mouth. The android has neon blue illuminated cybernetic eyes. It may have animal-like add-ons (tail, ears, enhanced limbs) or vehicle-like components (wheels, thrusters, mechanical appendages) integrated into its design. " + (Math.random() > 0.5 ? "Synthetic hair or fiber-optic cables cascade from the head area." : "Sleek cables or synthetic hair strands are integrated into the head design.")
        : "This synthetic android has a humanoid form with a distinctive white face plate made of 1-4 smooth panels. The face is VERY HUMAN-LIKE with realistic sculpted features: a prominent nose, defined cheekbones, subtle lips/mouth, and expressive contours that closely mimic human facial structure. The android has neon blue illuminated cybernetic eyes that glow softly. " + (Math.random() > 0.5 ? "Synthetic hair that looks remarkably real cascades from the head area." : "Sleek fiber-optic cables styled like hair strands are integrated into the head design.");

      const robotDescription = gender === "other"
        ? "This is a drone-like robot with a non-humanoid form - could be flying, hovering, or have an unconventional shape. Purely mechanical with exposed machinery, sensors, and robotic features. NO white face plates."
        : Math.random() > 0.5
        ? "This is a non-humanoid robot with advanced engineering - it could be quadrupedal, tracked, or have a completely unique mechanical form. Purely mechanical with no human features and NO white face plates."
        : "This is a bipedal robot with mechanical limbs and components, but clearly non-human in appearance with exposed machinery and robotic features. NO white face plates.";

      const speciesDescription = selectedSpecies === "defective"
        ? "This is a DEFECTIVE being - a failed experiment or malfunctioning entity. It could be a broken android with exposed wiring and sparking circuits, a corrupted AI manifestation with glitching holographic parts, or a failed cyborg with decaying flesh and malfunctioning mechanical components. Show visible damage: sparking wires, broken panels, leaking fluids, flickering lights, missing parts, and signs of system failure. The being is clearly broken, unstable, and deteriorating."
        : selectedSpecies === "creature"
        ? "This is a NON-HUMANOID creature with NO human features whatsoever. It has an alien, otherworldly form that could be animal-like (quadrupedal, winged, predatory), insect-like (chitinous exoskeleton, multiple limbs, compound eyes, antennae), or drone-like (hovering, mechanical-organic hybrid, sensor arrays). The creature has bioluminescent features, unusual sensory organs, and a completely alien anatomy. CRITICAL: This creature has ZERO human characteristics - no upright stance, no human face, no human limbs. Its form is purely alien, beast-like, or mechanical."
        : selectedSpecies === "human"
        ? `This human has adapted to underground desert life, with weathered features from the harsh environment. ${
          Math.random() > 0.8 ? "East Asian descent with almond-shaped eyes and straight black hair" :
          Math.random() > 0.6 ? "African descent with dark skin, broad nose, and coiled textured hair" :
          Math.random() > 0.4 ? "South Asian descent with brown skin and dark features" :
          Math.random() > 0.2 ? "Latino/Hispanic descent with tan skin and dark wavy hair" :
          "Middle Eastern descent with olive skin and dark features"
        }. Show realistic ethnic features appropriate to their heritage.`
        : selectedSpecies === "android" 
        ? `This is a sleek synthetic android with smooth, artificial appearance rather than mechanical or robotic. ${androidFaceDescription} The body is synthetic with clean panels and seamless construction - no exposed gears or obvious mechanical parts, more like a high-tech mannequin with advanced materials.`
        : selectedSpecies === "robot"
        ? robotDescription
        : selectedSpecies === "mutant"
        ? Math.random() > 0.3
          ? "This is a mutant human with subtle genetic adaptations like enhanced eyes, skin patterns, or bone structure - still mostly human-looking but with clear evolutionary changes."
          : "This is a mutant human with more dramatic adaptations to the harsh environment - could include extra sensory organs, modified limbs, or protective features, but still recognizably human-based."
          : gender === "other"
          ? Math.random() > 0.2
            ? Math.random() > 0.75
              ? "This is a sentient flying drone with NO humanoid form - a hovering autonomous unit with sleek aerodynamic design, propulsion systems, sensor arrays, and weapon mounts. Purely mechanical with no human features."
              : Math.random() > 0.5
              ? "This is an insectoid synthetic being with multiple segmented limbs, compound optical sensors, chitinous plating, and arthropod-inspired design. Completely non-humanoid with insect-like characteristics."
              : Math.random() > 0.33
              ? "This is a limbless serpentine synthetic entity - a long, flexible mechanical snake-like form with no arms or legs, using undulating movement. Has sensor clusters, armored segments, and a streamlined body design."
              : Math.random() > 0.5
              ? "This is a spherical or orb-like autonomous unit with no limbs - a hovering ball of technology with integrated weapons, sensors, and holographic displays rotating around its core. Completely non-humanoid."
              : "This is a multi-limbed mechanical entity with 4-8 appendages in unexpected configurations - could be spider-like, crab-like, or completely alien in form. NO humanoid structure whatsoever."
            : "This is a cyborg with seamless integration of human flesh, robotic components, and synthetic android parts."
          : Math.random() > 0.8
          ? "This is a sentient flying drone with NO humanoid form - a hovering autonomous unit with sleek aerodynamic design, propulsion systems, sensor arrays, and weapon mounts. Purely mechanical with no human features."
          : Math.random() > 0.6
          ? "This is an insectoid synthetic being with multiple segmented limbs, compound optical sensors, chitinous plating, and arthropod-inspired design. Completely non-humanoid with insect-like characteristics."
          : Math.random() > 0.4
          ? "This is a limbless serpentine synthetic entity - a long, flexible mechanical snake-like form with no arms or legs, using undulating movement. Has sensor clusters, armored segments, and a streamlined body design."
          : Math.random() > 0.2
          ? "This is a spherical or orb-like autonomous unit with no limbs - a hovering ball of technology with integrated weapons, sensors, and holographic displays rotating around its core. Completely non-humanoid."
          : "This is a multi-limbed mechanical entity with 4-8 appendages in unexpected configurations - could be spider-like, crab-like, or completely alien in form. NO humanoid structure whatsoever.";

      // Generate name-inspired thematic elements
      const getNameInspiration = (name: string): string => {
        const lowerName = name.toLowerCase();
        
        // Weapon/Combat names
        if (lowerName.includes("blade") || lowerName.includes("edge") || lowerName.includes("razor")) {
          return "The character has sharp, angular features and blade-like design elements. Include sleek, cutting-edge aesthetics with razor-sharp details on armor or body.";
        }
        if (lowerName.includes("fang") || lowerName.includes("claw") || lowerName.includes("talon")) {
          return "The character has predatory, aggressive features with sharp protrusions, claw-like appendages, or fang-inspired design elements.";
        }
        if (lowerName.includes("gun") || lowerName.includes("shot") || lowerName.includes("bullet")) {
          return "The character has a militaristic, weaponized appearance with integrated firearms or ballistic-inspired design elements.";
        }
        
        // Elemental/Nature names
        if (lowerName.includes("fire") || lowerName.includes("flame") || lowerName.includes("blaze") || lowerName.includes("inferno")) {
          return "The character has fiery visual elements - glowing red/orange accents, heat distortion effects, or flame-inspired patterns on equipment.";
        }
        if (lowerName.includes("ice") || lowerName.includes("frost") || lowerName.includes("cryo")) {
          return "The character has cold, crystalline features with icy blue accents, frost patterns, or frozen/crystalline design elements.";
        }
        if (lowerName.includes("storm") || lowerName.includes("thunder") || lowerName.includes("lightning")) {
          return "The character has electric blue accents, crackling energy effects, and storm-inspired chaotic design elements.";
        }
        if (lowerName.includes("shadow") || lowerName.includes("dark") || lowerName.includes("night") || lowerName.includes("void")) {
          return "The character has dark, stealthy aesthetics with deep black tones, shadow effects, and minimal reflective surfaces for a covert appearance.";
        }
        
        // Tech/Cyber names
        if (lowerName.includes("cyber") || lowerName.includes("tech") || lowerName.includes("byte") || lowerName.includes("data")) {
          return "The character has high-tech cybernetic features with holographic displays, digital interfaces, and advanced technological integration.";
        }
        if (lowerName.includes("ghost") || lowerName.includes("phantom") || lowerName.includes("specter")) {
          return "The character has translucent or ethereal visual elements, with ghostly pale coloring and semi-transparent holographic effects.";
        }
        
        // Animal-inspired names
        if (lowerName.includes("wolf") || lowerName.includes("fox") || lowerName.includes("bear")) {
          return "The character has animalistic features inspired by their name - include subtle beast-like qualities in posture, equipment design, or facial features.";
        }
        if (lowerName.includes("spider") || lowerName.includes("scorpion") || lowerName.includes("venom")) {
          return "The character has arachnid or insectoid features with multiple limbs, segmented armor, or venomous-looking design elements.";
        }
        
        // Abstract/Concept names
        if (lowerName.includes("echo") || lowerName.includes("pulse") || lowerName.includes("wave")) {
          return "The character has flowing, wave-like design patterns and rhythmic visual elements that suggest motion and resonance.";
        }
        if (lowerName.includes("nova") || lowerName.includes("star") || lowerName.includes("solar")) {
          return "The character has bright, radiant features with star-like glowing accents and celestial-inspired design elements.";
        }
        if (lowerName.includes("vortex") || lowerName.includes("spiral") || lowerName.includes("helix")) {
          return "The character has swirling, spiral patterns in their design with dynamic, rotating visual elements.";
        }
        
        // Default for unique names
        return "The character's design reflects the unique essence of their name through subtle visual metaphors and thematic elements.";
      };

      const nameTheme = getNameInspiration(processedName);

      const prompt = `Generate a hyper-realistic, grim and dark 3D rendered full-body horror sci-fi image of ${processedName}, a ${gender} ${selectedSpecies} in action within ${location}. ${speciesDescription} ${clothingDescription}. The character is ${nameDisplay}. ${nameTheme} Show the full body of the character in a dynamic action pose, clearly visible in the foreground, with the environment visible around them but not dominating the scene. The aesthetic is dark horror sci-fi with grim realism - think Alien meets blade runner meets The Road. Photorealistic 3D rendering style with worn, weathered textures, dark moody lighting with deep shadows, dystopian horror atmosphere. Show decay, dirt, scars, and the harsh reality of survival. CRITICAL: Show ONLY this single character - absolutely no other people or characters in the image. The name on the dog tags or body panel must be clearly legible. Highly detailed textures with emphasis on grime, wear, and realistic damage. Dark, desaturated color palette with stark lighting contrasts.`;

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
      <span className="flex flex-col items-center">
        <span style={{ fontWeight: 500 }}>パラドクシア</span>
        <span className="inline-flex items-baseline">
          <span style={{ fontWeight: 100 }}>character</span>
          <span style={{ fontWeight: 500 }} className="ml-2">generator</span>
        </span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-background overflow-x-hidden overflow-y-auto">
      <div className="min-h-full flex flex-col pb-safe">
      <ThemeToggle />
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
      
      <main className="container mx-auto px-4 py-16 mt-16 relative z-10 flex-1 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Animated Header */}
          <motion.div 
            className="text-center space-y-6"
            variants={glitchVariants}
            initial="initial"
            animate="animate"
          >
            <div className="relative">
              <h1 
                className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4 relative z-10"
                style={{
                  textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'var(--font-roc)',
                  lineHeight: '1.3',
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
                  className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground px-4 opacity-70"
                  style={{
                    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'var(--font-roc)',
                    lineHeight: '1.3',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {renderTitle()}
                </h1>
              </motion.div>
            </div>
            <p className="text-xl text-foreground max-w-2xl mx-auto font-roc">
              <span style={{ fontWeight: 300 }}>forge unique beings from the depths</span>{" "}
              <span className="font-medium">of the</span>{" "}
              <span style={{ fontWeight: 300 }}>paradoxxia universe</span>
            </p>
          </motion.div>

          {/* Sequential Prompt Section */}
          {!generatedImage && (
            <Card className="p-4 space-y-4 bg-card border-border">
              {step === 1 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground font-roc">species:</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={species === "human" ? "default" : "outline"}
                      onClick={() => setSpecies("human")}
                      className="flex-1 min-w-[100px] font-roc font-medium"
                    >
                      human
                    </Button>
                    <Button
                      variant={species === "android" ? "default" : "outline"}
                      onClick={() => setSpecies("android")}
                      className="flex-1 min-w-[100px] font-roc font-medium"
                    >
                      android
                    </Button>
                    <Button
                      variant={species === "other" ? "default" : "outline"}
                      onClick={() => setSpecies("other")}
                      className="flex-1 min-w-[100px] font-roc font-medium"
                    >
                      other
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground font-roc">gender:</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={gender === "male" ? "default" : "outline"}
                      onClick={() => setGender("male")}
                      className="flex-1 min-w-[100px] font-roc font-medium"
                    >
                      male
                    </Button>
                    <Button
                      variant={gender === "female" ? "default" : "outline"}
                      onClick={() => setGender("female")}
                      className="flex-1 min-w-[100px] font-roc font-medium"
                    >
                      female
                    </Button>
                    <Button
                      variant={gender === "other" ? "default" : "outline"}
                      onClick={() => setGender("other")}
                      className="flex-1 min-w-[100px] font-roc font-medium"
                    >
                      other
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground font-roc">name:</Label>
                  <Input
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="enter character name..."
                    className="bg-background w-full"
                  />
                </div>
              )}

              <Button
                onClick={step < 3 ? handleNext : generateCharacter}
                disabled={isGenerating}
                variant="outline"
                className="w-full bg-neutral-100/50 dark:bg-white/10 hover:bg-neutral-200/50 dark:hover:bg-white/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700 font-roc uppercase tracking-wider text-lg font-extralight transition-all duration-300"
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
          )}

          {/* Output Section */}
          {generatedImage && (
            <div className="space-y-4">
              <Card className="p-0 bg-card border-border overflow-hidden relative" style={{
                border: '2px solid #00d9ff',
                boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
              }}>
                <div className="relative">
                  <img 
                    src={generatedImage} 
                    alt={displayName}
                    className="w-full"
                  />
                  {/* Download icon overlay */}
                  <button
                    onClick={async () => {
                      try {
                        const isMobile = Capacitor.isNativePlatform();
                        
                        if (isMobile) {
                          // Mobile: Save to device storage first, then give option to save to photos
                          const response = await fetch(generatedImage);
                          const blob = await response.blob();
                          const base64Data = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              resolve(base64.split(',')[1]);
                            };
                            reader.readAsDataURL(blob);
                          });
                          
                          const fileName = `${displayName.toLowerCase()}-${Date.now()}.png`;
                          const savedFile = await Filesystem.writeFile({
                            path: fileName,
                            data: base64Data,
                            directory: Directory.Cache
                          });
                          
                          // Use Share API to allow user to save to Photos
                          const fileUri = savedFile.uri;
                          await Share.share({
                            title: `${displayName} Character`,
                            text: 'Save this character image',
                            url: fileUri,
                            dialogTitle: 'Save to Photos'
                          });
                          
                          toast.success("Opening save options...");
                        } else {
                          // Web: Standard download
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = `${displayName.toLowerCase()}-character.png`;
                          link.click();
                        }
                      } catch (error) {
                        console.error("Download error:", error);
                        toast.error("Failed to save image");
                      }
                    }}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors cursor-pointer z-10 hidden md:block"
                    style={{
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Download 
                      size={24} 
                      style={{
                        color: '#00d9ff',
                        filter: 'drop-shadow(0 0 4px rgba(0, 217, 255, 0.6))'
                      }}
                    />
                  </button>
                  
                  {/* Save to Photos button */}
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(generatedImage);
                        const blob = await response.blob();
                        const base64Data = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            resolve(base64.split(',')[1]);
                          };
                          reader.readAsDataURL(blob);
                        });
                        
                        const fileName = `${displayName.toLowerCase()}-${Date.now()}.png`;
                        await Filesystem.writeFile({
                          path: fileName,
                          data: base64Data,
                          directory: Directory.ExternalStorage
                        });
                        
                        toast.success("Saved to Photos");
                      } catch (error) {
                        console.error("Save error:", error);
                        toast.error("Failed to save to photos");
                      }
                    }}
                    className="md:hidden absolute top-2 right-2 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors cursor-pointer z-10"
                    style={{
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Download 
                      size={24} 
                      style={{
                        color: '#00d9ff',
                        filter: 'drop-shadow(0 0 4px rgba(0, 217, 255, 0.6))'
                      }}
                    />
                  </button>

                  {/* Share button */}
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(generatedImage);
                        const blob = await response.blob();
                        const base64Data = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            resolve(base64.split(',')[1]);
                          };
                          reader.readAsDataURL(blob);
                        });
                        
                        const fileName = `${displayName.toLowerCase()}-${Date.now()}.png`;
                        const savedFile = await Filesystem.writeFile({
                          path: fileName,
                          data: base64Data,
                          directory: Directory.Cache
                        });
                        
                        await Share.share({
                          title: `${displayName} Character`,
                          text: `Check out my ${displayName} character from Paradoxxia!`,
                          url: savedFile.uri,
                          dialogTitle: 'Share Character'
                        });
                      } catch (error) {
                        console.error("Share error:", error);
                        toast.error("Failed to share image");
                      }
                    }}
                    className="absolute top-2 right-28 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors cursor-pointer z-10"
                    style={{
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <SquareArrowUp 
                      size={24} 
                      style={{
                        color: '#00d9ff',
                        filter: 'drop-shadow(0 0 4px rgba(0, 217, 255, 0.6))'
                      }}
                    />
                  </button>
                  {/* Trading card overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
                    <h2 className="text-3xl font-bold text-white mb-1" style={{ 
                      fontFamily: 'var(--font-roc)',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {displayName}
                    </h2>
                    <p className="text-lg text-white/90 capitalize font-medium" style={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {species === "other" && Math.random() > 0.7 ? "classified" : actualSpecies}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Button
                onClick={handleStartOver}
                variant="outline"
                className="w-full bg-neutral-100/50 dark:bg-white/10 hover:bg-neutral-200/50 dark:hover:bg-white/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700 font-roc uppercase tracking-wider text-lg font-extralight transition-all duration-300"
                size="lg"
              >
                start over
              </Button>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default AICharacterGenerator;
