"use client";

import { useEffect, useRef, useState } from "react";

export default function LabSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value)?.label || value;

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div className="select-wrap" ref={ref}>
      {label && <span className="sr-only">{label}</span>}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {current}
      </button>
      {open && (
        <div className="select-menu" role="listbox">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
