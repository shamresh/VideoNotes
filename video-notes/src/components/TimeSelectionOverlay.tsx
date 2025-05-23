import { useState, useRef, useEffect } from 'react';

interface TimeSelectionOverlayProps {
  videoDuration: number;
  onTimeChange: (startTime: number, endTime: number) => void;
  startTime: number;
  endTime: number;
}

export function TimeSelectionOverlay({ videoDuration, onTimeChange, startTime, endTime }: TimeSelectionOverlayProps) {
  const [internalStartTime, setInternalStartTime] = useState(startTime);
  const [internalEndTime, setInternalEndTime] = useState(endTime);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalStartTime(startTime);
  }, [startTime]);

  useEffect(() => {
    setInternalEndTime(endTime);
  }, [endTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent, point: 'start' | 'end') => {
    e.preventDefault();
    setIsDragging(point);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const time = Math.max(0, Math.min(videoDuration, position * videoDuration));

    if (isDragging === 'start') {
      const newStartTime = Math.min(time, internalEndTime - 1);
      setInternalStartTime(newStartTime);
      onTimeChange(newStartTime, internalEndTime);
    } else {
      const newEndTime = Math.max(time, internalStartTime + 1);
      setInternalEndTime(newEndTime);
      onTimeChange(internalStartTime, newEndTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={overlayRef}
      className="time-selection-overlay"
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0,
        height: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
      }}
    >
      <div
        className="start-handle"
        onMouseDown={(e) => handleMouseDown(e, 'start')}
        style={{
          position: 'absolute',
          left: `${(internalStartTime / videoDuration) * 100}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          cursor: 'ew-resize',
        }}
      >
        <div className="time-tooltip" style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}>
          {formatTime(internalStartTime)}
        </div>
      </div>
      <div
        className="end-handle"
        onMouseDown={(e) => handleMouseDown(e, 'end')}
        style={{
          position: 'absolute',
          left: `${(internalEndTime / videoDuration) * 100}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          cursor: 'ew-resize',
        }}
      >
        <div className="time-tooltip" style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}>
          {formatTime(internalEndTime)}
        </div>
      </div>
      <div
        className="selection-range"
        style={{
          position: 'absolute',
          left: `${(internalStartTime / videoDuration) * 100}%`,
          right: `${100 - (internalEndTime / videoDuration) * 100}%`,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      />
    </div>
  );
} 