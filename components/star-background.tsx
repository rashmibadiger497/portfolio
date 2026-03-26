"use client";

import { useEffect, useRef } from "react";

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }> = [];

    let nebulae: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
    }> = [];

    let shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.02 + 0.005,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      nebulae = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          radius: 200,
          color: "0, 212, 255",
          opacity: 0.03,
          pulseSpeed: 0.005,
          pulseOffset: 0,
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.6,
          radius: 250,
          color: "100, 50, 200",
          opacity: 0.025,
          pulseSpeed: 0.003,
          pulseOffset: Math.PI,
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.15,
          radius: 180,
          color: "0, 180, 150",
          opacity: 0.02,
          pulseSpeed: 0.004,
          pulseOffset: Math.PI / 2,
        },
      ];
    };

    const spawnShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.002) {
        shootingStars.push({
          x: Math.random() * canvas.width + 200,
          y: Math.random() * (canvas.height * 0.5),
          length: Math.random() * 80 + 50,
          speed: Math.random() * 4 + 3,
          opacity: 1,
          angle: (Math.PI / 4) + (Math.random() * 0.3 - 0.15),
        });
      }
    };

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae
      for (const neb of nebulae) {
        const pulse = Math.sin(time * neb.pulseSpeed + neb.pulseOffset) * 0.5 + 0.5;
        const gradient = ctx.createRadialGradient(
          neb.x,
          neb.y,
          0,
          neb.x,
          neb.y,
          neb.radius
        );
        gradient.addColorStop(0, `rgba(${neb.color}, ${neb.opacity + pulse * 0.02})`);
        gradient.addColorStop(0.5, `rgba(${neb.color}, ${(neb.opacity + pulse * 0.01) * 0.5})`);
        gradient.addColorStop(1, `rgba(${neb.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw stars
      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${star.opacity * twinkle})`;
        ctx.fill();

        // Star glow
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity * twinkle * 0.1})`;
          ctx.fill();
        }
      }

      // Shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x -= Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.008;

        if (ss.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const gradient = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x + Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x + Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${ss.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
