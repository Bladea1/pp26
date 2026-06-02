import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <h1 className="page-heading">
          Образец <span className="accent">не найден</span>
        </h1>
        <p className="lead" style={{ margin: "24px auto" }}>
          Эксперимент растворился в лабораторном шуме.
        </p>
        <Link href="/catalog" className="btn btn-lime">
          В каталог →
        </Link>
      </div>
    </main>
  );
}
