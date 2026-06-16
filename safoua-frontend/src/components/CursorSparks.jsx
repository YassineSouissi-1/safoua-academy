/**
 * components/CursorSparks.jsx — Safoua Academy
 * Extracted from App.jsx (was inlined there before).
 * Renders a canvas overlay that emits particle sparks on mouse/touch move.
 */

import { useRef, useEffect } from 'react';

const C = {
  gold:  '#c9a84c',
  goldL: '#e8c97a',
  teal:  '#1db584',
  tealL: '#25d4a0',
};
const COLORS = [C.gold, C.goldL, C.teal, C.tealL, '#9d7bea', '#ffffff'];

export default function CursorSparks() {
  const canvasRef  = useRef(null);
  const particles  = useRef([]);
  const rafRef     = useRef(null);
  const lastEmit   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const cx  = e.touches ? e.touches[0].clientX : e.clientX;
      const cy  = e.touches ? e.touches[0].clientY : e.clientY;
      const now = Date.now();
      if (now - lastEmit.current < 20) return;
      lastEmit.current = now;

      for (let i = 0; i < 4; i++) {
        const a  = Math.random() * Math.PI * 2;
        const sp = 0.6 + Math.random() * 2;
        const sz = 1.5 + Math.random() * 3.5;
        particles.current.push({
          x: cx, y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.9,
          size: sz, maxSize: sz,
          color:    COLORS[Math.floor(Math.random() * COLORS.length)],
          life:     1,
          decay:    0.022 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.12,
          shape:    Math.random() > 0.5 ? 'circle' : 'diamond',
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    const drawDiamond = (c, x, y, r, rot) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot + Math.PI / 4);
      c.beginPath();
      c.rect(-r / 2, -r / 2, r, r);
      c.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0);

      for (const p of particles.current) {
        p.x  += p.vx; p.y += p.vy;
        p.vy += 0.035; p.vx *= 0.98;
        p.life     -= p.decay;
        p.rotation += p.rotSpeed;
        p.size      = p.maxSize * p.life;

        ctx.globalAlpha = Math.max(0, p.life * 0.85);
        ctx.fillStyle   = p.color;

        if (p.shape === 'diamond') {
          drawDiamond(ctx, p.x, p.y, Math.max(0.1, p.size), p.rotation);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.1, p.size / 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        pointerEvents:  'none',
        mixBlendMode:   'screen',
      }}
    />
  );
}
