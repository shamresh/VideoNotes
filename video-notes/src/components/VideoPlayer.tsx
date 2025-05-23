import { useRef, useEffect } from 'react';
import { TimeSelectionOverlay } from './TimeSelectionOverlay';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  onDurationChange: (duration: number) => void;
  onTimeChange: (seekTo: (time: number) => void) => void;
  videoDuration: number;
}

export function VideoPlayer({ videoId, onDurationChange, onTimeChange, videoDuration }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStartTimeRef = useRef<number>(0);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '315',
        width: '560',
        videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    onDurationChange(event.target.getDuration());
  };

  const onPlayerStateChange = (event: any) => {
    // Handle player state changes if needed
  };

  // Expose the seekTo method to parent component
  useEffect(() => {
    if (playerRef.current) {
      const seekTo = (time: number) => {
        playerRef.current.seekTo(time);
        playerRef.current.playVideo();
      };
      onTimeChange(seekTo);
    }
  }, [onTimeChange]);

  const handleTimeChange = (startTime: number, endTime: number) => {
    if (!playerRef.current) return;
    
    // Only proceed if start time actually changed
    if (startTime === prevStartTimeRef.current) return;
    
    prevStartTimeRef.current = startTime;
    playerRef.current.seekTo(startTime);
    playerRef.current.playVideo();
  };

  return (
    <div className="video-container" style={{ position: 'relative' }}>
      <div ref={containerRef}></div>
      <TimeSelectionOverlay
        videoDuration={videoDuration}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
} 