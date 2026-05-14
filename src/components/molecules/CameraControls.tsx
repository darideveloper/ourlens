import { IconButton } from '@/components/atoms/IconButton';
import { Spinner } from '@/components/atoms/Spinner';

interface CameraControlsProps {
  onCapture: () => void;
  onRecord: () => void;
  isRecording: boolean;
  disabled: boolean;
}

export function CameraControls({
  onCapture,
  onRecord,
  isRecording,
  disabled,
}: CameraControlsProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8 px-4 z-10">
      <IconButton
        onClick={onCapture}
        disabled={disabled || isRecording}
        label="Capture photo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </IconButton>

      <IconButton
        onClick={onRecord}
        disabled={disabled}
        label={isRecording ? 'Recording' : 'Record 3-second video'}
      >
        {isRecording ? (
          <div className="flex items-center justify-center p-1 rounded-full ring-2 ring-danger-500 animate-pulse-slow">
            <Spinner size="base" />
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
          </svg>
        )}
      </IconButton>
    </div>
  );
}
