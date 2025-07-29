-- Add more nerdy developer memes to the daily_memes table
INSERT INTO public.daily_memes (meme_text, attribution, coding_tip, fun_fact, is_active) VALUES 
('Hello World!', 'The eternal first program greeting', 'Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.', 'The first "Hello, World!" program appeared in 1972 in a Bell Labs memo by Brian Kernighan.', false),

('404: Humor not found', 'Classic HTTP error with a twist', 'Debugging is twice as hard as writing the code in the first place.', 'The HTTP 404 error was named after room 404 at CERN where the web was invented... just kidding, that''s a myth!', false),

('There are only two hard things in Computer Science: cache invalidation and naming things.', 'Phil Karlton', 'Code never lies, comments sometimes do.', 'The average programmer has 15 cups of coffee per day. Wait, that might just be me...', false),

('It works on my machine ¯\\_(ツ)_/¯', 'Every developer ever', 'The best way to accelerate a computer running Windows is to throw it out a window.', 'The term "bug" in programming comes from an actual moth found in a Harvard computer in 1947.', false),

('Roses are red, violets are blue, unexpected }, on line 32', 'Poetry for programmers', 'If debugging is the process of removing bugs, then programming must be the process of putting them in.', 'The first computer programmer was Ada Lovelace in 1843, 100 years before the first computer!', false),

('sudo make me a sandwich', 'xkcd #149 classic', 'There are 10 types of people: those who understand binary and those who don''t.', 'The sudo command stands for "substitute user do" or "super user do" depending on who you ask.', false),

('To err is human, to really foul things up requires a computer', 'Murphy''s Technology Laws', 'Programming is 10% writing code and 90% figuring out why it doesn''t work.', 'The Y2K bug cost an estimated $100 billion to fix worldwide. Spoiler alert: the world didn''t end.', false),

('I''m not a robot *checks captcha nervously*', 'AI anxiety humor', 'The three virtues of a programmer: laziness, impatience, and hubris.', 'The first computer virus was created in 1971 and was called "The Creeper" - it just displayed "I''m the creeper, catch me if you can!"', false),

('Ctrl+Z is my best friend', 'The ultimate lifesaver', 'Programming is like writing a book, except if you miss a single comma on page 126, the whole book is rubbish.', 'The Ctrl+Z (undo) function has saved more careers than any other keyboard shortcut in history.', false),

('99 little bugs in the code, 99 little bugs... take one down, patch it around, 127 little bugs in the code', 'Debugging reality', 'Weeks of coding can save you hours of planning.', 'The term "patch" comes from the old days when you literally patched holes in punched cards with tape.', false);