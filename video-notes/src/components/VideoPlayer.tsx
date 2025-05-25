import { useRef, useEffect, useState } from 'react';
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
  onTimeRangeChange: (startTime: number, endTime: number) => void;
  selectedStartTime: number;
  selectedEndTime: number;
}

export function VideoPlayer({ videoId, onDurationChange, onTimeChange, videoDuration, onTimeRangeChange, selectedStartTime, selectedEndTime }: VideoPlayerProps) {
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
    console.log('YouTube Player is ready');
    onDurationChange(event.target.getDuration());
    const seekTo = (time: number) => {
      console.log('seekTo called with:', time);
      event.target.seekTo(time);
      event.target.playVideo();
    };
    onTimeChange(seekTo);
  };

  const onPlayerStateChange = (event: any) => {
    // Handle player state changes if needed
  };

  const handleTimeChange = (startTime: number, endTime: number) => {
    if (!playerRef.current) return;
    // Endtime has only changed.
    onTimeRangeChange(startTime, endTime);
    if (startTime === prevStartTimeRef.current) {
      return;
    }
    // Starttime has changed.
    prevStartTimeRef.current = startTime;
    playerRef.current.seekTo(startTime);
  };

  return (
    <div className="video-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 560, height: 315 }}>
        {/* Overlay at the bottom, full width, 20px height */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 560, height: '20px', zIndex: 2, pointerEvents: 'none' }}>
          <TimeSelectionOverlay
            videoDuration={videoDuration}
            onTimeChange={handleTimeChange}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
          />
        </div>
        <div ref={containerRef}></div>
      </div>
    </div>
  );
} 