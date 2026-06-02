export default function ProgressBar({ value, segmented = false }) {
  if (segmented) {
    const total = 10;
    const on = Math.round((value / 100) * total);
    return (
      <div className="progress-segments" role="progressbar" aria-valuenow={value}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < on ? "on" : ""} />
        ))}
      </div>
    );
  }
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value}>
      <div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
