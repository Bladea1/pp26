import Link from "next/link";

const THEMES = {
  lime: "theme-lime",
  pink: "theme-pink",
  white: "theme-white",
  dark: "theme-dark",
  hero: "theme-dark"
};

function authorSlug(author) {
  if (!author) return "unknown";
  return author.replace(/\./g, "_");
}

export default function ProjectCard({
  project,
  className = "",
  variant = "poster",
  wide = false
}) {
  const theme = THEMES[project.color] || "theme-dark";
  const v = wide ? "wide" : variant;
  const slug = `от_${authorSlug(project.author)}`;

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`sample-card sample-card--${v} ${theme} ${className}`}
    >
      {project.image && (
        <img className="sample-card-img" src={project.image} alt="" loading="lazy" />
      )}
      <div className="sample-card-shade" aria-hidden />
      {project.stamp && (
        <span className="sample-card-stamp">{project.stamp}</span>
      )}
      <div className="sample-card-content">
        {v === "catalog" && (
          <span className="sample-card-cat">{project.category}</span>
        )}
        <h3 className="sample-card-title">{project.title}</h3>
        {v === "catalog" ? (
          <span className="sample-card-slug">{slug}</span>
        ) : (
          <span className="sample-card-sub">{project.subtitle}</span>
        )}
        <div className="sample-card-foot">
          <span className="sample-card-author">{slug}</span>
          <span className="sample-card-stats">
            <span aria-hidden>♡</span> {project.likes ?? 0}
            <span aria-hidden>◉</span> {project.views ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
