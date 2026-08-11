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
      "Cervejas, drinks, doses, porções e jogos no cardápio digital do Boteco do Zé.",
    icons: {
      icon: [
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      title: "Boteco do Zé",
      description: "Cerveja gelada, porções e diversão no Boteco do Zé.",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: new URL("/logo-boteco-do-ze.png", metadataBase),
          width: 1536,
          height: 1024,
          alt: "Logo do Boteco do Zé em uma placa de madeira com detalhes dourados",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Boteco do Zé",
      description: "Cerveja gelada, porções e diversão no Boteco do Zé.",
      images: [new URL("/logo-boteco-do-ze.png", metadataBase)],
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
