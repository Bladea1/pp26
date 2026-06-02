import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import ProgressBar from "@/components/ProgressBar";
import { fetchActivityTicker, fetchLabStats, fetchProjects } from "@/lib/repository";

export default async function HomePage() {
  const [projects, labStats, activityTicker] = await Promise.all([
    fetchProjects(),
    fetchLabStats(),
    fetchActivityTicker()
  ]);

  const fresh = projects.slice(0, 5);
  const unstable = projects
    .filter((p) => ["unstable", "almost"].includes(p.status))
    .sort((a, b) => b.mutation - a.mutation)
    .slice(0, 3);
  const active = projects.find((p) => p.id === "kollektivnyy-shum");
  const bars = [35, 48, 42, 58, 52, 68, 72, 65, 70, 78];

  return (
    <main className="page">
      <section className="home-hero">
        <div className="home-hero-left">
          <h1 className="display-title display-title--home">
            <span>Лаборатория</span>
            <span>недоделанных</span>
            <span className="accent">проектов</span>
          </h1>
          <p className="lead">
            Мы превращаем недоделанные идеи в эксперименты. А эксперименты — в опыт, который
            невозможно спрятать.
          </p>
          <div className="home-hero-actions">
            <Link href="/projects/new" className="btn btn-lime">
              Сдать образец →
            </Link>
            <Link
              href="/projects/gorod-bez-otrazheniy/reagent"
              className="btn btn-pink"
            >
              Добавить реактив +
            </Link>
          </div>
          <div className="pulse-meter">
            <div className="pulse-meter-label">Текущая активность</div>
            <div className="pulse-bars" aria-hidden>
              {bars.map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} className={i < 5 ? "dim" : ""} />
              ))}
            </div>
            <div className="pulse-foot">
              <span>лабораторный пульс</span>
              <strong>{labStats.activityPercent}%</strong>
            </div>
          </div>
          <div className="ticker-wrap">
            <div className="ticker-label">Последняя активность</div>
            <div className="ticker">
              {activityTicker.map((t) => (
                <span key={t}>
                  <b>·</b> {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="home-hero-right">
          <div className="hero-statue" role="img" aria-label="Образец №17 — лаборатория" />
          <aside className="hero-stats-panel">
            <span className="label">Состояние лаборатории</span>
            <div className="status-pink">{labStats.status}</div>
            <span className="label">Уровень мутации</span>
            <div className="stat-big">{labStats.mutationLevel}%</div>
            <ProgressBar value={labStats.mutationLevel} segmented />
            <span className="label">Открытых реактивов</span>
            <div className="stat-big">{labStats.openReagents}</div>
            <Link href="/mutations" className="link-arrow hero-stats-link">
              Все показатели →
            </Link>
          </aside>
          <div className="hero-sample-bag" role="img" aria-label="Сырой потенциал" />
        </div>
      </section>

      <div className="container">
        <div className="section-row">
          <h2>Свежие образцы</h2>
          <Link href="/catalog" className="link-arrow">
            Смотреть все →
          </Link>
        </div>
      </div>
      <div className="cards-strip">
        {fresh.map((p) => (
          <ProjectCard key={p.id} project={p} variant="poster" />
        ))}
      </div>

      <div className="home-triple">
        <div className="cell">
          <div className="section-row section-row-compact">
            <h2>Самые нестабильные</h2>
            <Link href="/catalog?status=unstable" className="link-arrow">
              Все →
            </Link>
          </div>
          <ul className="rank-list">
            {unstable.map((p, i) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`}>
                  <span className="rank-num">0{i + 1}</span>
                  <span>
                    <span className="rank-title">{p.title}</span>
                    <span className="meta">автор / {p.author}</span>
                  </span>
                  <span className="rank-pct">{p.mutation}%</span>
                  <span className="spark" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flower-block" aria-hidden />
        <div className="cell mutation-feature">
          <div className="section-row section-row-compact">
            <h2>Активные мутации</h2>
          </div>
          {active && (
            <div className="mutation-feature-card">
              <div
                className="mutation-feature-img"
                style={{ backgroundImage: `url(${active.image})` }}
              />
              <div className="mutation-feature-body">
                <span className="meta">Коллективная мутация</span>
                <h3>{active.title}</h3>
                <p className="meta">{active.subtitle}</p>
                <div className="mutation-feature-meta">
                  <span className="label">участников</span>
                  <div className="stat-big" style={{ fontSize: 28 }}>
                    {active.participants ?? 17}
                  </div>
                  <p className="live-dot">Идёт реакция</p>
                </div>
                <Link
                  href={`/projects/${active.id}`}
                  className="btn btn-white btn-block"
                  style={{ marginTop: 16 }}
                >
                  Присоединиться →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
