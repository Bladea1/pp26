"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email.trim()) return toast.error("Введите email");
    toast.success("Спасибо! Мы сохранили ваш email для рассылки журнала.");
    setEmail("");
  }

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="brand" style={{ marginBottom: 12 }}>
            <span className="brand-mark">⚗</span>
            <span className="brand-text">
              Лаборатория
              <br />
              недоделанных проектов
            </span>
          </div>
          <p>Площадка для сырых идей и смелых экспериментов.</p>
        </div>
        <div>
          <h4>Платформа</h4>
          <Link href="/about">О лаборатории</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/mutations">Мутации</Link>
          <Link href="/journal">Журнал</Link>
        </div>
        <div>
          <h4>Сообщество</h4>
          <Link href="/community">Участники</Link>
          <Link href="/profile">Профиль</Link>
          <Link href="/catalog">Рейтинг</Link>
          <Link href="/mutations">События</Link>
        </div>
        <div>
          <h4>Поддержка</h4>
          <Link href="/about#faq">FAQ</Link>
          <Link href="/about#rules">Правила</Link>
          <Link href="/about#feedback">Обратная связь</Link>
        </div>
        <div>
          <h4>Подпишись на лабораторию</h4>
          <form className="newsletter" onSubmit={submit}>
            <input
              type="email"
              placeholder="email@lab.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <button type="submit" aria-label="Подписаться">
              →
            </button>
          </form>
          <div className="socials">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bar">
        <span>© 2026 Лаборатория недоделанных проектов</span>
        <div className="footer-bar-links">
          <Link href="/about#privacy">Политика конфиденциальности</Link>
          <Link href="/about#terms">Условия использования</Link>
        </div>
      </div>
    </footer>
  );
}
