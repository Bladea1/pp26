import Link from "next/link";
import { LoginForm } from "@/components/AuthForm";

export const metadata = { title: "Вход — Лаборатория" };

export default function LoginPage({ searchParams }) {
  const next = searchParams?.next ?? "/profile";
  const authError = searchParams?.error === "auth_callback";

  return (
    <main className="page auth-page">
      <div className="auth-panel">
        <Link href="/" className="meta auth-back">
          ← На главную
        </Link>
        <h1 className="page-heading auth-heading">
          Вход в <span className="accent">лабораторию</span>
        </h1>
        <p className="lead auth-lead">
          Войдите, чтобы видеть свой профиль, сдавать образцы и добавлять реактивы.
        </p>
        {authError && (
          <p className="auth-error">Не удалось подтвердить вход. Попробуйте снова.</p>
        )}
        <LoginForm next={next} />
      </div>
    </main>
  );
}
