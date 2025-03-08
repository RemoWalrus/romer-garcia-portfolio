
interface ProjectVideoProps {
  url: string;
  title: string;
}

export const ProjectVideo = ({ url, title }: ProjectVideoProps) => {
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Handle YouTube Shorts URLs
    if (url.includes('/shorts/')) {
      const videoId = url.split('/shorts/')[1].split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`;
    }
    
    // Handle regular YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&playsinline=1`;
    }
    
    // Handle YouTube playlist URLs
    const playlistRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|playlist\?list=)([^#&?]*).*/;
    const playlistMatch = url.match(playlistRegExp);
    
    if (playlistMatch && playlistMatch[2]) {
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistMatch[2]}&rel=0&playsinline=1`;
    }
    
    return null;
  };

  return (
    <div className="relative w-full h-full bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-[400px] mx-auto">
          <div className="relative pb-[177.78%]">
            <iframe
              src={getYouTubeEmbedUrl(url)}
              title={`${title} video`}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};
