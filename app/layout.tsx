import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArquitectoLegalRD",
  description:
    "Asistencia jurídica digital orientada al marco legal de la República Dominicana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
