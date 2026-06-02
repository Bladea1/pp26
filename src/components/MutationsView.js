"use client";

import Link from "next/link";
import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import { STATUSES } from "@/lib/constants";

export default function MutationsView({ projects, labStats }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [mutationMin, setMutationMin] = useState(0);

  const featured = projects.find((p) => p.id === "kollektivnyy-shum") ?? projects[0];
  const needs = projects.filter((p) => p.help);
  const process = projects.filter((p) => ["reaction", "mutating"].includes(p.status));
  const almost = projects.filter((p) => p.status === "almost");

  const filterList = (list) =>
    list.filter(
      (p) =>
        (statusFilter === "all" || p.status === statusFilter) && p.mutation >= mutationMin
    );

  return (
    <>
      <div className="container page-intro">
        <h1 className="page-heading">
          Активные <span className="accent">мутации</span>
        </h1>
        <p className="lead">Здесь создаётся будущее: недостающее, нестабильное, почти готовое.</p>
      </div>

      <section className="mutations-hero-banner">
        <div className="mutation-banner-img" />
        <div className="mutations-hero-mid">
          <span className="meta">Коллективная мутация</span>
          <h2>{featured?.title}</h2>
          <p className="meta">{featured?.subtitle}</p>
          <p className="quote-lime mutations-hero-quote">
            Мы не исправляем. Мы собираем то, чего ещё нет.
          </p>
        </div>
        <div className="mutations-hero-side">
          <span className="label">Уровень мутации</span>
          <div className="stat-big">{featured?.mutation}%</div>
          <ProgressBar value={featured?.mutation ?? 58} segmented />
          <span className="label">участников</span>
          <div className="stat-big">{featured?.participants ?? 17}</div>
          <p className="live-dot">Идёт реакция</p>
          <Link href={`/projects/${featured?.id}`} className="btn btn-lime btn-sm" style={{ marginTop: 16 }}>
            Вмешаться →
          </Link>
        </div>
      </section>

      <div className="mutations-page">
        <div>
          <div className="mutations-cols">
            <MutationCol title="Требуют реактива" items={filterList(needs)} accent />
            <MutationCol title="В процессе" items={filterList(process)} />
            <MutationCol title="Почти стабильно" items={filterList(almost)} />
          </div>
        </div>
        <aside className="mutations-aside">
          <div className="panel panel-pad">
            <h3 className="label section-label-white">Статистика</h3>
            <div className="lab-stat-row">
              <span>Активные мутации</span>
              <b>{labStats.activeMutations}</b>
            </div>
            <div className="lab-stat-row">
              <span>Участники</span>
              <b>{labStats.participants}</b>
            </div>
            <div className="lab-stat-row">
              <span>Реактивов</span>
              <b>{labStats.reagentsAdded}</b>
            </div>
          </div>
          <div className="panel panel-pad">
            <h3 className="label section-label-white">Фильтры</h3>
            {[{ value: "all", label: "Все" }, ...STATUSES].map((s) => (
              <button
                key={s.value}
                type="button"
                className={`filter-opt ${statusFilter === s.value ? "on" : ""}`}
                onClick={() => setStatusFilter(s.value)}
              >
                <span>
                  <span className="box" />
                  {s.label}
                </span>
              </button>
            ))}
            <input
              type="range"
              min={0}
              max={100}
              value={mutationMin}
              onChange={(e) => setMutationMin(Number(e.target.value))}
              className="range-input"
              style={{ marginTop: 16 }}
            />
            <div className="meta mutation-range-label">от {mutationMin}%</div>
          </div>
          <div className="panel panel-pad panel-pink-hint">
            <p className="meta">Нужен реактив к образцу?</p>
            <Link href="/catalog" className="btn btn-pink btn-block btn-sm" style={{ marginTop: 12 }}>
              Выбрать проект →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

function MutationCol({ title, items, accent }) {
  return (
    <div className="mutations-col">
      <h3 className="mutations-col-title">{title}</h3>
      {items.length === 0 && <p className="meta">Пока пусто</p>}
      {items.map((p) => (
        <Link key={p.id} href={`/projects/${p.id}`} className="mutation-row-card">
          <div>
            <b>{p.title}</b>
            <span className="meta">{p.author}</span>
          </div>
          <span className={accent ? "mutation-pct pink" : "mutation-pct"}>{p.mutation}%</span>
        </Link>
      ))}
    </div>
  );
}
