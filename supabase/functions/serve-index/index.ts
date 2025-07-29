import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const staticIndexHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader</title>
    <meta name="description" content="STRATEGIC THINKER | DESIGN INNOVATOR | DIGITAL MEDIA LEADER. Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations. Known as a visionary problem solver, seamlessly blending strategy, creativity, and technology to craft compelling visual narratives." />
    <meta name="author" content="Romer Garcia" />
    <meta name="keywords" content="Design Lead, Multimedia Designer, Digital Media, Brand Transformation, Visual Narrative, Creative Strategy, Digital Campaigns" />
    
    <!-- Open Graph Meta Tags for social sharing -->
    <meta property="og:title" content="Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader" />
    <meta property="og:description" content="Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://romergarcia.com" />
    <meta property="og:image" content="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/graphics/RomerGarcia-cover.svg" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Romer Garcia | Strategic Thinker | Design Innovator" />
    <meta name="twitter:description" content="Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations." />
    <meta name="twitter:image" content="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/graphics/RomerGarcia-cover.svg" />
    
    <link rel="icon" type="image/x-icon" href="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/graphics/favicon.ico" />
    <link rel="stylesheet" href="https://use.typekit.net/rol4qcd.css">
  </head>

  <body>
    <div id="root"></div>
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the active meme from database
    const { data: meme, error } = await supabase
      .rpc('get_active_meme')
      .single()

    if (error) {
      console.error('Error fetching meme:', error)
      // Return static HTML if there's an error
      return new Response(staticIndexHTML, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      })
    }

    // Get current date for the meme display
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Build the dynamic meme comment section
    const memeComment = `<!-- 

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

  🤓 MEME OF THE DAY: "${meme.meme_text}" 
     ${meme.attribution ? `-- ${meme.attribution}` : ''}
     
  🚀 Updated: ${currentDate} | ${meme.update_info || 'Next rotation: Tomorrow at midnight UTC'}
  
  💡 Pro tip: If you can read this, you're one of us... welcome to the code cave!
  
  🎯 Today's coding wisdom: ${meme.coding_tip ? `"${meme.coding_tip}"` : '"There are only 10 types of people in the world: those who understand binary and those who don\'t."'}
     
  🎮 Fun fact: ${meme.fun_fact || 'Remember when we thought Y2K would end civilization? Good times... *nervous developer laughter*'}

-->`

    // Inject the meme comment into the HTML
    const dynamicHTML = staticIndexHTML.replace('</head>', `${memeComment}\n  </head>`)

    return new Response(dynamicHTML, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    })

  } catch (error) {
    console.error('Error in serve-index function:', error)
    
    // Return static HTML as fallback
    return new Response(staticIndexHTML, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 500
    })
  }
})