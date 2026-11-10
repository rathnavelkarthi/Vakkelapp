import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DarkGradientBgProps {
  children?: ReactNode;
  className?: string;
}

const streakMasks = [
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 36%, rgb(0, 0, 0) 55%, rgba(0, 0, 0, 0.13) 67%, rgb(0, 0, 0) 78%, rgba(0, 0, 0, 0) 97%)",
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 11%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0.55) 41%, rgba(0, 0, 0, 0.13) 67%, rgb(0, 0, 0) 78%, rgba(0, 0, 0, 0) 97%)",
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 9%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0.55) 28%, rgba(0, 0, 0, 0.424) 40%, rgb(0, 0, 0) 48%, rgba(0, 0, 0, 0.267) 54%, rgba(0, 0, 0, 0.13) 78%, rgb(0, 0, 0) 88%, rgba(0, 0, 0, 0) 97%)",
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 17%, rgba(0, 0, 0, 0.55) 26%, rgb(0, 0, 0) 35%, rgba(0, 0, 0, 0) 47%, rgba(0, 0, 0, 0.13) 69%, rgb(0, 0, 0) 79%, rgba(0, 0, 0, 0) 97%)",
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0.55) 27%, rgb(0, 0, 0) 42%, rgba(0, 0, 0, 0) 48%, rgba(0, 0, 0, 0.13) 67%, rgb(0, 0, 0) 74%, rgb(0, 0, 0) 82%, rgba(0, 0, 0, 0.47) 88%, rgba(0, 0, 0, 0) 97%)",
];

export function DarkGradientBg({ children, className }: DarkGradientBgProps) {
  return (
    <div className={cn("relative isolate min-h-screen w-full overflow-hidden bg-black", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="dark-pattern-streaks absolute inset-0 overflow-hidden"
          style={{
            background: "radial-gradient(100% 100% at 0% 0%, #2e2e2e 0%, #000 100%)",
            maskImage: "radial-gradient(125% 100% at 0% 0%, #000 0%, #0004 88.2883%, transparent 100%)",
          }}
        >
          {streakMasks.map(maskImage => (
            <div
              key={maskImage}
              className="absolute inset-0 skew-x-[45deg] opacity-20"
              style={{
                background: "linear-gradient(var(--pattern-streak, rgb(0 207 255)), transparent)",
                maskImage,
              }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 bg-repeat opacity-5"
          style={{
            backgroundImage: "url('/assets/elegant-dark-pattern-grain.png')",
            backgroundSize: "150px",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff80 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1e293b33,transparent_70%)]" />
      </div>
      {children}
    </div>
  );
}
