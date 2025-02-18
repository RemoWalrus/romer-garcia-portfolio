
const encodeUrl = (url: string): string => {
  try {
    return btoa(url);
  } catch (error) {
    console.error('Error encoding URL:', error);
    return url;
  }
};

const decodeUrl = (encodedUrl: string): string => {
  try {
    return atob(encodedUrl);
  } catch (error) {
    console.error('Error decoding URL:', error);
    return encodedUrl;
  }
};

export const getSecureMediaUrl = (path: string): string => {
  if (!import.meta.env.VITE_MEDIA_BASE_URL) {
    console.error('VITE_MEDIA_BASE_URL is not set in environment variables');
    return path;
  }
  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL.replace(/\/$/, '');
  const fullUrl = `${baseUrl}/${path}`;
  return encodeUrl(fullUrl);
};

export const getDecodedUrl = (encodedUrl: string): string => {
  if (!encodedUrl) return '';
  return decodeUrl(encodedUrl);
};
