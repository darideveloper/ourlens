import { type RefObject } from 'react';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function CameraView({ videoRef }: CameraViewProps) {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      aria-label="Camera view"
      className="absolute inset-0 w-full h-full object-cover bg-surface-alt"
      style={{ touchAction: 'manipulation' }}
    />
  );
}
