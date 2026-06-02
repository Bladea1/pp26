import { notFound } from "next/navigation";
import AddReagentForm from "@/components/AddReagentForm";
import { fetchProjectBySlug } from "@/lib/repository";

export async function generateMetadata({ params }) {
  const project = await fetchProjectBySlug(params.id);
  if (!project) return { title: "Реактив" };
  return { title: `Реактив — ${project.title}` };
}

export default async function AddReagentPage({ params }) {
  const project = await fetchProjectBySlug(params.id);
  if (!project) notFound();

  return (
    <main className="page">
      <AddReagentForm project={project} />
    </main>
  );
}
