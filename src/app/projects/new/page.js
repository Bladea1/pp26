"use client";

import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import OptionGrid from "@/components/OptionGrid";
import FormSubmitButton from "@/components/FormSubmitButton";
import { createProjectAction } from "@/lib/auth/project-actions";
import { CATEGORIES, STATUSES } from "@/lib/constants";

const MISSING = ["Времени", "Ресурсов", "Знаний", "Команды", "Вдохновения", "Другое"];

const STATUS_LABELS = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

export default function NewProjectPage() {
  const fileRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [links, setLinks] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState(STATUSES[0].value);
  const [missing, setMissing] = useState(["Вдохновения"]);
  const [files, setFiles] = useState([]);

  const [state, formAction] = useFormState(createProjectAction, null);

  return (
    <main className="page">
      <div className="container form-layout">
        <form className="form-main" action={formAction}>
          <h1 className="page-heading">
            Сдать <span className="accent">образец</span>
            <span style={{ marginLeft: 12, color: "var(--lime)" }}>☣</span>
          </h1>
          <p className="lead">Незавершённый проект не исчезнет — он мутирует.</p>

          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="missing" value={missing.join("|")} />
          <input type="hidden" name="tags" value={tags} />

          <div className="stepper">
            <span className="on">01 — О проекте</span>
            <span>02 — Детали</span>
            <span>03 — Материалы</span>
            <span>04 — Проверка</span>
          </div>

          <div className="field">
            <label htmlFor="title">Название проекта *</label>
            <input
              id="title"
              name="title"
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="field-hint">{title.length} / 80</div>
          </div>
          <div className="field">
            <label htmlFor="desc">Описание *</label>
            <textarea
              id="desc"
              name="description"
              value={description}
              maxLength={500}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="field-hint">{description.length} / 500</div>
          </div>
          <div className="field">
            <span className="label">Категория *</span>
            <OptionGrid options={CATEGORIES} value={category} onChange={setCategory} />
          </div>
          <div className="field">
            <span className="label">Текущее состояние *</span>
            <OptionGrid
              options={STATUSES.map((s) => s.label)}
              value={STATUS_LABELS[status]}
              onChange={(label) => {
                const found = STATUSES.find((s) => s.label === label);
                if (found) setStatus(found.value);
              }}
            />
          </div>
          <div className="field">
            <span className="label">Чего не хватает *</span>
            <OptionGrid options={MISSING} value={missing} onChange={setMissing} multiple />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label htmlFor="tags">Теги</label>
              <input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="звук, глитч"
              />
              <div className="field-hint">{tags.split(",").filter(Boolean).length} / 10</div>
            </div>
            <div className="field">
              <label htmlFor="links">Ссылки</label>
              <input
                id="links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="https://"
              />
              <div className="field-hint">{links ? 1 : 0} / 3</div>
            </div>
          </div>
          <div className="field">
            <span className="label">Материалы проекта</span>
            <div
              className="upload-box"
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                onChange={(e) =>
                  setFiles([
                    ...files,
                    ...Array.from(e.target.files || []).map((f) => f.name)
                  ])
                }
              />
              ⚗ Перетащите файлы сюда
              <br />
              jpg · png · pdf · mp4 · zip · до 100 MB
              {files.length > 0 && (
                <>
                  <br />
                  <strong>{files.join(", ")}</strong>
                </>
              )}
            </div>
          </div>

          <div className="home-hero-actions">
            <button type="button" className="btn btn-ghost" onClick={() => toast("Черновик сохранён локально")}>
              Сохранить черновик
            </button>
            <FormSubmitButton
              className="btn btn-pink"
              idleLabel="Запустить реакцию →"
              pendingLabel="Создание…"
            />
          </div>
          {state?.error && (
            <p className="form-note" style={{ color: "var(--pink)" }}>
              {state.error}
            </p>
          )}
          <p className="form-note">🔒 Образец сразу появится в каталоге после публикации</p>
        </form>

        <aside className="form-side">
          <span className="label">Предпросмотр образца</span>
          <div className="preview-paper">
            <span className="preview-stamp">ЧЕРНОВИК</span>
            <h2>{title || "Название"}</h2>
            <span style={{ background: "var(--lime)", padding: "6px 10px", fontWeight: 900, fontSize: 10 }}>
              {category}
            </span>
            <p style={{ marginTop: 16, fontSize: 13 }}>{description || "Описание…"}</p>
            <div
              className="preview-img"
              style={{ backgroundImage: "url(/assets/form-preview.jpg)" }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              <span className="tag-chip">{STATUS_LABELS[status]}</span>
              {missing.map((m) => (
                <span className="tag-chip" key={m}>
                  {m}
                </span>
              ))}
            </div>
            <p className="meta live-dot" style={{ marginTop: 16 }}>
              Готов к публикации
            </p>
          </div>
          <div className="next-steps">
            <span className="label" style={{ color: "var(--lime)" }}>
              ☣ Что дальше?
            </span>
            <ol>
              <li>Сдайте образец в лабораторию.</li>
              <li>Участники изучат материал.</li>
              <li>После публикации — в каталоге.</li>
            </ol>
          </div>
          <p className="meta" style={{ marginTop: 16 }}>
            Нужен аккаунт. <Link href="/login?next=/projects/new">Войти</Link>
          </p>
        </aside>
      </div>
    </main>
  );
}
