import { Suspense } from "react";

export default function CatalogLayout({ children }) {
  return <Suspense fallback={<main className="page"><div className="container" style={{ padding: 48 }}>Загрузка каталога…</div></main>}>{children}</Suspense>;
}
