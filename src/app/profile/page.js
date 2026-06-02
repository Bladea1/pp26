import Link from "next/link";
import { redirect } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import ProgressBar from "@/components/ProgressBar";
import ActivityChart from "@/components/ActivityChart";
import ProfileActions from "@/components/ProfileActions";
import {
  fetchCurrentUser,
  fetchProfileExtras,
  fetchProjectsByAuthor,
  fetchActivity
} from "@/lib/repository";

export const metadata = { title: "Профиль — Лаборатория" };

export default async function ProfilePage() {
  const currentUser = await fetchCurrentUser();
  if (!currentUser?.isAuthenticated) {
    redirect("/login?next=/profile");
  }

  const [{ profileReactions, favorites, chartStats, badges }, activity, myProjects] =
    await Promise.all([
      fetchProfileExtras(currentUser.id),
      fetchActivity(),
      fetchProjectsByAuthor(currentUser.username)
    ]);

  return (
    <main className="page">
      <section className="profile-banner">
        <div className="profile-avatar">
          <span className="profile-avatar-sticker">
            {"НЕ ТРОГАТЬ\nСЫРОЕ"}
          </span>
        </div>
        <div className="profile-banner-main">
          <div>
            <span className="meta">ID: {currentUser.displayId}</span>
            <h1 className="profile-handle">{currentUser.displayId}</h1>
            <p className="lead" style={{ marginTop: 8 }}>
              {currentUser.bio}
            </p>
            <p className="profile-loc">{currentUser.location}</p>
            <div className="stat-four">
              <div>
                <span className="label">Эксперименты</span>
                <div className="val">{currentUser.experiments}</div>
              </div>
              <div>
                <span className="label">Реакции</span>
                <div className="val">{currentUser.reactions}</div>
              </div>
              <div>
                <span className="label">Сохранённые</span>
                <div className="val">{currentUser.saved}</div>
              </div>
              <div>
                <span className="label">Мутация</span>
                <div className="val">{currentUser.mutationLevel}%</div>
              </div>
            </div>
            <ProfileActions isAuthenticated={currentUser.isAuthenticated} />
          </div>
        </div>
      </section>

      <div className="profile-layout">
        <div className="profile-main">
          <div className="section-row container" style={{ marginTop: 24 }}>
            <h2>Мои образцы</h2>
            <Link href="/catalog" className="link-arrow">
              Смотреть все →
            </Link>
          </div>
          <div className="cards-profile">
            {myProjects.length === 0 ? (
              <p className="container meta">Вы ещё не сдали образец. </p>
            ) : (
              myProjects.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} wide />)
            )}
          </div>

          <div className="section-row container">
            <h2>Мои реакции</h2>
            <Link href="/catalog" className="link-arrow">
              Смотреть все →
            </Link>
          </div>
          <div className="container" style={{ paddingBottom: 24 }}>
            {profileReactions.length === 0 ? (
              <p className="meta">Добавьте реактив к чужому образцу — он появится здесь.</p>
            ) : (
              profileReactions.map((r) => (
                <Link
                  key={r.id}
                  href={`/projects/${r.projectId}`}
                  className="row-item"
                  style={{ gridTemplateColumns: "72px 1fr auto" }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      background: `url(${r.image}) center/cover`,
                      border: "1px solid var(--line)"
                    }}
                  />
                  <div>
                    <b>{r.projectTitle}</b>
                    <p className="meta" style={{ margin: "6px 0 0" }}>
                      {r.text}
                    </p>
                  </div>
                  <span className="meta">{r.time}</span>
                </Link>
              ))
            )}
          </div>

          <div className="section-row container">
            <h2>Лента активности</h2>
          </div>
          <div className="container" style={{ paddingBottom: 32 }}>
            {activity.map((a, i) => (
              <div key={i} className="row-item" style={{ gridTemplateColumns: "40px 1fr" }}>
                <span style={{ fontSize: 22, color: "var(--lime)" }}>{a.icon}</span>
                <span style={{ fontSize: 12 }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="profile-side">
          <div className="panel panel-pad" style={{ marginBottom: 12 }}>
            <h4 className="label" style={{ color: "var(--white)", marginBottom: 12 }}>
              Избранное
            </h4>
            {favorites.map((f) => (
              <div
                key={f.id}
                className="row-item"
                style={{ gridTemplateColumns: "48px 1fr auto", padding: 10 }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: `url(${f.image}) center/cover`
                  }}
                />
                <div>
                  <b style={{ fontSize: 11 }}>{f.title}</b>
                  <span className="meta">от {f.author}</span>
                </div>
                <span className="meta">
                  ♡ {f.likes}
                </span>
              </div>
            ))}
          </div>

          <div className="panel panel-pad" style={{ marginBottom: 12 }}>
            <span className="label">Мой ранг в лаборатории</span>
            <div className="rank-radar">
              <div className="icon">☣</div>
              <div className="rank-title">{currentUser.rank}</div>
            </div>
            <span className="label">Очки мутации</span>
            <div className="stat-big" style={{ fontSize: 28, marginBottom: 8 }}>
              {currentUser.score} / {currentUser.scoreMax}
            </div>
            <ProgressBar value={currentUser.mutationLevel} segmented />
            <Link href="/about" className="link-arrow" style={{ display: "inline-block", marginTop: 12 }}>
              Как повысить уровень →
            </Link>
          </div>

          <div className="panel panel-pad" style={{ marginBottom: 12 }}>
            <span className="label">Мои бейджи</span>
            <div className="badge-grid" style={{ marginTop: 12 }}>
              {badges.map((b, i) => (
                <div key={b.title} className={`badge-item ${i === 0 ? "on" : ""}`}>
                  <div className="ico">{b.icon}</div>
                  <b>{b.title}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="panel panel-pad">
            <span className="label">Ваша статистика</span>
            <ActivityChart
              labels={chartStats.labels}
              reactions={chartStats.reactions}
              views={chartStats.views}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
