'use client';

export default function CrashChart({ points, multiplier, phase, crashPoint }) {
  const width = 700;
  const height = 320;
  const padding = 24;

  const maxT = points.length ? points[points.length - 1].t : 1;
  const maxM = Math.max(2, multiplier * 1.15);

  const toX = (t) => padding + (t / Math.max(maxT, 1)) * (width - padding * 2);
  const toY = (m) =>
    height - padding - ((m - 1) / (maxM - 1)) * (height - padding * 2);

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t)} ${toY(p.m)}`)
    .join(' ');

  const areaD =
    points.length > 1
      ? `${pathD} L ${toX(points[points.length - 1].t)} ${height - padding} L ${toX(0)} ${height - padding} Z`
      : '';

  const lastPoint = points[points.length - 1];
  const isCrashed = phase === 'crashed';

  return (
    <div className="relative w-full h-80 glass-panel overflow-hidden">
      {/* Background grid */}
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal grid lines */}
        {[1, 1.5, 2, 3, 5, 10].map((m) =>
          m <= maxM ? (
            <line
              key={m}
              x1={padding}
              x2={width - padding}
              y1={toY(m)}
              y2={toY(m)}
              stroke="#2a3849"
              strokeWidth="1"
            />
          ) : null
        )}

        {areaD && <path d={areaD} fill="url(#areaFill)" />}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={isCrashed ? '#ef4444' : '#eab308'}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {lastPoint && !isCrashed && (
          <circle
            cx={toX(lastPoint.t)}
            cy={toY(lastPoint.m)}
            r="6"
            fill="#eab308"
            className="animate-pulse-glow"
          />
        )}
      </svg>

      {/* Big multiplier readout */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`font-display font-bold text-6xl tabular-nums transition-colors
            ${isCrashed ? 'text-lose' : 'text-white'}`}
        >
          {isCrashed ? `${crashPoint.toFixed(2)}x` : `${multiplier.toFixed(2)}x`}
        </span>
      </div>

      {isCrashed && (
        <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
          <span className="text-lose font-semibold text-sm bg-lose/10 border border-lose/30 px-3 py-1 rounded-full">
            Crashed
          </span>
        </div>
      )}
    </div>
  );
}
