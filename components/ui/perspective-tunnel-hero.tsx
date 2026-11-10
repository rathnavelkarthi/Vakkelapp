"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const cards = Array.from({ length: 9 }, (_, index) => {
  const side = index % 2 === 0 ? -1 : 1;
  const row = Math.floor(index / 2);
  return {
    src: `/assets/hero-tunnel-${index + 1}.webp`,
    left: 50 + side * (40 + (row % 3) * 4),
    top: 24 + (row % 3) * 25 + (side === 1 ? 8 : 0),
    rotation: side * (4 + (row % 3) * 4),
    start: index / 9 * 0.45,
  };
});

function TunnelCard({
  card,
  progress,
  reduced,
}: {
  card: (typeof cards)[number];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const local = useTransform(progress, [card.start, card.start + 0.55], [0, 1]);
  const depth = useTransform(local, [0, 1], [-950, 310]);
  const opacity = useTransform(local, [0, 0.18, 0.72, 1], [0, 0.76, 0.76, 0]);
  const transform = useTransform(
    depth,
    z => `translate3d(-50%, -50%, ${z}px) rotateZ(${card.rotation}deg)`,
  );

  return (
    <motion.div
      className="absolute aspect-[4/5] w-[clamp(92px,16vw,220px)] overflow-hidden rounded-xl border border-solid border-white/15"
      style={{
        left: `${card.left}%`,
        top: `${card.top}%`,
        transform: reduced
          ? `translate3d(-50%, -50%, -290px) rotateZ(${card.rotation}deg)`
          : transform,
        opacity: reduced ? 0.48 : opacity,
      }}
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet={card.src} />
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
        />
      </picture>
    </motion.div>
  );
}

export function PerspectiveTunnelHero() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start start", "end start"],
  });
  const travel = useTransform(scrollYProgress, [0, 1], [0.38, 1]);
  const progress = useSpring(travel, { stiffness: 80, damping: 30 });

  return (
    <div className="hero-tunnel pointer-events-none absolute inset-0" aria-hidden="true">
      <div ref={stage} className="absolute inset-0 [perspective:950px]">
        {cards.map(card => (
          <TunnelCard key={card.src} card={card} progress={progress} reduced={Boolean(reduced)} />
        ))}
      </div>
    </div>
  );
}
