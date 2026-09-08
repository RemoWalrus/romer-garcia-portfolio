INSERT INTO public.metadata (meta_key, meta_value)
SELECT k, v
FROM (VALUES
 ('paradoxxia.schema.name','Paradoxxia'),
 ('paradoxxia.schema.alternate_name','パラドクシア'),
 ('paradoxxia.schema.description','Paradoxxia is an AI-synthesized multimedia artist and character entity created by Romer Garcia. Blending cinematic sci-fi storytelling with AI-generated electronic music available on Spotify and Apple Music.'),
 ('paradoxxia.schema.short_description','An AI-synthesized multimedia artist and character entity.'),
 ('paradoxxia.schema.url','https://romergarcia.com/paradoxxia'),
 ('paradoxxia.schema.genre','Electronic, AI-Generated, Cinematic, Sci-Fi Soundtrack'),
 ('paradoxxia.schema.same_as','https://open.spotify.com/artist/11NJVIZgdYbPyz9igDKTBr, https://music.apple.com/us/artist/paradoxxia/1803632666'),
 ('paradoxxia.schema.page_name','Paradoxxia | AI Multimedia Artist & Music'),
 ('paradoxxia.schema.page_description','Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring AI-synthesized music on Spotify and Apple Music and an interactive character generator.'),
 ('paradoxxia.schema.faq','[{"question":"What is Paradoxxia?","answer":"Paradoxxia (パラドクシア) is an AI-synthesized multimedia artist and character entity created by Romer Garcia. It combines cinematic sci-fi storytelling with AI-generated electronic music and an interactive character generator."},{"question":"Where can I listen to Paradoxxia''s music?","answer":"Paradoxxia''s AI-synthesized music is available on Spotify and Apple Music. Visit the Paradoxxia page at romergarcia.com/paradoxxia for direct links."},{"question":"Who created Paradoxxia?","answer":"Paradoxxia was created by Romer Garcia, a Design Lead and AI-Driven Multimedia Strategist specializing in AI-assisted design and multimedia strategy."},{"question":"What is the Paradoxxia AI Character Generator?","answer":"The Paradoxxia AI Character Generator is a free interactive web tool that lets users create unique cinematic characters set in the Paradoxxia sci-fi universe, complete with AI-generated portraits, backstories, and stats."}]'),
 ('chargen.schema.name','Paradoxxia AI Character Generator'),
 ('chargen.schema.url','https://romergarcia.com/char-gen'),
 ('chargen.schema.description','An interactive AI character generator set in the Paradoxxia sci-fi universe. Create unique characters with cinematic portraits, backstories, and stats.'),
 ('chargen.schema.features','Visual Synthesis, AI Lore Generation, Photo Reference Upload, Character Stats Generation')
) AS t(k,v)
WHERE NOT EXISTS (SELECT 1 FROM public.metadata m WHERE m.meta_key = t.k);