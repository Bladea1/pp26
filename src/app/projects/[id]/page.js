import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/ProjectDetailView";
import {
  fetchProjectBySlug,
  fetchProjects,
  fetchReagentsForProject,
  fetchObservationsForProject,
  fetchTimelineForProject,
  fetchSimilarProjects
} from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const project = await fetchProjectBySlug(params.id);
  if (!project) return { title: "Образец не найден" };
  return {
    title: `${project.title} — Лаборатория`,
    description: project.description
  };
}

export default async function ProjectPage({ params }) {
  const project = await fetchProjectBySlug(params.id);
  if (!project) notFound();

  const [reagents, observations, timeline, similar] = await Promise.all([
    fetchReagentsForProject(params.id),
    fetchObservationsForProject(params.id),
    fetchTimelineForProject(params.id),
    fetchSimilarProjects(params.id)
  ]);

  return (
    <main className="page">
      <ProjectDetailView
        project={project}
        reagents={reagents}
        observations={observations}
        timeline={timeline}
        similar={similar}
      />
    </main>
  );
}
