"use client";

export default function OptionGrid({ options, value, onChange, multiple = false }) {
  function toggle(opt) {
    if (multiple) {
      const set = new Set(value);
      if (set.has(opt)) set.delete(opt);
      else set.add(opt);
      onChange([...set]);
    } else {
      onChange(opt);
    }
  }

  return (
    <div className="option-row" role={multiple ? "group" : "radiogroup"}>
      {options.map((opt) => {
        const on = multiple ? value.includes(opt) : value === opt;
        return (
          <button
            key={opt}
            type="button"
            className={`option-btn ${on ? "on" : ""}`}
            aria-pressed={on}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
