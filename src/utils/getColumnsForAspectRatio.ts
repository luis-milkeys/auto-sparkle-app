export function getColumnsForAspectRatio(width: number, height: number): number {
  const ar = width / height;
  if (ar >= 1) return 4;
  if (ar >= 0.5 && ar < 1) return 2;
  return 1;
}
