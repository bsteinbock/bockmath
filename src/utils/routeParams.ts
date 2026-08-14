export function parseNumberParam(value: string | string[] | undefined, fallback: number): number {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseBooleanParam(value: string | string[] | undefined, fallback = false): boolean {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === undefined) {
    return fallback;
  }

  return candidate === 'true';
}

export function parseCsvNumbers(value: string | string[] | undefined): number[] {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate) {
    return [];
  }

  return candidate
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}
