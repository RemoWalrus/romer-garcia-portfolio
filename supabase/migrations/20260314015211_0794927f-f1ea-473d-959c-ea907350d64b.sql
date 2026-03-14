
-- Update existing homepage meta records
UPDATE public.metadata SET meta_value = 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist', updated_at = now() WHERE meta_key = 'title';
UPDATE public.metadata SET meta_value = 'Romer Garcia is a Design Lead and AI-driven multimedia strategist with a U.S. Army background. Browse his portfolio of digital campaigns, brand identity systems, AI-powered creative tools, and multimedia projects that blend strategy with visual storytelling.', updated_at = now() WHERE meta_key = 'description';
UPDATE public.metadata SET meta_value = 'Romer Garcia, Design Lead, Multimedia Designer, AI Design, Digital Media, Brand Transformation, U.S. Army Veteran, Creative Strategy, Digital Campaigns, Generative AI', updated_at = now() WHERE meta_key = 'keywords';
UPDATE public.metadata SET meta_value = 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist', updated_at = now() WHERE meta_key = 'og_title';
UPDATE public.metadata SET meta_value = 'Design Lead & AI-driven multimedia strategist. Browse his portfolio of digital campaigns, AI-powered tools, and brand identity projects.', updated_at = now() WHERE meta_key = 'og_description';
UPDATE public.metadata SET meta_value = 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist', updated_at = now() WHERE meta_key = 'twitter_title';
UPDATE public.metadata SET meta_value = 'U.S. Army veteran turned Design Lead. Explore high-impact digital campaigns blending AI, strategy, and visual storytelling.', updated_at = now() WHERE meta_key = 'twitter_description';

-- Insert Paradoxxia page meta
INSERT INTO public.metadata (meta_key, meta_value) VALUES
('paradoxxia.title', 'パラドクシア | Paradoxxia Universe'),
('paradoxxia.description', 'Explore パラドクシア (Paradoxxia) — an original cinematic sci-fi universe by Romer Garcia. A post-apocalyptic world where technology and poetry collide, featuring AI-powered character generation, immersive worldbuilding, and stories born from the ruins of civilization.'),
('paradoxxia.keywords', 'パラドクシア, Paradoxxia, Paradoxxia universe, cinematic sci-fi world, romergarcia, post-apocalyptic worldbuilding, AI character generator, original sci-fi IP, futuristic storytelling'),
('paradoxxia.og_title', 'パラドクシア | Paradoxxia Universe'),
('paradoxxia.og_description', 'An original cinematic sci-fi universe by Romer Garcia — post-apocalyptic worldbuilding where technology and poetry collide.'),
('paradoxxia.og_url', 'https://romergarcia.com/paradoxxia'),
('paradoxxia.twitter_title', 'パラドクシア | Paradoxxia Universe'),
('paradoxxia.twitter_description', 'An original cinematic sci-fi universe by Romer Garcia — post-apocalyptic worldbuilding where technology and poetry collide.');

-- Insert AI Character Generator page meta
INSERT INTO public.metadata (meta_key, meta_value) VALUES
('chargen.title', 'パラドクシア | AI Character Generator | Paradoxxia Universe'),
('chargen.description', 'Create unique AI-generated characters inside the パラドクシア (Paradoxxia) universe. Describe your vision and watch as AI forges androids, wanderers, and forgotten souls with cinematic portraits, backstories, and stats — a free character design tool by Romer Garcia.'),
('chargen.keywords', 'パラドクシア, Paradoxxia, AI character generator, free AI character creator, cinematic sci-fi characters, android creator, futuristic character builder, romergarcia, AI art generator, character design tool, worldbuilding AI, post-apocalyptic character creator'),
('chargen.og_title', 'パラドクシア | AI Character Generator | Paradoxxia Universe'),
('chargen.og_description', 'Create unique AI-generated characters with cinematic portraits, backstories, and stats inside the Paradoxxia sci-fi universe. Free tool by Romer Garcia.'),
('chargen.og_url', 'https://romergarcia.com/char-gen'),
('chargen.twitter_title', 'パラドクシア | AI Character Generator'),
('chargen.twitter_description', 'Create unique AI-generated characters with cinematic portraits, backstories, and stats inside the Paradoxxia sci-fi universe. Free tool by Romer Garcia.');

-- Insert Meme page meta
INSERT INTO public.metadata (meta_key, meta_value) VALUES
('meme.title', 'Romer Garcia | Dev Memes & Coding Wisdom 🚀💻'),
('meme.description', 'Enjoy a random feed of developer memes, coding tips, and fun tech trivia curated by Romer Garcia. A lighthearted break for software engineers, designers, and anyone who speaks code — refresh for a new meme every time.'),
('meme.keywords', 'developer memes, coding humor, programming jokes, tech tips, coding trivia, Romer Garcia, software engineering memes, developer life, random meme generator'),
('meme.og_title', 'Romer Garcia | Dev Memes & Coding Wisdom 🚀💻'),
('meme.og_description', 'Random developer memes, coding tips, and tech trivia curated by Romer Garcia. Refresh for a new one every time.'),
('meme.twitter_title', 'Romer Garcia | Dev Memes & Coding Wisdom 🚀💻'),
('meme.twitter_description', 'Random developer memes, coding tips, and tech trivia curated by Romer Garcia. Refresh for a new one every time.');
