import JournalView from "@/components/JournalView";
import { fetchJournalPosts } from "@/lib/repository";

export const metadata = { title: "Журнал — Лаборатория" };

export default async function JournalPage() {
  const posts = await fetchJournalPosts();

  return (
    <main className="page">
      <JournalView posts={posts} />
    </main>
  );
}
