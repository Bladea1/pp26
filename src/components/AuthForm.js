"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signInAction, signUpAction } from "@/lib/auth/actions";

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-lime btn-block" disabled={pending}>
      {pending ? "Загрузка…" : label}
    </button>
  );
}

export function LoginForm({ next = "/profile" }) {
  const [state, formAction] = useFormState(signInAction, null);

  return (
    <form action={formAction} className="auth-form">
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="login-password">Пароль</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state?.error && <p className="auth-error">{state.error}</p>}
      {state?.success && <p className="auth-success">{state.success}</p>}
      <SubmitButton label="Войти в лабораторию →" />
      <p className="auth-switch meta">
        Нет аккаунта? <Link href={`/register${next !== "/profile" ? `?next=${encodeURIComponent(next)}` : ""}`}>Зарегистрироваться</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next = "/profile" }) {
  const [state, formAction] = useFormState(signUpAction, null);

  return (
    <form action={formAction} className="auth-form">
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="reg-username">Имя в лаборатории</label>
        <input
          id="reg-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="mara.grid"
          pattern="[a-z0-9._-]{3,32}"
          required
        />
        <p className="field-hint">латиница, цифры, точка — от 3 символов</p>
      </div>
      <div className="field">
        <label htmlFor="reg-email">Email</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="reg-password">Пароль</label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      {state?.error && <p className="auth-error">{state.error}</p>}
      {state?.success && <p className="auth-success">{state.success}</p>}
      <SubmitButton label="Создать аккаунт →" />
      <p className="auth-switch meta">
        Уже есть аккаунт? <Link href={`/login${next !== "/profile" ? `?next=${encodeURIComponent(next)}` : ""}`}>Войти</Link>
      </p>
    </form>
  );
}
