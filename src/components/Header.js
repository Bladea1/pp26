"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { toast } from "sonner";
import { NAV_LINKS } from "@/lib/constants";
import LabIcon from "@/components/LabIcon";
import SignOutButton from "@/components/SignOutButton";

export default function Header({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const initials = user?.initials ?? user?.username?.slice(0, 2).toUpperCase() ?? "OT";

  function search() {
    if (!q.trim()) {
      toast.message("Введите запрос");
      return;
    }
    window.location.href = `/catalog?q=${encodeURIComponent(q.trim())}`;
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden>
            <LabIcon name="flask" size={24} />
          </span>
          <span className="brand-text">
            Лаборатория
            <br />
            недоделанных проектов
          </span>
        </Link>

        <nav className="site-nav" aria-label="Навигация">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-end">
          <button
            type="button"
            className="icon-btn hide-mobile"
            aria-label="Поиск"
            onClick={() => {
              const term = window.prompt("Поиск по каталогу", q) ?? "";
              if (term.trim()) window.location.href = `/catalog?q=${encodeURIComponent(term.trim())}`;
            }}
          >
            <Search size={20} strokeWidth={1.75} />
          </button>
          <Link href="/projects/new" className="btn btn-sm btn-ghost hide-mobile">
            Сдать образец
          </Link>
          <Link
            href="/projects/gorod-bez-otrazheniy/reagent"
            className="btn btn-sm btn-pink hide-mobile"
          >
            Добавить реактив +
          </Link>
          <button
            type="button"
            className="icon-btn hide-mobile"
            aria-label="Уведомления"
            onClick={() => toast.info("3 новых события в лаборатории")}
          >
            <Bell size={18} strokeWidth={1.75} />
          </button>
          {user ? (
            <Link
              href="/profile"
              className={`profile-chip ${pathname === "/profile" ? "on" : ""}`}
              title={user.displayId ?? user.username ?? "Профиль"}
              aria-label="Профиль"
            >
              <span className="profile-chip-avatar">{initials}</span>
            </Link>
          ) : (
            <Link href="/login" className="btn btn-sm btn-lime hide-mobile">
              Войти
            </Link>
          )}
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label={open ? "Закрыть" : "Меню"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-drawer">
          <div className="container">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            {user ? (
              <Link href="/profile" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Профиль
              </Link>
            ) : (
              <Link href="/login" className="btn btn-lime" onClick={() => setOpen(false)}>
                Войти
              </Link>
            )}
            <Link href="/projects/new" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Сдать образец
            </Link>
            <Link
              href="/projects/gorod-bez-otrazheniy/reagent"
              className="btn btn-pink"
              onClick={() => setOpen(false)}
            >
              Добавить реактив +
            </Link>
            {user?.isAuthenticated && (
              <div onClick={() => setOpen(false)}>
                <SignOutButton className="btn btn-ghost btn-block" />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
