import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

export default function Scanner({
  onScan,
}: {
  onScan: (value: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    const reader = readerRef.current;

    const start = async () => {
      try {
        await reader.decodeFromVideoDevice(
          null, // deviceId (undefined = default camera)
          videoRef.current!,
          (result: Result | undefined) => {
            if (result) onScan(result.getText());
          }
        );
      } catch (e) {
        console.error("Scanner error:", e);
      }
    };

    start();

    return () => {
      // --- Stop camera manually ---
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop()); // <--- Stops camera
      }

      reader.reset?.(); // Optional (older versions)
    };
  }, [onScan]);

  return (
    <video
      ref={videoRef}
      style={{ width: 300, height: 200, border: "1px solid #ccc" }}
    />
  );
}
