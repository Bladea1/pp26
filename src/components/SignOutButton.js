"use client";

import { signOutAction } from "@/lib/auth/actions";

export default function SignOutButton({ className = "btn btn-ghost" }) {
  return (
    <form action={signOutAction}>
      <button type="submit" className={className}>
        Выйти
      </button>
    </form>
  );
}
