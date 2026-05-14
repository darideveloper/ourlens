const MAX_WIDTH = 1024;
const JPEG_QUALITY = 0.7;

interface FrameResult {
  base64: string;
  width: number;
  height: number;
}

export function extractFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): ImageData | null {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function processFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): FrameResult | null {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const vw = video.videoWidth;
  const vh = video.videoHeight;

  if (!vw || !vh) return null;

  let w = vw;
  let h = vh;

  while (w > MAX_WIDTH * 2) {
    w = Math.floor(w / 2);
    h = Math.floor(h / 2);
  }

  const scale = MAX_WIDTH / w;
  w = MAX_WIDTH;
  h = Math.round(h * scale);

  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(video, 0, 0, w, h);

  const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

  canvas.width = 0;
  canvas.height = 0;

  return { base64, width: w, height: h };
}

export function getRearCameraStream(
  signal?: AbortSignal,
): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return Promise.reject(
      new DOMException(
        'Camera access requires a secure connection (HTTPS). Please access this app over HTTPS or add it to your home screen.',
        'NotAllowedError',
      ),
    );
  }

  return navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    })
    .catch((err) => {
      if ((err as DOMException).name === 'OverconstrainedError') {
        return navigator.mediaDevices!.getUserMedia({
          video: true,
          audio: false,
        });
      }
      throw err;
    });
}

export function isInsecureContext(): boolean {
  return typeof window !== 'undefined' && !window.isSecureContext;
}

export interface CameraError {
  type: 'permission' | 'timeout' | 'unavailable' | 'unknown';
  message: string;
}

export function classifyCameraError(err: unknown): CameraError {
  if (err instanceof TypeError && err.message.includes('getUserMedia')) {
    return {
      type: 'permission',
      message:
        'Camera access requires a secure connection (HTTPS). Please access this app over HTTPS or add it to your home screen.',
    };
  }

  const dom = err as DOMException;

  if (dom.name === 'NotAllowedError' || dom.name === 'PermissionDeniedError') {
    return {
      type: 'permission',
      message:
        'Camera access was denied. Please enable camera permissions in your browser settings and try again.',
    };
  }

  if (dom.name === 'TimeoutError') {
    return {
      type: 'timeout',
      message:
        'Camera did not respond in time. Please ensure your camera is connected and try again.',
    };
  }

  if (
    dom.name === 'NotFoundError' ||
    dom.name === 'DevicesNotFoundError' ||
    dom.name === 'NotReadableError'
  ) {
    return {
      type: 'unavailable',
      message:
        'No camera was found or the camera is in use by another application.',
    };
  }

  return {
    type: 'unknown',
    message:
      err instanceof Error
        ? err.message
        : 'An unexpected camera error occurred. Please try again.',
  };
}

export function stopStreamTracks(stream: MediaStream | null): void {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}

export function releaseVideoElement(video: HTMLVideoElement | null): void {
  if (!video) return;
  video.pause();
  video.srcObject = null;
  video.load();
}
