
// API Route for file downloads
// This proxies the download requests to Supabase while masking the URL

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
      return new Response(`Failed to fetch file: ${response.statusText}`, { 
        status: response.status 
      });
    }

    // Create a response with the file data and appropriate headers
    const fileData = await response.arrayBuffer();
    const headers = new Headers();
    
    // Set content type
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    
    // Set content disposition header for downloads
    const filename = file.split('/').pop();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    return new Response(fileData, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return new Response(`Error fetching file: ${error.message}`, { status: 500 });
  }
}
