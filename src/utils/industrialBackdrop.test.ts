import { describe, expect, it } from 'vitest';
import { createBackdropScene } from './industrialBackdrop';

describe('industrialBackdrop', () => {
  it('creates deterministic particles and streams for a viewport', () => {
    const scene = createBackdropScene(1280, 720);

    expect(scene.particles).toHaveLength(42);
    expect(scene.streams).toHaveLength(5);
    expect(scene.energyNodes).toHaveLength(6);
    expect(scene.solarArc.radius).toBeGreaterThan(120);
  });

  it('keeps all generated particles inside the viewport', () => {
    const scene = createBackdropScene(800, 600);

    for (const particle of scene.particles) {
      expect(particle.x).toBeGreaterThanOrEqual(0);
      expect(particle.x).toBeLessThanOrEqual(800);
      expect(particle.y).toBeGreaterThanOrEqual(0);
      expect(particle.y).toBeLessThanOrEqual(600);
    }
  });
});
