import Link from "next/link";
import { fetchLabStats, fetchPlatformSteps } from "@/lib/repository";

export const metadata = { title: "О лаборатории" };

export default async function AboutPage() {
  const [labStats, platformSteps] = await Promise.all([fetchLabStats(), fetchPlatformSteps()]);
  const principles = [
    ["Открытость", "◉", "Всё, что здесь происходит — общий материал для новых форм."],
    ["Эксперимент", "⚗", "Мы не ждём идеального финала. Мы проверяем гипотезы."],
    ["Хаос и порядок", "☣", "Хаос создаёт варианты, порядок помогает им выжить."],
    ["Сообщество", "▣", "Каждый участник может стать катализатором чужой идеи."]
  ];

  return (
    <main className="page">
      <section className="about-hero">
        <div style={{ padding: "48px clamp(24px, 4vw, 48px)", borderRight: "1px solid var(--line)" }}>
          <h1 className="display-title">
            Манифест
            <br />
            <span className="accent">лаборатории</span>
          </h1>
          <p className="lead">
            Мы собираем то, что мир считает мусором. Черновики, сбои и недоделанные проекты — чтобы
            создавать из этого новое.
          </p>
          <p
            style={{
              display: "inline-block",
              border: "1px solid var(--line)",
              padding: "20px 24px",
              color: "var(--lime)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginTop: 20
            }}
          >
            Недоделано — не значит бесполезно
          </p>
          <div className="home-hero-actions">
            <Link href="/projects/new" className="btn btn-lime">
              Сдать образец →
            </Link>
            <Link href="/catalog" className="btn btn-pink">
              Каталог +
            </Link>
          </div>
        </div>
        <div style={{ position: "relative", minHeight: 480 }}>
          <div
            className="hero-statue"
            style={{
              position: "absolute",
              inset: 24,
              backgroundImage:
                "linear-gradient(90deg,rgba(0,0,0,.3),transparent),url('/assets/about-statue.jpg')"
            }}
          />
          <aside className="hero-stats-panel">
            <span className="label">Наша миссия</span>
            <p style={{ color: "var(--lime)", fontFamily: "var(--display)", fontSize: 22, textTransform: "uppercase" }}>
              Превращаем идеи в эксперименты
            </p>
            <span className="label">Состояние</span>
            <div className="status-pink">{labStats.status}</div>
          </aside>
        </div>
      </section>

      <div className="container">
        <div className="section-row">
          <h2>Как работает платформа</h2>
        </div>
      </div>
      <div className="about-steps">
        {platformSteps.map((s, i) => (
          <article className="about-step" key={s.title}>
            <div className="about-step-img" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="about-step-body">
              <div className="about-step-num">0{i + 1}</div>
              <h3 style={{ fontFamily: "var(--display)", textTransform: "uppercase", margin: "8px 0" }}>
                {s.title}
              </h3>
              <p className="meta">{s.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="container">
        <div className="section-row">
          <h2>Принципы лаборатории</h2>
        </div>
      </div>
      <div className="principles">
        {principles.map(([t, icon, text]) => (
          <div className="principle" key={t}>
            <div style={{ fontSize: 32, color: "var(--lime)", marginBottom: 12 }}>{icon}</div>
            <h3 style={{ fontFamily: "var(--display)", textTransform: "uppercase" }}>{t}</h3>
            <p className="meta" style={{ marginTop: 12, lineHeight: 1.6 }}>
              {text}
            </p>
          </div>
        ))}
      </div>

      <section className="about-cta-banner">
        <div className="about-cta-banner-bg" aria-hidden />
        <div className="about-cta-banner-inner">
          <h2 className="page-heading about-cta-title">
            Стань частью <span className="accent">эксперимента</span>
          </h2>
          <Link href="/projects/new" className="btn btn-pink" style={{ marginTop: 20 }}>
            Присоединиться →
          </Link>
        </div>
      </section>

      <div className="container" style={{ padding: "24px 0" }}>
        <div id="faq" className="panel panel-pad" style={{ marginBottom: 12 }}>
          <h2 className="label" style={{ color: "var(--white)", fontSize: 14 }}>
            FAQ
          </h2>
          <p className="meta" style={{ lineHeight: 1.7, marginTop: 12 }}>
            Лаборатория принимает сырые проекты и реактивы. Supabase подключим на следующем этапе.
          </p>
        </div>
        <div id="rules" className="panel panel-pad" style={{ marginBottom: 12 }}>
          <h2 className="label" style={{ color: "var(--white)", fontSize: 14 }}>
            Правила
          </h2>
          <p className="meta" style={{ lineHeight: 1.7, marginTop: 12 }}>
            Уважайте авторов. Реактивы должны менять проект, а не дублировать его.
          </p>
        </div>
        <div id="feedback" className="panel panel-pad">
          <h2 className="label" style={{ color: "var(--white)", fontSize: 14 }}>
            Обратная связь
          </h2>
          <p className="meta" style={{ marginTop: 12 }}>
            lab@unfinished.projects
          </p>
        </div>
        <div id="privacy" />
        <div id="terms" />
      </div>
    </main>
  );
}
