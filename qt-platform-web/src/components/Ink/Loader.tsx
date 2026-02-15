import React, { useEffect, useRef } from 'react';
import styles from './InkLoader.module.css';

interface InkLoaderProps {
  size?: number;
  color?: string;
}

export const InkLoader: React.FC<InkLoaderProps> = ({ 
  size = 60, 
  color = 'var(--ink-dark)' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    let animationId: number;
    let frame = 0;
    const drops: Array<{ x: number; y: number; radius: number; opacity: number }> = [];

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Create new drop every 20 frames
      if (frame % 20 === 0) {
        drops.push({
          x: size / 2,
          y: size / 2,
          radius: 0,
          opacity: 1,
        });
      }

      // Update and draw drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        drop.radius += 0.5;
        drop.opacity -= 0.015;

        if (drop.opacity <= 0) {
          drops.splice(i, 1);
          continue;
        }

        // Draw ink drop with gradient
        const gradient = ctx.createRadialGradient(
          drop.x, drop.y, 0,
          drop.x, drop.y, drop.radius
        );
        gradient.addColorStop(0, `rgba(139, 0, 0, ${drop.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(139, 0, 0, ${drop.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(139, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size, color]);

  return (
    <div className={styles.loaderContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.text}>加载中...</div>
    </div>
  );
};
