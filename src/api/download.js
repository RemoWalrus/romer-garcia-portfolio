
// This file acts as a proxy for Supabase storage files
// It runs on the server side when deployed to platforms that support API routes

import { supabase } from '../integrations/supabase/client';

export default async function handler(req, res) {
  // Get the file and bucket parameters from the request
  const { file, bucket } = req.query;
  
  if (!file || !bucket) {
    return res.status(400).json({ error: 'Missing file or bucket parameter' });
  }
  
  try {
    // Get the signed URL from Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(file, 60); // URL valid for 60 seconds
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to get file' });
    }
    
    if (!data || !data.signedUrl) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Redirect to the signed URL
    return res.redirect(data.signedUrl);
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
