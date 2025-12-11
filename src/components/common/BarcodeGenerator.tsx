import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface Props {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}
export default function BarcodeGenerator({
  value,
  width = 2,
  height = 60,
  displayValue = true,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, String(value), {
        format: "CODE128",
        displayValue,
        width,
        height,
        margin: 0,
      });
    } catch (e) {
        // fallback: nothing
        console.log(e);
    }
  }, [value, width, height, displayValue]);

  return <svg ref={svgRef} />;
}
