"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const TABS = ["Все", "Истории", "Метод", "Интервью", "Архив наблюдений"];

export default function JournalView({ posts }) {
  const [tab, setTab] = useState("Все");
  const [email, setEmail] = useState("");
  const featured = posts[0];

  const filtered = useMemo(() => {
    if (tab === "Все") return posts;
    const map = {
      Истории: "История",
      Метод: "Метод",
      Интервью: "Интервью",
      "Архив наблюдений": "Архив наблюдений"
    };
    return posts.filter((p) => p.category === map[tab]);
  }, [posts, tab]);

  return (
    <>
      <section className="journal-hero">
        <div className="journal-hero-text">
          <h1 className="page-heading">
            Журнал <span className="accent">лаборатории</span>
          </h1>
          <p className="lead">Полевые заметки, метод и архив наблюдений — полные материалы для чтения.</p>
        </div>
        {featured && (
          <article className="journal-feature">
            <div
              className="journal-feature-img"
              style={{ backgroundImage: `url(${featured.image})` }}
            />
            <div className="journal-feature-body">
              <span className="meta">
                {featured.category} · {featured.date} · {featured.read} мин
              </span>
              <h2 className="journal-feature-title">{featured.title}</h2>
              <p className="journal-feature-excerpt">{featured.excerpt}</p>
              <p className="meta">от {featured.author}</p>
              <Link href={`/journal/${featured.slug}`} className="link-arrow">
                Читать статью →
              </Link>
              {featured.stamp && <span className="stamp-badge">{featured.stamp}</span>}
            </div>
          </article>
        )}
      </section>

      <div className="journal-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`journal-tab ${tab === t ? "on" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="journal-layout">
        <div>
          <div className="article-grid">
            {filtered.map((post, i) => (
              <Link
                href={`/journal/${post.slug}`}
                key={post.slug}
                className={`article-tile ${i % 2 ? "dark" : "light"}`}
              >
                <div className="article-tile-img" style={{ backgroundImage: `url(${post.image})` }} />
                <span className="meta">
                  {post.category} · {post.read} мин
                </span>
                <h3>{post.title}</h3>
                {post.stamp && (
                  <span className="stamp-badge stamp-badge-sm">{post.stamp}</span>
                )}
                <p className="article-tile-excerpt">{post.excerpt}</p>
                <span className="meta article-tile-author">от {post.author}</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="journal-aside">
          <div className="pink-box">
            <h3>Подписка на журнал</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim()) return toast.error("Укажите email");
                toast.success("Спасибо! Мы сохранили ваш email для рассылки журнала.");
                setEmail("");
              }}
            >
              <input
                type="email"
                placeholder="email@lab.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Подписаться →</button>
            </form>
          </div>
          <div className="panel panel-pad">
            <h3 className="journal-aside-title">Стать автором</h3>
            <p className="meta" style={{ lineHeight: 1.6, marginTop: 8 }}>
              Пришлите черновик наблюдения или методики — редакция лаборатории публикует сырые тексты без
              полировки.
            </p>
            <Link href="/about#feedback" className="link-arrow" style={{ display: "inline-block", marginTop: 12 }}>
              Отправить материал →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
