export interface BackdropParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
}

export interface BackdropStream {
  y: number;
  amplitude: number;
  speed: number;
  color: string;
  phase: number;
}

export interface EnergyNode {
  x: number;
  y: number;
  label: string;
  color: string;
}

export interface BackdropScene {
  particles: BackdropParticle[];
  streams: BackdropStream[];
  energyNodes: EnergyNode[];
  solarArc: {
    x: number;
    y: number;
    radius: number;
  };
}

function pseudoRandom(index: number, salt: number) {
  const value = Math.sin(index * 97.31 + salt * 31.17) * 10000;
  return value - Math.floor(value);
}

export function createBackdropScene(width: number, height: number): BackdropScene {
  const particles = Array.from({ length: 42 }, (_, index) => ({
    x: Math.round(pseudoRandom(index, 1) * width),
    y: Math.round(pseudoRandom(index, 2) * height),
    radius: 0.8 + pseudoRandom(index, 3) * 1.8,
    speed: 0.16 + pseudoRandom(index, 4) * 0.32,
    phase: pseudoRandom(index, 5) * Math.PI * 2,
  }));

  const streams = [
    { y: height * 0.18, amplitude: 18, speed: 0.00042, color: '#21D4FD', phase: 0 },
    { y: height * 0.31, amplitude: 24, speed: 0.00036, color: '#10B981', phase: 1.2 },
    { y: height * 0.49, amplitude: 28, speed: 0.00032, color: '#FACC15', phase: 2.4 },
    { y: height * 0.68, amplitude: 20, speed: 0.0004, color: '#21D4FD', phase: 3.1 },
    { y: height * 0.82, amplitude: 16, speed: 0.00048, color: '#10B981', phase: 4.3 },
  ];

  const energyNodes: EnergyNode[] = [
    { x: width * 0.14, y: height * 0.26, label: 'PV', color: '#FACC15' },
    { x: width * 0.32, y: height * 0.62, label: 'AIR', color: '#21D4FD' },
    { x: width * 0.48, y: height * 0.36, label: 'DO', color: '#10B981' },
    { x: width * 0.64, y: height * 0.72, label: 'PAC', color: '#21D4FD' },
    { x: width * 0.78, y: height * 0.42, label: 'CO2', color: '#10B981' },
    { x: width * 0.9, y: height * 0.24, label: 'AI', color: '#FACC15' },
  ];

  return {
    particles,
    streams,
    energyNodes,
    solarArc: {
      x: width * 0.84,
      y: height * 0.16,
      radius: Math.max(130, Math.min(width, height) * 0.24),
    },
  };
}
