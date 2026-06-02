"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import OptionGrid from "@/components/OptionGrid";
import FormSubmitButton from "@/components/FormSubmitButton";
import { createReagentAction } from "@/lib/auth/project-actions";

const TYPES = ["Визуал", "Финал", "Код", "Ветка", "Стабилизация"];

export default function AddReagentForm({ project }) {
  const fileRef = useRef(null);
  const [type, setType] = useState(TYPES[0]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);

  const [state, formAction] = useFormState(createReagentAction, null);

  return (
    <div className="container form-layout">
      <form className="form-main" action={formAction}>
        <input type="hidden" name="projectSlug" value={project.id} />
        <input type="hidden" name="type" value={type} />

        <div className="breadcrumb">
          <Link href={`/projects/${project.id}`}>← {project.title}</Link>
        </div>
        <h1 className="page-heading">
          Добавить <span className="accent">реактив</span>
        </h1>
        <p className="lead">Скачай исходник, измени и загрузи результат.</p>

        <div className="panel panel-pad" style={{ margin: "24px 0" }}>
          <h2 className="label" style={{ color: "var(--white)", marginBottom: 12 }}>
            Исходники проекта
          </h2>
          {project.files?.length ? (
            project.files.map((f) => (
              <div className="row-item" key={f.name}>
                <div>
                  <b>{f.name}</b>
                  <span className="meta">
                    {f.type} / {f.size}
                  </span>
                </div>
                <a href={f.url} download className="btn btn-sm">
                  Скачать
                </a>
              </div>
            ))
          ) : (
            <p className="meta">Исходники пока не прикреплены к образцу.</p>
          )}
        </div>

        <div className="field">
          <span className="label">Тип реактива</span>
          <OptionGrid options={TYPES} value={type} onChange={setType} />
        </div>
        <div className="field">
          <label htmlFor="rname">Название реактива</label>
          <input
            id="rname"
            name="title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Карта запретных зон"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="rbody">Что изменено</label>
          <textarea
            id="rbody"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Опишите изменения"
            required
          />
        </div>
        <div className="field">
          <span className="label">Файлы результата</span>
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
                setFiles([...files, ...Array.from(e.target.files || []).map((f) => f.name)])
              }
            />
            ⚗ Перетащите файлы или нажмите
            <br />
            jpg · png · pdf · zip · mp4
            {files.length > 0 && (
              <>
                <br />
                <strong>{files.join(", ")}</strong>
              </>
            )}
          </div>
        </div>
        {state?.error && (
          <p className="form-note" style={{ color: "var(--pink)" }}>
            {state.error}
          </p>
        )}
        <div className="home-hero-actions">
          <FormSubmitButton
            className="btn btn-pink"
            idleLabel="Запустить мутацию →"
            pendingLabel="Запуск…"
          />
          <Link href={`/projects/${project.id}`} className="btn btn-ghost">
            Назад к образцу
          </Link>
        </div>
      </form>

      <aside className="form-side">
        <div className="preview-paper">
          <span className="preview-stamp">КАНДИДАТ</span>
          <h2>{name || "Новый реактив"}</h2>
          <span className="meta">{type}</span>
          <div className="preview-img" style={{ backgroundImage: `url(${project.image})` }} />
          <p style={{ fontSize: 13 }}>{body || "Описание появится здесь."}</p>
          <p className="meta" style={{ marginTop: 16 }}>
            Проект: {project.title}
          </p>
        </div>
      </aside>
    </div>
  );
}
