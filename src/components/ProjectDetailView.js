"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Tabs from "@/components/Tabs";
import ProgressBar from "@/components/ProgressBar";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectDetailView({
  project,
  reagents,
  observations,
  timeline = [],
  similar
}) {
  const [tab, setTab] = useState("desc");
  const isMirror = project.id === "gorod-bez-otrazheniy";
  const missing = project.missing ?? [];
  const files = project.files ?? [];

  const tabs = [
    { id: "desc", label: "Описание" },
    { id: "reagents", label: `Реакции ${reagents.length}` },
    { id: "comments", label: `Комментарии ${observations.length}` }
  ];

  return (
    <>
      <section className="project-hero">
        <div className="project-hero-text">
          <div className="breadcrumb">
            <Link href="/catalog">← Назад к каталогу</Link> / эксперимент
          </div>
          <span className="stamp-badge">{project.stamp}</span>
          <h1 className="project-title">{project.title}</h1>
          <div className="project-meta-row">
            <span className="meta">автор / {project.author}</span>
            <span className="meta">{project.date}</span>
            <span className="meta">{project.subtitle}</span>
          </div>
          <p className="lead" style={{ textTransform: "none", maxWidth: "100%" }}>
            {project.description}
          </p>
          <div className="home-hero-actions">
            <Link href={`/projects/${project.id}/reagent`} className="btn btn-lime">
              Добавить реактив +
            </Link>
            <button
              type="button"
              className="btn btn-pink"
              onClick={() => toast.success("Вы отслеживаете мутацию этого образца")}
            >
              Присоединиться →
            </button>
          </div>
          <p className="meta">Уже в лаборатории</p>
          <div className="avatar-pile">
            {["OT", "VW", "AE", "SU"].map((a) => (
              <span key={a}>{a}</span>
            ))}
            <span>+17</span>
          </div>
        </div>

        <div
          className={`project-visual ${isMirror ? "ring" : ""}`}
          style={{ backgroundImage: `url(${project.image})` }}
        >
          {isMirror && (
            <>
              <span className="project-visual-label">
                Отражение — ошибка системы
              </span>
              <span className="project-visual-icon">⊘</span>
            </>
          )}
        </div>

        <aside className="project-side">
          <span className="label">Состояние эксперимента</span>
          <div className="status-pink" style={{ marginBottom: 16 }}>
            {project.stamp}
          </div>
          <span className="label">Уровень мутации</span>
          <div className="stat-big">{project.mutation}%</div>
          <ProgressBar value={project.mutation} segmented />
          <br />
          <span className="label">Открытых реактивов</span>
          <div className="stat-big">{reagents.length + 40}</div>
          <Link href={`/projects/${project.id}/reagent`} className="link-arrow" style={{ display: "inline-block", margin: "16px 0" }}>
            Все реактивы →
          </Link>
          <span className="label">Чего не хватает проекту</span>
          {missing.map((m, i) => (
            <div className="missing-num" key={m}>
              <span>{i + 1}</span>
              <span>{m}</span>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 16 }}>
            Полный список →
          </button>
        </aside>
      </section>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="project-content">
        <div className="panel-pad">
          {tab === "desc" && (
            <>
              <h2 className="label" style={{ color: "var(--white)", fontSize: 12, marginBottom: 12 }}>
                Концепция / история
              </h2>
              <p style={{ color: "#ccc", lineHeight: 1.75 }}>{project.description}</p>
              <Link href="#more" className="link-arrow" style={{ display: "inline-block", margin: "16px 0" }}>
                Читать дальше ↓
              </Link>
              {project.themes && (
                <div style={{ marginTop: 16 }}>
                  {project.themes.map((t) => (
                    <span className="tag-chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {project.quote && <div className="quote-lime">{project.quote}</div>}
              <h2 className="label" style={{ color: "var(--white)", fontSize: 12, marginTop: 24 }}>
                Активность по проекту
              </h2>
              <div className="bar-chart" aria-hidden>
                {[40, 55, 48, 62, 58, 70, 85].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} className={i === 6 ? "hot" : ""} />
                ))}
              </div>
              <div className="section-row" style={{ marginTop: 32 }}>
                <h2>Исходные материалы</h2>
                <Link href={`/projects/${project.id}/reagent`} className="link-arrow">
                  Загрузить реактив →
                </Link>
              </div>
              {files.map((f) => (
                <div className="row-item" key={f.name}>
                  <div>
                    <b>{f.name}</b>
                    <span className="meta">
                      {f.type} / {f.size}
                    </span>
                  </div>
                  <span className="meta">{f.type}</span>
                  <a href={f.url} download className="btn btn-sm">
                    Скачать
                  </a>
                </div>
              ))}
            </>
          )}
          {tab === "reagents" && (
            <>
              <div className="section-row" style={{ marginTop: 0 }}>
                <h2>Реакции участников</h2>
                <Link href={`/projects/${project.id}/reagent`} className="link-arrow">
                  Добавить →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {reagents.map((r) => (
                  <div className="reagent-card" key={r.id}>
                    <div className="reagent-thumb" style={{ backgroundImage: `url(${r.image})` }} />
                    <span className="meta">{r.type}</span>
                    <h3 style={{ fontFamily: "var(--display)", color: "var(--lime)", fontSize: 18, margin: "8px 0" }}>
                      {r.title}
                    </h3>
                    <p style={{ fontSize: 12, color: "#aaa" }}>{r.body}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === "comments" && (
            <>
              {observations.map((o) => (
                <div className="reagent-card" key={o.id}>
                  <b>{o.author}</b>
                  <p style={{ margin: "8px 0 0", color: "#ccc" }}>{o.body}</p>
                </div>
              ))}
              {timeline.map((h) => (
                <div className="row-item" key={h.text} style={{ marginTop: 8 }}>
                  <span>
                    <b>{h.date}</b> — {h.text}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        <aside className="panel-pad">
          <span className="label">Похожие эксперименты</span>
          {similar.map((p) => (
            <div key={p.id} style={{ marginTop: 12 }}>
              <ProjectCard project={p} className="sample-card--compact" />
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
