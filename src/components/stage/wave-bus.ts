export type Burst = { x: number; y: number; r: number; a: number; power: number };

const bursts: Burst[] = [];

export function burst(x: number, y: number, power = 1) {
  bursts.push({ x, y, r: 8, a: 0.9, power });
  if (bursts.length > 20) bursts.shift();
}

export function liveBursts() {
  return bursts;
}
