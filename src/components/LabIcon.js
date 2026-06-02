/** Иконки лаборатории в едином стиле (лайм / моно) */
const ICONS = {
  flask: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M9 3h6v5l5 9a4 4 0 01-3.5 6H7.5A4 4 0 014 17l5-9V3z" />
      <path d="M9 8h6" />
    </svg>
  ),
  sample: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 12h16M12 4v16" />
    </svg>
  ),
  mutation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 18l4-8 4 4 4-10 4 14" />
    </svg>
  ),
  reagent: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  archive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h16v14H4zM4 10h16M8 14h8" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 2-3.5 4-3.5" />
    </svg>
  ),
  journal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 4h12v16H6zM10 8h8M10 12h8M10 16h5" />
    </svg>
  )
};

export default function LabIcon({ name, size = 20, className = "" }) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <span
      className={`lab-icon ${className}`}
      style={{ width: size, height: size, display: "inline-flex" }}
    >
      {icon}
    </span>
  );
}
