export default async function handler(request, context) {
  const url = new URL(request.url);
  const path = url.pathname;
  const ogRoutes = ['/paradoxxia', '/char-gen', '/meme'];

  if (ogRoutes.includes(path)) {
    const supabaseUrl = `https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/serve-index?path=${path}`;
    return fetch(supabaseUrl);
  }

  return context.next();
}

export const config = {
  path: ['/paradoxxia', '/char-gen', '/meme']
};
