import CatalogView from "@/components/CatalogView";
import { fetchProjects } from "@/lib/repository";

export default async function CatalogPage() {
  const projects = await fetchProjects();

  return (
    <main className="page">
      <CatalogView projects={projects} />
    </main>
  );
}
