export function to2(val: number): number {
  if (!isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}
