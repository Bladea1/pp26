"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
  className,
  idleLabel,
  pendingLabel,
  ...props
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending} {...props}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
