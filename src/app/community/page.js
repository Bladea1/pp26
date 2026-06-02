import Link from "next/link";
import LabIcon from "@/components/LabIcon";
import { fetchUsers, fetchLabStats } from "@/lib/repository";

export const metadata = { title: "Сообщество — Лаборатория" };

export default async function CommunityPage() {
  const [users, stats] = await Promise.all([fetchUsers(), fetchLabStats()]);
  const sorted = [...users].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, 3);

  return (
    <main className="page community-page">
      <section className="community-hero">
        <div className="container community-hero-inner">
          <div>
            <h1 className="page-heading">
              Сообщество <span className="accent">лаборатории</span>
            </h1>
            <p className="lead">
              Участники, ранги и рейтинг мутаций. Здесь видно, кто ведёт эксперименты и кто добавляет реактивы.
            </p>
          </div>
          <div className="community-hero-stats">
            <div className="community-stat-box">
              <LabIcon name="users" size={22} />
              <span className="label">Участников</span>
              <span className="val">{stats.participants}</span>
            </div>
            <div className="community-stat-box">
              <LabIcon name="reagent" size={22} />
              <span className="label">Реактивов</span>
              <span className="val">{stats.reagentsAdded}</span>
            </div>
            <div className="community-stat-box accent-pink">
              <LabIcon name="mutation" size={22} />
              <span className="label">Мутаций</span>
              <span className="val">{stats.activeMutations}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container community-podium-wrap">
        <h2 className="community-section-title">Топ лаборатории</h2>
        <div className="community-podium">
          {top.map((u, i) => (
            <article key={u.id} className={`podium-card place-${i + 1}`}>
              <span className="podium-rank">0{i + 1}</span>
              <span className="podium-avatar">{u.avatar}</span>
              <span className="podium-badge" aria-hidden>
                {u.badge}
              </span>
              <h3>{u.username}</h3>
              <p className="podium-rank-title">{u.rank}</p>
              <div className="podium-score">{u.score}</div>
              <p className="meta">
                {u.experiments} образцов · {u.reagents} реактивов
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="community-layout container">
        <section className="community-main">
          <h2 className="community-section-title">Рейтинг участников</h2>
          <div className="community-table">
            <div className="community-table-head">
              <span>#</span>
              <span>Участник</span>
              <span>Ранг</span>
              <span>Образцы</span>
              <span>Реактивы</span>
              <span>Очки</span>
            </div>
            {sorted.map((u, i) => (
              <Link href="/profile" key={u.id} className="community-table-row">
                <span className="community-rank-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="community-user-cell">
                  <span className="community-avatar-sm">{u.avatar}</span>
                  <span>
                    <b>{u.username}</b>
                    <span className="meta">мутация {u.mutation}%</span>
                  </span>
                </span>
                <span className="community-rank-label">{u.rank}</span>
                <span>{u.experiments}</span>
                <span>{u.reagents}</span>
                <span className="community-score-cell">{u.score}</span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="community-aside">
          <div className="panel panel-pad">
            <LabIcon name="sample" size={28} className="community-aside-icon" />
            <h3>Как попасть в рейтинг</h3>
            <p className="meta" style={{ lineHeight: 1.6, marginTop: 12 }}>
              Сдайте образец, добавьте реактив к чужому проекту или ведите журнал — очки начисляются за
              видимую работу в лаборатории.
            </p>
            <Link href="/projects/new" className="btn btn-lime btn-block" style={{ marginTop: 16 }}>
              Сдать образец →
            </Link>
          </div>
          <div className="panel panel-pad">
            <h3 className="label" style={{ color: "var(--white)" }}>
              Состояние лаборатории
            </h3>
            <p className="status-pink" style={{ fontSize: 16 }}>
              {stats.status}
            </p>
            <p className="meta">Уровень мутации: {stats.mutationLevel}%</p>
            <Link href="/mutations" className="link-arrow" style={{ display: "inline-block", marginTop: 12 }}>
              Активные мутации →
            </Link>
          </div>
          <div className="panel panel-pad">
            <h3 className="label" style={{ color: "var(--white)" }}>
              Новичкам
            </h3>
            <ul className="community-links-list">
              <li>
                <Link href="/about">О лаборатории</Link>
              </li>
              <li>
                <Link href="/catalog">Каталог образцов</Link>
              </li>
              <li>
                <Link href="/journal">Журнал и метод</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
