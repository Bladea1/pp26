import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { fetchProjects } from "@/lib/repository";

export const metadata = { title: "Архив — Лаборатория" };

export default async function ArchivePage() {
  const projects = await fetchProjects();
  const archived = projects.filter((p) => ["almost", "raw"].includes(p.status));

  return (
    <main className="page">
      <div className="container page-intro">
        <h1 className="page-heading">
          Архив <span className="accent">замороженных</span>
        </h1>
        <p className="lead">Образцы, которые ждут нового вмешательства или стабилизации.</p>
      </div>
      <div className="catalog-grid archive-grid">
        {archived.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      <div className="container archive-footer-link">
        <Link href="/catalog" className="link-arrow">
          ← Весь каталог
        </Link>
      </div>
    </main>
  );
}
