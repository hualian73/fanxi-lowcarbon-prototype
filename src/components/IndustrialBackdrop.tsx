import { useEffect, useRef } from 'react';
import { createBackdropScene, type BackdropScene } from '../utils/industrialBackdrop';

function drawStream(
  ctx: CanvasRenderingContext2D,
  width: number,
  stream: BackdropScene['streams'][number],
  elapsed: number,
) {
  ctx.beginPath();
  for (let x = 0; x <= width; x += 24) {
    const t = x * 0.014 + elapsed * stream.speed + stream.phase;
    const y = stream.y + Math.sin(t) * stream.amplitude + Math.cos(t * 0.42) * stream.amplitude * 0.42;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = stream.color;
  ctx.globalAlpha = 0.13;
  ctx.lineWidth = 1.4;
  ctx.shadowBlur = 12;
  ctx.shadowColor = stream.color;
  ctx.stroke();
}

function drawNode(ctx: CanvasRenderingContext2D, node: BackdropScene['energyNodes'][number], elapsed: number) {
  const pulse = 0.6 + Math.sin(elapsed * 0.0024 + node.x * 0.01) * 0.25;
  ctx.globalAlpha = 0.24 + pulse * 0.16;
  ctx.fillStyle = node.color;
  ctx.shadowBlur = 18;
  ctx.shadowColor = node.color;
  ctx.beginPath();
  ctx.arc(node.x, node.y, 5 + pulse * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.42;
  ctx.font = '11px Segoe UI, sans-serif';
  ctx.fillText(node.label, node.x + 11, node.y + 4);
}

export function IndustrialBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scene = createBackdropScene(window.innerWidth, window.innerHeight);
    let animationFrame = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      scene = createBackdropScene(window.innerWidth, window.innerHeight);
    };

    const render = (elapsed = 0) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const solarGradient = ctx.createRadialGradient(
        scene.solarArc.x,
        scene.solarArc.y,
        0,
        scene.solarArc.x,
        scene.solarArc.y,
        scene.solarArc.radius,
      );
      solarGradient.addColorStop(0, 'rgba(250, 204, 21, 0.16)');
      solarGradient.addColorStop(0.45, 'rgba(33, 212, 253, 0.05)');
      solarGradient.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = solarGradient;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(scene.solarArc.x, scene.solarArc.y, scene.solarArc.radius, 0, Math.PI * 2);
      ctx.fill();

      scene.streams.forEach((stream) => drawStream(ctx, width, stream, elapsed));

      scene.particles.forEach((particle, index) => {
        const drift = reducedMotion ? 0 : elapsed * particle.speed * 0.02;
        const x = (particle.x + drift) % width;
        const y = particle.y + Math.sin(elapsed * 0.0012 + particle.phase) * 10;
        ctx.globalAlpha = 0.22 + Math.sin(elapsed * 0.001 + index) * 0.08;
        ctx.fillStyle = index % 5 === 0 ? '#FACC15' : index % 2 === 0 ? '#21D4FD' : '#10B981';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      scene.energyNodes.forEach((node) => drawNode(ctx, node, elapsed));

      ctx.globalCompositeOperation = 'source-over';
      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="industrial-backdrop" aria-hidden="true" />;
}
