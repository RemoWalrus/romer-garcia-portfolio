
// API Route for video files
// This proxies the video requests to Supabase while masking the URL

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const bucket = url.searchParams.get('bucket');
  const file = url.searchParams.get('file');

  if (!bucket || !file) {
    return new Response('Missing bucket or file parameter', { status: 400 });
  }

  // Construct the Supabase storage URL
  const supabaseUrl = "https://xxigtbxqgbdcfpmnrzvp.supabase.co";
  const storageUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${file}`;

  try {
    // Fetch the file from Supabase
    const response = await fetch(storageUrl);
    
    if (!response.ok) {
      return new Response(`Failed to fetch video: ${response.statusText}`, { 
        status: response.status 
      });
    }

    // Create a response with the video data and appropriate headers
    const videoData = await response.arrayBuffer();
    const headers = new Headers();
    
    // Set content type
    headers.set('Content-Type', response.headers.get('Content-Type') || 'video/mp4');
    
    // Add caching headers
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return new Response(videoData, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return new Response(`Error fetching video: ${error.message}`, { status: 500 });
  }
}
