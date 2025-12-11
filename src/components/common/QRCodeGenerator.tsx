import { QRCodeCanvas } from "qrcode.react";

interface Props {
  value: string;
  size?: number;
}

export default function QRCodeGenerator({ value, size = 120 }: Props) {
  return <QRCodeCanvas value={value} size={size} />;
}
