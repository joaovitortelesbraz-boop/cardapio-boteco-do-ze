import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "Boteco do Zé | Cardápio",
    description:
      "Petiscos caprichados, porções para compartilhar e bebidas sempre geladas.",
    openGraph: {
      title: "Boteco do Zé",
      description: "Sabor de boteco. Jeito de casa.",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: new URL("/og.png", metadataBase),
          width: 1200,
          height: 630,
          alt: "Boteco do Zé — sabor de boteco, jeito de casa",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Boteco do Zé",
      description: "Sabor de boteco. Jeito de casa.",
      images: [new URL("/og.png", metadataBase)],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
