"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  glowColor: string;
  pulseOffset: number;
}

export function AnimatedBrandCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width =
      canvas.parentElement?.clientWidth || window.innerWidth * 0.44);
    let height = (canvas.height =
      canvas.parentElement?.clientHeight || window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Mouse tracking with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = clientX - width / 2;
      mouseY = clientY - height / 2;
      targetRotY = (mouseX / width) * 0.4;
      targetRotX = -(mouseY / height) * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    // Color palette inspired by botanical nutrients
    const colors = [
      { core: "rgba(190, 242, 100, 0.95)", glow: "rgba(190, 242, 100, 0.3)" }, // Lime
      { core: "rgba(52, 211, 153, 0.95)", glow: "rgba(52, 211, 153, 0.35)" }, // Emerald
      { core: "rgba(45, 212, 191, 0.9)", glow: "rgba(45, 212, 191, 0.25)" }, // Teal
      { core: "rgba(255, 255, 255, 0.95)", glow: "rgba(167, 243, 208, 0.3)" }, // Crisp White / Mint
    ];

    // Generate 3D particles in a spherical / toroidal volume
    const PARTICLE_COUNT = 85;
    const particles: Particle3D[] = [];
    const spread = Math.min(width, height) * 0.55;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = spread * (0.35 + Math.random() * 0.65);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const colorPair = colors[Math.floor(Math.random() * colors.length)];

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.2 + 1.2,
        color: colorPair.core,
        glowColor: colorPair.glow,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Ambient floating glow orbs
    const ambientOrbs = [
      {
        x: -width * 0.15,
        y: -height * 0.2,
        radius: 240,
        color: "rgba(20, 184, 166, 0.15)",
      },
      {
        x: width * 0.2,
        y: height * 0.25,
        radius: 280,
        color: "rgba(132, 204, 22, 0.12)",
      },
      { x: 0, y: 0, radius: 200, color: "rgba(5, 150, 105, 0.1)" },
    ];

    let time = 0;
    const fov = 350;

    const render = () => {
      time += 0.015;

      // Smooth rotation interpolation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      // Base auto-drift rotation
      const autoRotY = currentRotY + time * 0.12;
      const autoRotX = currentRotX + Math.sin(time * 0.3) * 0.08;

      const cosX = Math.cos(autoRotX);
      const sinX = Math.sin(autoRotX);
      const cosY = Math.cos(autoRotY);
      const sinY = Math.sin(autoRotY);

      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing ambient background orbs
      ambientOrbs.forEach((orb, idx) => {
        const driftX = Math.sin(time * 0.4 + idx) * 35;
        const driftY = Math.cos(time * 0.3 + idx) * 35;
        const centerX = width / 2 + orb.x + driftX;
        const centerY = height / 2 + orb.y + driftY;

        const grad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          orb.radius,
        );
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(2, 44, 34, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Project 3D particles to 2D
      const projected = particles.map((p) => {
        // Subtle organic float
        p.baseX += p.vx;
        p.baseY += p.vy;
        p.baseZ += p.vz;

        // Soft bounce inside bounds
        if (Math.abs(p.baseX) > spread) p.vx *= -1;
        if (Math.abs(p.baseY) > spread) p.vy *= -1;
        if (Math.abs(p.baseZ) > spread) p.vz *= -1;

        // Wave displacement
        const wave = Math.sin(time * 1.5 + p.pulseOffset) * 6;
        const px = p.baseX;
        const py = p.baseY + wave;
        const pz = p.baseZ;

        // 3D Rotation matrices
        // Y-axis rotation
        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;

        // X-axis rotation
        const y2 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        // Perspective projection
        const scale = fov / (fov + z2 + 300);
        const screenX = width / 2 + x1 * scale;
        const screenY = height / 2 + y2 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z2 + 250) / 450));

        return {
          ...p,
          screenX,
          screenY,
          scale,
          alpha,
          z2,
        };
      });

      // Sort by depth (render back to front)
      projected.sort((a, b) => b.z2 - a.z2);

      // 3. Draw energy network connections
      const maxDistance = 95;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha =
              (1 - dist / maxDistance) * 0.28 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(110, 231, 183, ${lineAlpha})`;
            ctx.lineWidth = 0.85 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.stroke();
          }
        }
      }

      // 4. Draw glowing 3D nodes
      projected.forEach((p) => {
        const pulse = Math.sin(time * 2 + p.pulseOffset) * 0.4 + 1;
        const r = Math.max(1, p.size * p.scale * pulse);

        // Outer glow
        const glowGrad = ctx.createRadialGradient(
          p.screenX,
          p.screenY,
          0,
          p.screenX,
          p.screenY,
          r * 4,
        );
        glowGrad.addColorStop(0, p.glowColor);
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none h-full w-full opacity-80"
    />
  );
}
