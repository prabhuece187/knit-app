import numberToWords from "number-to-words";

export function to2(val: number | null | undefined): number {
  const num = Number(val); // convert anything to number
  if (!isFinite(num)) return 0; // handle NaN, Infinity, undefined
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export const formatDate = (
  val?: string | number | Date,
  style: "dash" | "short" | "long" = "dash"
): string => {
  if (!val) return "—";
  const d = val instanceof Date ? val : new Date(String(val));
  if (Number.isNaN(d.getTime())) return "—";

  switch (style) {
    case "short":
      // Example: 05 Nov 2025
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "long":
      // Example: 05 November 2025
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    case "dash":
    default: {
      // Example: 05-11-2025
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
  }
};

export function amountInWords(amount: number): string {
  if (isNaN(amount)) return "";

  const [rupees, paise] = amount.toFixed(2).split(".");
  const capitalizeWords = (text: string) =>
    text.replace(/\b\w/g, (c: string) => c.toUpperCase());

  const words = capitalizeWords(numberToWords.toWords(Number(rupees)));

  let result = `${words} Rupees`;
  if (Number(paise) > 0) {
    result += ` And ${capitalizeWords(
      numberToWords.toWords(Number(paise))
    )} Paise`;
  }
  return result + " Only";
}


// src/utility/barcode.ts
export function generateBarcode(prefix = "ITM"): string {
  // Example: ITM-20251114-7A3F
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const ts = `${yyyy}${mm}${dd}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
