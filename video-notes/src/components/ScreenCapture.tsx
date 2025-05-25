import { useState, useRef } from 'react';

interface ScreenCaptureProps {
  onRecordingComplete?: (blob: Blob) => void;
}

export function ScreenCapture({ onRecordingComplete }: ScreenCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Screen capture failed:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="screen-capture">
      <div className="controls">
        {!isRecording ? (
          <button onClick={startScreenCapture} className="record-button">
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="stop-button">
            Stop Recording
          </button>
        )}
      </div>
      {recordedVideoUrl && (
        <div className="preview">
          <h3>Recording Preview</h3>
          <video src={recordedVideoUrl} controls style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
} 