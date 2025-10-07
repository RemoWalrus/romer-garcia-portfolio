import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Share2, Download, MoveRight } from "lucide-react";
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { glitchVariants, pixelGlitch } from "@/components/hero/animation-variants";
import circuitBg from "@/assets/circuit-background.png";
import paradoxxiaPoster from "@/assets/paradoxxia-poster.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const AICharacterGenerator = () => {
  useEffect(() => {
    // Update meta tags for Paradoxxia page
    document.title = "パラドクシア | AI Character Generator | Paradoxxia Universe";
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Awaken your imagination inside the パラドクシア universe. Forge mysterious androids, wanderers, and forgotten souls with our AI-powered Character Generator—where science meets poetry, and stories are born from the ruins.');
    }
    
    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'パラドクシア, Paradoxxia universe, AI character generator, cinematic sci-fi, android creator, futuristic character builder, romergarcia, post-apocalyptic world, story generator, worldbuilding tool, character design AI, immersive sci-fi experience');
    }
    
    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'パラドクシア | AI Character Generator | Paradoxxia Universe');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Awaken your imagination inside the パラドクシア universe. Forge mysterious androids, wanderers, and forgotten souls with our AI-powered Character Generator.');
    }
    
    // Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'パラドクシア | AI Character Generator');
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Awaken your imagination inside the パラドクシア universe. Forge mysterious androids, wanderers, and forgotten souls with our AI-powered Character Generator.');
    }
    
    // Cleanup - restore original meta tags when component unmounts
    return () => {
      document.title = "Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader";
      
      if (metaDescription) {
        metaDescription.setAttribute('content', 'STRATEGIC THINKER | DESIGN INNOVATOR | DIGITAL MEDIA LEADER. Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations. Known as a visionary problem solver, seamlessly blending strategy, creativity, and technology to craft compelling visual narratives.');
      }
      
      if (metaKeywords) {
        metaKeywords.setAttribute('content', 'Design Lead, Multimedia Designer, Digital Media, Brand Transformation, Visual Narrative, Creative Strategy, Digital Campaigns');
      }
      
      if (ogTitle) {
        ogTitle.setAttribute('content', 'Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader');
      }
      
      if (ogDescription) {
        ogDescription.setAttribute('content', 'Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations.');
      }
      
      if (twitterTitle) {
        twitterTitle.setAttribute('content', 'Romer Garcia | Strategic Thinker | Design Innovator');
      }
      
      if (twitterDescription) {
        twitterDescription.setAttribute('content', 'Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations.');
      }
    };
  }, []);
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState("");
  const [actualSpecies, setActualSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState("");

  const handleNext = () => {
    if (step === 1 && !species) {
      toast.error("Please select a species");
      return;
    }
    if (step === 2 && !gender) {
      toast.error("Please select a gender");
      return;
    }
    if (step < 4) {
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
    setUploadedPhoto("");
    setIsGenerating(false);
  };

  const handlePhotoUpload = async () => {
    try {
      // Check if running on native platform
      const isNative = Capacitor.isNativePlatform();
      
      if (!isNative) {
        // Fallback for web - use file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              setUploadedPhoto(dataUrl);
              toast.success("Photo uploaded successfully!");
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
        return;
      }

      // Native platform - use Capacitor Camera with gallery access
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos, // Direct access to photo gallery
        promptLabelHeader: 'Select Photo',
        promptLabelPhoto: 'From Gallery',
        promptLabelPicture: 'Take Photo'
      });

      if (image.dataUrl) {
        setUploadedPhoto(image.dataUrl);
        toast.success("Photo uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Camera error:", error);
      
      // Provide helpful error messages
      if (error.message?.includes('permission')) {
        toast.error("Camera permission denied. Please enable camera access in your device settings.");
      } else if (error.message?.includes('cancelled') || error.message?.includes('canceled')) {
        toast.info("Photo upload cancelled");
      } else {
        toast.error("Failed to capture photo. Please try again.");
      }
    }
  };

  const handleShare = async () => {
    try {
      if (!generatedImage) return;

      const base64Data = generatedImage.split(',')[1];
      const fileName = `${displayName || 'character'}_${Date.now()}.png`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      await Share.share({
        title: displayName || 'My Character',
        text: `Check out my character: ${displayName}`,
        url: savedFile.uri,
        dialogTitle: 'Share your character'
      });
    } catch (error: any) {
      console.error("Share error:", error);
      if (!error.message?.includes('cancelled') && !error.message?.includes('canceled')) {
        toast.error("Failed to share image");
      }
    }
  };

  const handleDownload = async () => {
    try {
      if (!generatedImage) return;

      const base64Data = generatedImage.split(',')[1];
      const fileName = `${displayName || 'character'}_${Date.now()}.png`;
      const isNative = Capacitor.isNativePlatform();

      if (isNative) {
        // Native platform - save directly to Photos using base64
        try {
          // On iOS, Media.savePhoto expects base64 data with proper prefix
          await Media.savePhoto({
            path: generatedImage // Pass the full data URL
          });
          
          toast.success("Saved to Photos");
        } catch (error) {
          console.error("Media save error:", error);
          // Fallback: Try writing to filesystem first
          try {
            const savedFile = await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents
            });
            
            // Try saving with file URI
            await Media.savePhoto({
              path: savedFile.uri
            });
            
            toast.success("Saved to Photos");
          } catch (fallbackError) {
            console.error("Fallback save error:", fallbackError);
            // Last resort - use share menu
            const savedFile = await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Cache
            });
            
            await Share.share({
              title: 'Save Image',
              url: savedFile.uri,
              dialogTitle: 'Save to Photos'
            });
          }
        }
      } else {
        // Web - download the image
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloaded!");
      }
    } catch (error: any) {
      console.error("Download error:", error);
      if (!error.message?.includes('cancelled') && !error.message?.includes('canceled')) {
        toast.error("Failed to save image");
      }
    }
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
        const editPrompt = "Generate a closer, more zoomed-in dynamic pose of this exact character maintaining ALL the same visual characteristics: the same face, same long dark hair, same bright cyan/neon blue glowing eyes, same golden/bronze armored suit design, same body proportions, and same overall appearance. CRITICAL ANDROID NATURE: This is NOT a human wearing armor - this is a synthetic android/robot underneath. Where armor panels are broken, damaged, or joints are visible, show ROBOTIC SYNTHETIC COMPONENTS: exposed metallic endoskeleton, servos, actuators, artificial muscle fibers, glowing energy conduits, mechanical joints, synthetic materials - NOT human skin or flesh. The face may be humanoid but should have subtle synthetic qualities (seams, panel lines, artificial smoothness). The body under the armor should clearly be advanced robotics and synthetic materials, not biological. Show the character from mid-thigh up or closer (NOT full body - zoom in more) in a new dramatic action pose from an interesting angle in a DIFFERENT dystopian sci-fi environment - NOT ruins, but perhaps an abandoned industrial complex, a desolate wasteland with strange structures, a dark underground facility, or a dystopian cityscape. Frame the shot to show the character LARGER and more prominent - closer camera angle, heroic perspective. Keep EVERYTHING about the character's visual design identical - only change the pose, camera angle (closer/zoomed), and the background environment completely. Hyper-realistic 3D rendering style with the same dark, grim atmosphere. MANDATORY: The image MUST be 1:1 square format (1024x1024 pixels) - this is NON-NEGOTIABLE.";
        
      const { data, error } = await supabase.functions.invoke("generate-character-image", {
        body: { 
          prompt: editPrompt,
          imageUrl: uploadedPhoto || publicImageUrl
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
      
      // Special case: both "other" selections create varied non-humanoid beings
      let selectedSpecies = species;
      if (isDefective) {
        selectedSpecies = "defective";
      } else if (species === "other" && gender === "other") {
        // Mix of non-humanoid robots, machine drones, mutants, and creatures
        const doubleOtherOptions = ["creature", "robot", "drone", "mutant", "mutant"];
        selectedSpecies = doubleOtherOptions[Math.floor(Math.random() * doubleOtherOptions.length)];
      } else if (species === "other") {
        const otherOptions = ["cyborg", "mutant", "robot", "drone"];
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
        : selectedSpecies === "drone"
        ? "in their hovering mechanical form with sensor arrays and no clothing"
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
        : selectedSpecies === "drone"
        ? Math.random() > 0.5 ? "the desert surface with surveillance equipment" : "underground tunnels with technical infrastructure"
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
        : selectedSpecies === "drone"
        ? `with the name "${processedName}" printed on a small identification panel or sensor array`
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
        ? `This is a NON-HUMANOID creature with NO human features whatsoever. It has an alien, otherworldly form that could be animal-like (quadrupedal, winged, predatory), insect-like (chitinous exoskeleton, multiple limbs, compound eyes, antennae), or drone-like (hovering, mechanical-organic hybrid, sensor arrays). The creature has bioluminescent features, unusual sensory organs, and a completely alien anatomy. CRITICAL: This creature has ZERO human characteristics - no upright stance, no human face, no human limbs. Its form is purely alien, beast-like, or mechanical.${uploadedPhoto ? " ABSOLUTELY CRITICAL FACE INTEGRATION: A reference photo was provided. You MUST use EXTREME subtlety when integrating facial features. The integration should be BARELY recognizable - heavily distorted and transformed to match the creature's alien nature. Choose ONE approach: (A) HEAVILY STYLIZED INTEGRATION: Take only the most basic facial proportions/structure from the photo and COMPLETELY transform them with the creature's texture - if bioluminescent, the features should be glowing organic patterns; if chitinous, they should be alien carapace formations; if mechanical, they should be abstract sensor arrays. The result should look 90% creature, 10% subtle facial echo. OR (B) HEAD IN JAR: Place a small, distorted preserved specimen in a translucent bio-pod that's partially obscured by the creature's body, with heavy sci-fi distortion effects, murky preservation fluid, and integrated into the creature's form as a minor detail, not a focal point. In BOTH cases: use heavy artistic license, extreme stylization, and make the human reference barely perceptible within the overall alien design." : ""}`
        : selectedSpecies === "human"
        ? (() => {
            const ethnicity = Math.random() > 0.8 ? "East Asian descent with almond-shaped eyes and straight black hair" :
              Math.random() > 0.6 ? "African descent with dark skin, broad nose, and coiled textured hair" :
              Math.random() > 0.4 ? "South Asian descent with brown skin and dark features" :
              Math.random() > 0.2 ? "Latino/Hispanic descent with tan skin and dark wavy hair" :
              "Middle Eastern descent with olive skin and dark features";
            
            const roleRandom = Math.random();
            const role = roleRandom > 0.66 ? "soldier" : roleRandom > 0.33 ? "scientist" : "civilian";
            
            const roleDescription = role === "soldier" 
              ? "This is a battle-hardened FIGHTER adapted to underground desert life - NOT a formal soldier but a survivor who fights. They wear IMPROVISED, SCAVENGED protective gear: mismatched armor pieces (scrap metal plates, damaged ceramic fragments, leather straps), torn fabric wrappings, makeshift padding, all heavily worn and repaired with duct tape and wire. WEAPONS show the resource scarcity: a mix of crude FUTURISTIC weapons (damaged energy pistol held together with tape, broken laser rifle with exposed wiring, salvaged plasma cutter repurposed as a weapon, scavenged tech parts barely functional) and LOW-TECH improvised weapons (sharpened rebar, pipe guns, modified tools, scavenged blades). Everything looks desperately maintained, heavily weathered, and cobbled together. NO pristine military gear - only survival equipment showing years of use, repair, and desperation. Battle-scarred appearance (scars, weathered look, lean muscular build from harsh conditions). Gear includes: patched vest with mismatched pouches, worn boots with visible repairs, improvised protective pieces, scavenged equipment held together by ingenuity."
              : role === "scientist"
              ? "This is a SCIENTIST adapted to underground desert life. They wear practical research gear with lab coat elements adapted for harsh conditions. CRITICAL EQUIPMENT: They carry VERY FUTURISTIC SCI-FI DEVICES AND TOOLS showing advanced technology: holographic data tablets with 3D projections, scanning devices with pulsing energy cores, handheld quantum analyzers with glowing displays, portable AI terminals, energy-based measurement tools, advanced diagnostic equipment with transparent screens and flowing interfaces, bio-scanners with crystalline components, and sleek futuristic instruments with neon accents. Some equipment shows improvised low-tech repairs (duct tape, wire fixes, scavenged parts) creating contrast between high-tech sophistication and survival modifications. Protective goggles or eyewear with HUD displays. Equipment includes modified lab coat with integrated tech, tool belt with both advanced instruments and crude repair tools, holographic data pads, and sample collection gear with energy-based preservation systems."
              : "This is a tough CIVILIAN survivor adapted to underground desert life. Despite not being military, they look capable and battle-hardened - weathered skin, determined expression, practical survival gear. WEAPONS AND TOOLS: They carry a mix of VERY LOW-TECH improvised weapons (rusted pipes, scavenged blades, makeshift clubs, sharpened rebar, crude crossbows) alongside a few salvaged FUTURISTIC ITEMS (damaged energy pistol held together with tape, broken holographic scanner still flickering, scavenged tech components repurposed as weapons, improvised energy weapon built from salvaged parts). This creates a stark contrast showing desperate resourcefulness - mostly crude survival tools with rare precious pieces of advanced technology carefully maintained. Makeshift armor pieces from scrap metal and salvaged materials, scavenged equipment showing heavy wear and improvised repairs. They have the look of someone who's fought to survive with whatever they could find.";
            
            // Post-apocalyptic body types (scarce food/water) - unless photo reference is provided
            const bodyType = uploadedPhoto 
              ? "Body type and build MUST exactly match the reference photo provided"
              : (() => {
                  const rand = Math.random();
                  if (rand > 0.7) return "lean and wiry build with visible muscle definition but minimal body fat - adapted to scarce resources";
                  if (rand > 0.4) return "gaunt, thin frame showing signs of malnutrition with prominent bones and tight skin - survival mode physique";
                  if (rand > 0.2) return "athletic but slim build with toned muscles and low body fat - efficient body for desert survival";
                  return "emaciated appearance with visible ribs and angular features - harsh reality of limited food and water";
                })();
            
            return `${roleDescription} ${ethnicity}. ${bodyType}. Show realistic ethnic features appropriate to their heritage. All humans in this world are survivors - even civilians look tough, resourceful, and ready for danger.`;
          })()
        : selectedSpecies === "android" 
        ? `This is a sleek synthetic android with smooth, artificial appearance rather than mechanical or robotic. ${androidFaceDescription} The body is synthetic with clean panels and seamless construction - no exposed gears or obvious mechanical parts, more like a high-tech mannequin with advanced materials.`
        : selectedSpecies === "robot"
        ? robotDescription
        : selectedSpecies === "drone"
        ? "This is an autonomous hovering drone with a purely mechanical form. It has a compact, aerodynamic body with visible rotors, thrusters, or anti-gravity emitters. Features include camera arrays, sensor clusters, scanning equipment, weapon mounts, and communication antennas. The design is sleek and technical with exposed circuitry, LED indicators, and modular components. NO humanoid features, NO face plates - purely utilitarian surveillance/combat drone."
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

      const photoReference = uploadedPhoto 
        ? `CRITICAL PHOTO REFERENCE INTEGRATION: A reference photo has been provided. You MUST accurately match the person's physical features while rendering in the 3D horror sci-fi style:

MANDATORY REFERENCE MATCHING (TOP PRIORITY):
- EXACT skin tone and ethnicity from the reference photo - if the person is Black, Latino, Asian, White, or any other ethnicity, the character MUST have the same skin tone and ethnic features
- PRECISE facial structure: Match the jawline, cheekbones, forehead shape, chin shape exactly as shown
- ACCURATE eye shape, spacing, and color from the reference
- PRECISE nose shape and size from the reference
- EXACT mouth/lip shape from the reference
- MATCH hair color and texture from the reference
- REPLICATE distinctive features: scars, marks, facial characteristics
- PRESERVE body build and proportions from the reference - match EXACT body type, height proportions, muscle definition, body fat, and overall physique
${selectedSpecies === 'human' ? '- INCLUDE any accessories visible in the reference (glasses, piercings, etc.)' : ''}

${gender !== 'other' ? `GENDER TRANSFORMATION (if needed):
If the reference photo appears to be a different gender than the selected "${gender}" gender:
- Transform the character to be ${gender} while keeping ALL ethnic features, skin tone, facial structure, and body proportions
- For male: Add masculine features (stronger jaw, broader shoulders, facial hair options, deeper brow) while maintaining the reference body type
- For female: Add feminine features (softer jawline, refined features, longer hair options, delicate bone structure) while maintaining the reference body type
- PRESERVE: Exact skin color, ethnicity, eye shape/color, nose characteristics, body build, and overall physical proportions
- The result should look like the same person if they were ${gender}
` : ''}
STYLE REQUIREMENTS (Applied AFTER matching features):
- Render all matched features in the same 3D horror sci-fi style
- Apply consistent lighting, weathering, and grime to the matched features
- Use the same dark, gritty textures across the entire character
- Ensure cohesive artistic treatment - not a photo collage

The result must preserve the EXACT ethnicity, skin tone, and body type from the reference photo${gender !== 'other' ? `, transformed to ${gender} gender if needed` : ''}, rendered in the apocalyptic ${selectedSpecies} style.`
        : '';

      const prompt = `Generate a hyper-realistic, grim and dark 3D rendered full-body horror sci-fi image of ${processedName}, a ${gender} ${selectedSpecies} in action within ${location}. ${photoReference} ${speciesDescription} ${clothingDescription}. The character is ${nameDisplay}. ${nameTheme} Show the full body of the character in a dynamic action pose, clearly visible in the foreground, with the environment visible around them but not dominating the scene. The aesthetic is dark horror sci-fi with grim realism - think Alien meets blade runner meets The Road. Photorealistic 3D rendering style with worn, weathered textures, dark moody lighting with deep shadows, dystopian horror atmosphere. Show decay, dirt, scars, and the harsh reality of survival. CRITICAL: Show ONLY this single character - absolutely no other people or characters in the image. The name on the dog tags or body panel must be clearly legible. Highly detailed textures with emphasis on grime, wear, and realistic damage. Dark, desaturated color palette with stark lighting contrasts.`;

      const { data, error } = await supabase.functions.invoke("generate-character-image", {
        body: { 
          prompt,
          imageUrl: uploadedPhoto || undefined,
          timestamp: Date.now() // Force fresh generation by adding timestamp
        },
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
      <GoogleAnalytics />
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

              {step === 4 && (
                <div className="space-y-3">
                  <Label className="text-base font-medium text-foreground font-roc">upload photo (optional):</Label>
                  <p className="text-sm text-muted-foreground">Upload a photo to use as reference for your character</p>
                  {uploadedPhoto ? (
                    <div className="relative h-[20vh] overflow-hidden flex items-center justify-center bg-black/10 rounded-lg">
                      <img src={uploadedPhoto} alt="Uploaded" className="max-h-full max-w-full object-contain rounded-lg" />
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
                    <Button
                      onClick={handlePhotoUpload}
                      variant="outline"
                      className="w-full"
                    >
                      Take Photo or Choose from Gallery
                    </Button>
                  )}
                </div>
              )}

              <Button
                onClick={step < 4 ? handleNext : generateCharacter}
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
                ) : step < 4 ? (
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
                    className="w-full z-10"
                  />
                  {/* Share button */}
                  <Button
                    onClick={handleShare}
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-16 z-50 bg-transparent hover:bg-transparent p-2"
                  >
                    <Share2 className="h-8 w-8" style={{ color: '#00d9ff', filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))' }} />
                  </Button>
                  {/* Download button */}
                  <Button
                    onClick={handleDownload}
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 z-50 bg-transparent hover:bg-transparent p-2"
                  >
                    <Download className="h-8 w-8" style={{ color: '#00d9ff', filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))' }} />
                  </Button>
                  {/* Trading card overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 z-20">
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
              
              <div className="mt-8 p-6 bg-muted/30 rounded-lg space-y-4">
                <p className="text-base text-foreground leading-relaxed font-roc">
                  <span style={{ fontWeight: 300 }}>Step into the world you've just helped</span>{" "}
                  <span style={{ fontWeight: 500 }}>create.</span>{" "}
                  <span style={{ fontWeight: 300 }}>Paradoxxia's story unfolds in the same shattered future your characters inhabit—a realm</span>{" "}
                  <span style={{ fontWeight: 500 }}>of memory,</span>{" "}
                  <span style={{ fontWeight: 500 }}>music,</span>{" "}
                  <span style={{ fontWeight: 500 }}>and machine</span>{" "}
                  <span style={{ fontWeight: 300 }}>evolution. She's more than</span>{" "}
                  <span style={{ fontWeight: 500 }}>legend;</span>{" "}
                  <span style={{ fontWeight: 300 }}>she's the pulse that echoes through the</span>{" "}
                  <span style={{ fontWeight: 500 }}>ruins.</span>
                </p>
                <a 
                  href="https://open.spotify.com/artist/11NJVIZgdYbPyz9igDKTBr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm font-roc font-bold uppercase"
                >
                  Meet Paradoxxia on Spotify <MoveRight className="ml-2 w-4 h-4" />
                </a>
              </div>

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
