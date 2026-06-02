import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchCurrentUser } from "@/lib/repository";

const fontDisplay = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap"
});

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap"
});

const fontMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap"
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Лаборатория недоделанных проектов",
  description: "Сырые идеи, реактивы, мутации и коллективные эксперименты."
};

export default async function RootLayout({ children }) {
  const user = await fetchCurrentUser();

  return (
    <html
      lang="ru"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body>
        <div className="lab-app">
          <Header user={user} />
          {children}
          <Footer />
        </div>
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
