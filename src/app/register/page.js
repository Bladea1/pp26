import Link from "next/link";
import { RegisterForm } from "@/components/AuthForm";

export const metadata = { title: "Регистрация — Лаборатория" };

export default function RegisterPage({ searchParams }) {
  const next = searchParams?.next ?? "/profile";

  return (
    <main className="page auth-page">
      <div className="auth-panel">
        <Link href="/" className="meta auth-back">
          ← На главную
        </Link>
        <h1 className="page-heading auth-heading">
          Регистрация в <span className="accent">лаборатории</span>
        </h1>
        <p className="lead auth-lead">
          Создайте аккаунт исследователя. После входа откроются профиль и сдача образцов.
        </p>
        <RegisterForm next={next} />
      </div>
    </main>
  );
}
