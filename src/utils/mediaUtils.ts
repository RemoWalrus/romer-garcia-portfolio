
const encodeUrl = (url: string): string => {
  try {
    const encodedUrl = btoa(url);
    return encodedUrl.split('').reverse().join('');
  } catch (error) {
    console.error('Error encoding URL:', error);
    return url;
  }
};

const decodeUrl = (encodedUrl: string): string => {
  try {
    const reversedUrl = encodedUrl.split('').reverse().join('');
    return atob(reversedUrl);
  } catch (error) {
    console.error('Error decoding URL:', error);
    return encodedUrl;
  }
};

export const getSecureMediaUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL;
  const fullUrl = `${baseUrl}/${path}`;
  return encodeUrl(fullUrl);
};

export const getDecodedUrl = (encodedUrl: string): string => {
  return decodeUrl(encodedUrl);
};
