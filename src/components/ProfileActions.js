"use client";

import { toast } from "sonner";
import SignOutButton from "@/components/SignOutButton";

export default function ProfileActions({ isAuthenticated = false }) {
  return (
    <div className="home-hero-actions" style={{ marginTop: 20 }}>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => toast("Редактирование профиля — в следующей версии")}
      >
        Редактировать профиль
      </button>
      <button
        type="button"
        className="btn"
        onClick={() => {
          navigator.clipboard?.writeText(window.location.href);
          toast.success("Ссылка скопирована");
        }}
      >
        Поделиться профилем
      </button>
      {isAuthenticated && <SignOutButton className="btn btn-pink" />}
    </div>
  );
}
