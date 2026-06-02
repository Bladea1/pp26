"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import LabSelect from "@/components/LabSelect";
import { countByCategory, countByStatus } from "@/lib/projects/utils";
import { CATEGORIES, STATUSES } from "@/lib/constants";

const PAGE_SIZE = 8;
const SORT = [
  { value: "date", label: "По дате / новые" },
  { value: "mutation", label: "По мутации" },
  { value: "likes", label: "По реакциям" }
];

export default function CatalogView({ projects }) {
  const sp = useSearchParams();
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [mutationMin, setMutationMin] = useState(0);
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (sp.get("q")) setQuery(sp.get("q"));
    if (sp.get("status")) setStatus(sp.get("status"));
  }, [sp]);

  const filtered = useMemo(() => {
    let list = projects.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (status === "all" || p.status === status) &&
        p.mutation >= mutationMin &&
        (!query ||
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.author.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.join(" ").toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "mutation") list = [...list].sort((a, b) => b.mutation - a.mutation);
    if (sort === "likes") list = [...list].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return list;
  }, [projects, category, status, query, mutationMin, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE + extra);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  function reset() {
    setCategory("all");
    setStatus("all");
    setQuery("");
    setMutationMin(0);
    setPage(1);
    setExtra(0);
  }

  const chips = [
    category !== "all" && { label: category, clear: () => setCategory("all") },
    status !== "all" && {
      label: STATUSES.find((s) => s.value === status)?.label,
      clear: () => setStatus("all")
    },
    mutationMin > 0 && { label: `Мутация ≥ ${mutationMin}%`, clear: () => setMutationMin(0) }
  ].filter(Boolean);

  return (
    <>
      <section className="catalog-top">
        <div className="catalog-top-text container" style={{ borderRight: "1px solid var(--line)" }}>
          <h1 className="page-heading">
            Каталог <span className="accent">образцов</span>
          </h1>
          <p className="lead">
            Архив экспериментов. Идей в разработке. Не всё, что создаётся, должно быть закончено.
          </p>
          <div className="catalog-search-row">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Поиск образцов, идей, авторов..."
              aria-label="Поиск"
            />
            <button type="button" aria-label="Искать">
              →
            </button>
          </div>
        </div>
        <div className="catalog-top-art" aria-hidden />
      </section>

      <div className="container">
        {(chips.length > 0 || query) && (
          <div className="filter-chips">
            <span className="meta">Активные фильтры:</span>
            {chips.map((c) => (
              <button key={c.label} type="button" className="chip on" onClick={c.clear}>
                {c.label} ×
              </button>
            ))}
            <button type="button" className="chip chip-reset" onClick={reset}>
              Сбросить все
            </button>
          </div>
        )}
      </div>

      <div className="catalog-body">
        <aside className="catalog-sidebar">
          <div className="filter-block">
            <h3>Категории</h3>
            <button
              type="button"
              className={`filter-opt ${category === "all" ? "on" : ""}`}
              onClick={() => setCategory("all")}
            >
              <span>
                <span className="box" />
                Все
              </span>
              <span>{projects.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-opt ${category === c ? "on" : ""}`}
                onClick={() => setCategory(c)}
              >
                <span>
                  <span className="box" />
                  {c}
                </span>
                <span>{countByCategory(c, projects)}</span>
              </button>
            ))}
          </div>
          <div className="filter-block">
            <h3>Статус</h3>
            <button
              type="button"
              className={`filter-opt ${status === "all" ? "on" : ""}`}
              onClick={() => setStatus("all")}
            >
              <span>
                <span className="box" />
                Все
              </span>
              <span>{projects.length}</span>
            </button>
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`filter-opt ${status === s.value ? "on" : ""}`}
                onClick={() => setStatus(s.value)}
              >
                <span>
                  <span className="box" />
                  {s.label}
                </span>
                <span>{countByStatus(s.value, projects)}</span>
              </button>
            ))}
          </div>
          <div className="filter-block">
            <h3>Уровень мутации</h3>
            <input
              type="range"
              min={0}
              max={100}
              value={mutationMin}
              onChange={(e) => setMutationMin(Number(e.target.value))}
              className="range-input"
            />
            <div className="meta" style={{ marginTop: 8, color: "var(--lime)" }}>
              от {mutationMin}%
            </div>
          </div>
        </aside>

        <div>
          <div className="catalog-toolbar">
            <span className="meta">
              Найдено образцов: <strong style={{ color: "var(--white)" }}>{filtered.length}</strong>
            </span>
            <LabSelect value={sort} onChange={setSort} options={SORT} label="Сортировка" />
          </div>
          <div className="catalog-grid">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} variant="catalog" />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="meta panel-pad">Ничего не найдено. Сбросьте фильтры.</p>
          )}
          {visible.length < filtered.length && (
            <div className="load-more-bar">
              <button type="button" className="btn" onClick={() => setExtra((e) => e + PAGE_SIZE)}>
                Загрузить ещё образцов
              </button>
            </div>
          )}
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={page === n ? "on" : ""}
                onClick={() => {
                  setPage(n);
                  setExtra(0);
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
