export const XP_PER_LEVEL = 500;

export function levelFromXp(xp: number) {
  return Math.max(1, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1);
}

export function normalizeXp(xp: number) {
  return Math.max(0, Math.floor(xp));
}

export function applyXp(currentXp: number, delta: number) {
  const xp = normalizeXp(currentXp + delta);
  return { xp, level: levelFromXp(xp) };
}
