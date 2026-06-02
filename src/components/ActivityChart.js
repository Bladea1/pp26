"use client";

export default function ActivityChart({ labels, reactions, views }) {
  const max = Math.max(...reactions, ...views, 1);
  const w = 280;
  const h = 120;
  const step = w / (labels.length - 1);

  function path(values, color) {
    const points = values.map((v, i) => {
      const x = i * step;
      const y = h - (v / max) * (h - 16) - 8;
      return `${x},${y}`;
    });
    return (
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points.join(" ")}
      />
    );
  }

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <span className="chart-legend-item pink">● Реакции</span>
        <span className="chart-legend-item lime">● Просмотры</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="activity-chart" aria-hidden>
        {path(views, "var(--lime)")}
        {path(reactions, "var(--pink)")}
      </svg>
      <div className="chart-labels">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}
