"use client";

import { useMemo } from "react";

export default function ParticleEffect({ type }: { type: string }) {
  const particles = useMemo(() => {
    const count = 40;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 4 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 100,
    }));
  }, []);

  if (type === "none") return null;

  const glyph = type === "snow" ? "❄" : type === "stars" ? "✦" : "✨";

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-10%",
            fontSize: `${p.size}px`,
            opacity: 0.7,
            animation:
              type === "stars"
                ? `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`
                : `fall ${p.duration}s linear ${p.delay}s infinite`,
            // @ts-expect-error custom css var
            "--drift": `${p.drift}px`,
            color: "white",
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}
