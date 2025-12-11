"use client";

import { useZxing } from "react-zxing";

interface BarcodeScannerProps {
  onResult: (text: string) => void;
}

export default function BarcodeScanner({ onResult }: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
  });

  return <video ref={ref} className="w-full max-w-xs rounded border" />;
}
