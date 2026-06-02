import MutationsView from "@/components/MutationsView";
import { fetchLabStats, fetchProjects } from "@/lib/repository";

export const metadata = { title: "Мутации — Лаборатория" };

export default async function MutationsPage() {
  const [projects, labStats] = await Promise.all([fetchProjects(), fetchLabStats()]);

  return (
    <main className="page">
      <MutationsView projects={projects} labStats={labStats} />
    </main>
  );
}
