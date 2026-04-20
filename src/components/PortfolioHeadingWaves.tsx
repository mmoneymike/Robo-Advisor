interface Props {
  title: string;
  subtitle?: string;
  /** Default h2 for step headings; use h1 for the landing hero. */
  titleAs?: "h1" | "h2";
}

/** One horizontal period (1200×100) — duplicated for seamless scroll */
function WaveStrip({
  gradientId,
  pathD,
  strokeWidth,
  stroke,
  opacity = 1,
}: {
  gradientId: string;
  pathD: string;
  strokeWidth: number;
  stroke?: string;
  opacity?: number;
}) {
  return (
    <svg
      className="h-full w-1/2 shrink-0"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {!stroke ? (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b4e6" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#0090e0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0078d4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        d={pathD}
        fill="none"
        stroke={stroke ?? `url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}

export function PortfolioHeadingWaves({
  title,
  subtitle,
  titleAs: TitleTag = "h2",
}: Props) {
  const waveA = "M0,52 Q300,12 600,52 T1200,52";
  const waveB = "M0,46 Q320,78 640,46 T1200,46";
  const waveC = "M0,58 Q280,90 560,58 T1200,58";

  return (
    <div className="text-center w-full">
      {/* Full-viewport-width waves, centered on the title row */}
      <div className="relative w-full py-2">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[4.5rem] w-screen max-w-[100vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden md:h-[5.5rem]"
          aria-hidden
        >
          <div className="absolute inset-0 flex w-[200%] animate-portfolio-wave motion-reduce:animate-none">
            <WaveStrip
              gradientId="phw-a"
              pathD={waveA}
              strokeWidth={2.25}
            />
            <WaveStrip
              gradientId="phw-a2"
              pathD={waveA}
              strokeWidth={2.25}
            />
          </div>
          <div className="absolute inset-0 flex w-[200%] animate-portfolio-wave-slow [animation-direction:reverse] opacity-90 motion-reduce:animate-none">
            <WaveStrip
              gradientId="phw-b"
              pathD={waveB}
              strokeWidth={1.5}
            />
            <WaveStrip
              gradientId="phw-b2"
              pathD={waveB}
              strokeWidth={1.5}
            />
          </div>
          <div className="absolute inset-0 flex w-[200%] animate-portfolio-wave-fast opacity-45 motion-reduce:animate-none">
            <WaveStrip
              gradientId="phw-c"
              pathD={waveC}
              strokeWidth={1}
              stroke="#00a8cc"
            />
            <WaveStrip
              gradientId="phw-c2"
              pathD={waveC}
              strokeWidth={1}
              stroke="#00a8cc"
            />
          </div>
        </div>

        <TitleTag className="relative z-10 text-4xl font-bold leading-tight text-navy drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] md:text-5xl">
          {title}
        </TitleTag>
      </div>

      {subtitle ? (
        <p className="relative z-10 mx-auto mt-3 max-w-3xl text-lg text-muted">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
