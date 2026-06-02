import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { fetchJournalPosts, fetchJournalPost } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const post = await fetchJournalPost(params.slug);
  if (!post) return { title: "Статья не найдена" };
  return {
    title: `${post.title} — Журнал`,
    description: post.excerpt
  };
}

export default async function JournalArticlePage({ params }) {
  const post = await fetchJournalPost(params.slug);
  if (!post) notFound();

  return (
    <main className="page">
      <article className="article-page container">
        <div className="breadcrumb">
          <Link href="/journal">← Журнал</Link> / {post.category}
        </div>
        <div className="article-meta-row meta">
          <span>{post.category}</span>
          <span>{post.read} мин чтения</span>
          <span>{post.date}</span>
          {post.stamp && <span className="stamp-inline">{post.stamp}</span>}
        </div>
        <h1 className="article-title">{post.title}</h1>
        <p className="meta">Автор: {post.author}</p>
        <div
          className="article-cover"
          style={{ backgroundImage: `url(${post.image})` }}
          role="img"
          aria-label=""
        />
        <p className="article-lead">{post.excerpt}</p>
        <div className="panel panel-pad article-content">
          <ArticleBody blocks={post.body} />
        </div>
        <Link className="btn btn-ghost btn-sm" href="/journal" style={{ marginTop: 24 }}>
          ← Все материалы
        </Link>
      </article>
    </main>
  );
}
