import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Altus | Sistema Operativo para Agencias",
  description: "Altus es un sistema operativo cerrado impulsado por IA que te habilita instantáneamente como una agencia de élite. Multi-Workspace, Zero-Latency y AI Studio.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e3a8a'/><text x='50' y='70' font-size='65' font-family='Arial' font-weight='bold' fill='white' text-anchor='middle'>A</text></svg>",
  },
  openGraph: {
    title: "Altus | El motor secreto detrás de las marcas top",
    description: "La ventaja de una agencia top en tus manos. Tú pones los clientes, Altus elimina la fricción.",
    url: "https://altus-systems.com",
    siteName: "Altus",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "Altus Dashboard Preview",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
