import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Grande Expedição — Jogo Escoteiro",
  description:
    "Jogo educativo escoteiro: conhecimento, aventura, desafio e espírito escoteiro. Escolha sua patrulha e explore 10 territórios!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0b2818] text-emerald-50 antialiased">
        {children}
      </body>
    </html>
  );
}
