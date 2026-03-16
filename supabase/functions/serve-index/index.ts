import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DEFAULT_OG_IMAGE = 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/download-file?bucket=profile&file=RomerSelfPortrait.jpg';

// Route-specific meta tag overrides for social crawlers
const routeMeta: Record<string, {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}> = {
  '/paradoxxia': {
    title: 'Paradoxxia | AI Character Generator & Multimedia Artist',
    description: 'Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.',
    keywords: 'Paradoxxia, パラドクシア, AI multimedia artist, AI character generator, Paradoxxia Spotify, Paradoxxia Apple Music, romergarcia, AI-synthesized music, cinematic sci-fi',
    ogTitle: 'Paradoxxia | AI Character Generator & Multimedia Artist',
    ogDescription: 'Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.',
    ogUrl: 'https://romergarcia.com/paradoxxia',
    ogImage: 'https://romergarcia.com/paradoxxia-og.jpg',
    twitterTitle: 'Paradoxxia | AI Character Generator & Multimedia Artist',
    twitterDescription: 'Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.',
    twitterImage: 'https://romergarcia.com/paradoxxia-og.jpg',
  },
  '/char-gen': {
    title: 'Paradoxxia AI Character Generator | Free Sci-Fi Character Creator',
    description: 'Create unique cinematic characters in the Paradoxxia sci-fi universe with AI-generated portraits, backstories, and stats. Free interactive web tool by Romer Garcia.',
    keywords: 'AI character generator, Paradoxxia, sci-fi character creator, AI portrait generator, free character creator',
    ogTitle: 'Paradoxxia AI Character Generator | Free Sci-Fi Character Creator',
    ogDescription: 'Create unique cinematic characters in the Paradoxxia sci-fi universe with AI-generated portraits, backstories, and stats.',
    ogUrl: 'https://romergarcia.com/char-gen',
    ogImage: 'https://romergarcia.com/paradoxxia-og.jpg',
    twitterTitle: 'Paradoxxia AI Character Generator',
    twitterDescription: 'Create unique cinematic characters in the Paradoxxia sci-fi universe with AI-generated portraits, backstories, and stats.',
    twitterImage: 'https://romergarcia.com/paradoxxia-og.jpg',
  },
};

const defaultMeta = {
  title: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
  description: 'Romer Garcia is a Design Lead and AI-driven multimedia strategist with a U.S. Army background. Browse his portfolio of digital campaigns, brand identity systems, AI-powered creative tools, and multimedia projects that blend strategy with visual storytelling.',
  keywords: 'Romer Garcia, Design Lead, Multimedia Designer, AI Design, Digital Media, Brand Transformation, U.S. Army Veteran, Creative Strategy, Digital Campaigns, Generative AI',
  ogTitle: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
  ogDescription: 'Design Lead & AI-driven multimedia strategist. Browse his portfolio of digital campaigns, AI-powered tools, and brand identity projects.',
  ogUrl: 'https://romergarcia.com',
  ogImage: DEFAULT_OG_IMAGE,
  twitterTitle: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
  twitterDescription: 'U.S. Army veteran turned Design Lead. Explore high-impact digital campaigns blending AI, strategy, and visual storytelling.',
  twitterImage: DEFAULT_OG_IMAGE,
};

function buildHTML(meta: typeof defaultMeta, memeComment = '') {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="author" content="Romer Garcia" />
    <meta name="keywords" content="${meta.keywords}" />
    <link rel="canonical" href="${meta.ogUrl}" />
    
    <!-- Open Graph Meta Tags for social sharing -->
    <meta property="og:title" content="${meta.ogTitle}" />
    <meta property="og:description" content="${meta.ogDescription}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${meta.ogUrl}" />
    <meta property="og:image" content="${meta.ogImage}" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.twitterTitle}" />
    <meta name="twitter:description" content="${meta.twitterDescription}" />
    <meta name="twitter:image" content="${meta.twitterImage}" />
    
    <link rel="icon" type="image/x-icon" href="https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/download-file?bucket=graphics&file=favicon.ico" />

    <!-- Preconnect to external origins -->
    <link rel="preconnect" href="https://use.typekit.net" crossorigin />
    <link rel="preconnect" href="https://p.typekit.net" crossorigin />
    <link rel="preconnect" href="https://xxigtbxqgbdcfpmnrzvp.supabase.co" crossorigin />
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin />

    <!-- Adobe Fonts (Typekit) -->
    <link rel="stylesheet" href="https://use.typekit.net/rol4qcd.css" />
    <script>
      (function(d) {
        var config = {
          kitId: 'rol4qcd',
          scriptTimeout: 3000,
          async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
      })(document);
    </script>
${memeComment}  </head>

  <body>
    <div id="root"></div>
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module" defer></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

// Known social media and SEO crawler user-agent patterns
const BOT_PATTERNS = [
  'facebookexternalhit', 'Facebot', 'Twitterbot', 'LinkedInBot',
  'WhatsApp', 'Slackbot', 'TelegramBot', 'Discordbot',
  'Googlebot', 'bingbot', 'Baiduspider', 'yandex', 'Pinterestbot',
  'redditbot', 'Applebot', 'Embedly', 'Quora Link Preview',
  'Showyoubot', 'outbrain', 'vkShare', 'W3C_Validator',
  'rogerbot', 'SemrushBot', 'AhrefsBot', 'MJ12bot',
  'ia_archiver', 'Sogou', 'DuckDuckBot', 'PetalBot',
  'curl', 'wget', 'python-requests', 'Go-http-client',
  'opengraph', 'OGP', 'ChatGPT', 'GPTBot', 'Claude',
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(p => ua.includes(p.toLowerCase()));
}

// The production site origin (Netlify)
const SITE_ORIGIN = 'https://romergarcia.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const userAgent = req.headers.get('user-agent');

    // If NOT a bot, fetch the real built index.html from Netlify and return it
    if (!isBot(userAgent)) {
      try {
        // Fetch the built index.html directly from the dist (bypasses redirects via _redirects precedence)
        const realHtml = await fetch(`${SITE_ORIGIN}/index.html`, {
          headers: { 'User-Agent': 'serve-index-internal' },
        });
        const html = await realHtml.text();
        return new Response(html, {
          headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
        });
      } catch (e) {
        console.error('Error fetching real index.html, falling back:', e);
        // Fall through to meta-injected version as fallback
      }
    }
    
    // For bots: serve meta-injected HTML
    const meta = { ...(routeMeta[path] || defaultMeta) };

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Try to fetch dynamic meta from metadata table
    try {
      const prefix = path === '/' ? '' : path.replace(/^\//, '');
      const { data } = await supabase
        .from('metadata')
        .select('meta_key,meta_value');
      
      if (data && data.length > 0) {
        for (const row of data) {
          const keyPrefix = prefix ? `${prefix}.` : '';
          let field: string | null = null;
          
          if (prefix && row.meta_key.startsWith(keyPrefix)) {
            field = row.meta_key.replace(keyPrefix, '');
          } else if (!prefix && !row.meta_key.includes('.')) {
            field = row.meta_key;
          }
          
          if (!field) continue;
          
          switch (field) {
            case 'title': meta.title = row.meta_value; break;
            case 'description': meta.description = row.meta_value; break;
            case 'keywords': meta.keywords = row.meta_value; break;
            case 'og_title': meta.ogTitle = row.meta_value; break;
            case 'og_description': meta.ogDescription = row.meta_value; break;
            case 'og_url': meta.ogUrl = row.meta_value; break;
            case 'og_image': meta.ogImage = row.meta_value; break;
            case 'twitter_title': meta.twitterTitle = row.meta_value; break;
            case 'twitter_description': meta.twitterDescription = row.meta_value; break;
            case 'twitter_image': meta.twitterImage = row.meta_value; break;
          }
        }
      }
    } catch (e) {
      console.error('Error fetching route meta:', e);
    }

    // Get the active meme for the homepage
    let memeComment = '';
    if (path === '/') {
      try {
        const { data: meme, error } = await supabase
          .rpc('get_active_meme')
          .single();

        if (!error && meme) {
          memeComment = `    <!-- 

                                               *                            
                                 @@@-%@@@@@@@@@@  =@@@                         
                               @@% +@@ @@@@@+%@@@@@@@@@@@                        
                             %@@@@@@  : @ : @@@ @@@@+  -                            
                           @ @.*:@@@  @ @@ ##@@@@%@@@@@                              
                           @-@ # .  #@@@+.%          @@@@                             
                        @@@@. *@ @@@-   @                 %                             
                       @@@@ @ :    @ @@@               @@*@@+                            
                      @@ .@@@ @ @:@@ @#            @@@@@@=#@                             
                      @ @ #:@ @@ @-@ @  -  =     -@@*#@+  @@@@-@@@                        
                      @@% -@%@  @@#:@ .  .#     = %%@* @@@* @@   @                          
                     @@@-=@ @ @  @ @:  %-.   -@@@@@ @  @@@  @   :@                            
                     @@.@++ * %@+* @:= *.@@@ ..      + :   @@    *                            
                      @=@%*@%@@ @#@@@@@@@@@        @@@@.  = @  @@@                             
                      @@%#%%% %#@     @  @              @@@ @@@@                                
                       @@##@+*- #@@@@@+ + @..     :...   --@@. .:@@                               
                        @@#%-@@@@  %@@    @ :      .     #* @% @@%@                               
                         @#%#%%%** %@@ %  -@ @ . . .   ..=    @@*%                                
                         @@@%%%#@@ .     . .#.+=.@  @. . :%.%@%##@@*                              
                           @@@%-%@@@@: .%=  +:+*- % *+*%@*@@%##%#%@@                              
                             @@@@#%#@+@@@@.:@+*#@@@#%#@%@@#+%###:#%@                              
                               =@@@%@* @@@%*+*@%%##@%#%%%+%%%%#%*%+@                              
                                  @@@@.. .+@#%#%%%#%%%%%%%%##%%##%@@                              
                                    @@+++.-=%%%%:%%#%##%=%#%%#%@@@@                               
                                      %==+--+#%%%%%%%##%%%#####@                                  
                                      @--=-=-+%#%%####%%%@%%%##@@@@                               
                                     @@:=:--::+#%%%%#%%#*--#%####%@@@@@@@@@@@@@@@ .               
                                   @@@.-=-=--+ --##%%%#-+=#%%##################%@@@@@@@@@@@       
                                  @@%@:=.=::--=-==-+#*+++%%%######%###############%%#%#*-#@@      
                                 @@%%%::-:--=+%%##%+#**%%%########################%#=%+*@#*%@     
                                @@##%%@::--=+=*++++=:*%%@@@%%%############%%%%%%%%%%*%%%#=%#@@@   
                             @@@@#####%@@:-+-==+-+==-@@@#*%@@@############%*#####*###%%###%##%@@  
                           @@@#########%%@+=-==+-=+-+@       @#############%%%#%%######%**#%%#%@@ 
                       @@@@@#############%%@----====+#-:..   @###############%###%#%###%%#%#%#%#@%
                      @@%%#################%@@#---::-===--: @@############%#########%#%#%*%##%###*
                   @@@@######################%%@@@@@%===-=::@###########################%#%######*
                @@@@%##############################%%@@@+++@%####################################*
              @@@%#####################################%@#*%#####################################*
             @@%########################################%%%%#####################################*
             @###################################################################################*
            @@###################################################################################*
            @%###################################################################################*
            @####################################################################################*
           @@************************************************************************************+
                                               RomerGarcia.com

  🤓 RANDOM DEV MEME: "${meme.meme_text}" 
     ${meme.attribution ? `-- ${meme.attribution}` : ''}
     
  🚀 Refresh for a new meme!
  
  💡 Pro tip: If you can read this, you're one of us... welcome to the code cave!
  
  🎯 Coding wisdom: ${meme.coding_tip ? `"${meme.coding_tip}"` : '"There are only 10 types of people in the world: those who understand binary and those who don\'t."'}
     
  🎮 Fun fact: ${meme.fun_fact || 'Remember when we thought Y2K would end civilization? Good times... *nervous developer laughter*'}

-->
`;
        }
      } catch (e) {
        console.error('Error fetching meme:', e);
      }
    }

    const html = buildHTML(meta, memeComment);

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in serve-index function:', error);
    
    const html = buildHTML(defaultMeta);
    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      status: 500,
    });
  }
})
