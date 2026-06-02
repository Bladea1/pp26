export default function ArticleBody({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2 key={i} className="article-h2">
              {block.text}
            </h2>
          );
        }
        return (
          <p key={i} className="article-p">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
