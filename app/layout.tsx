import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "biolink",
  description: "Deine personalisierte Bio-Link-Seite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
