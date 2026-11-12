const NOTES = [233.08, 293.66, 349.23, 415.3, 523.25];
const lastAt = [0, 0, 0, 0, 0];

let ctx: AudioContext | null = null;
let armed = false;

function context(): AudioContext | null {
  if (!armed) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function brass(freq: number, when: number, dur: number, gain: number) {
  const audio = context();
  if (!audio) return;
  const master = audio.createGain();
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(420, when);
  filter.frequency.exponentialRampToValueAtTime(1600, when + 0.08);
  filter.frequency.exponentialRampToValueAtTime(640, when + dur);
  filter.Q.value = 0.6;
  master.gain.setValueAtTime(0.0001, when);
  master.gain.exponentialRampToValueAtTime(gain, when + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  filter.connect(master);
  master.connect(audio.destination);

  const partials: Array<[number, OscillatorType, number]> = [
    [1, "triangle", 0.7],
    [1.003, "sine", 0.45],
    [2, "sine", 0.12],
    [3, "triangle", 0.05],
  ];
  for (const [mult, type, level] of partials) {
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq * mult;
    g.gain.value = level;
    osc.connect(g);
    g.connect(filter);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }
}

export function audioArmed() {
  return armed;
}

export async function armAudio() {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return false;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") await ctx.resume();
  armed = true;
  const now = ctx.currentTime + 0.02;
  brass(116.54, now, 1.5, 0.05);
  brass(174.61, now, 1.6, 0.04);
  brass(233.08, now + 0.04, 1.8, 0.045);
  return true;
}

export function playNote(index: number) {
  const audio = context();
  if (!audio) return;
  const nowMs = performance.now();
  if (nowMs - lastAt[index] < 240) return;
  lastAt[index] = nowMs;
  const freq = NOTES[index] ?? 440;
  brass(freq, audio.currentTime + 0.01, 1.15, 0.07);
}
