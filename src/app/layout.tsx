import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "devChart",
  description: "A collaborative task manager for clubs",
  manifest: "/manifest.ts",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#000000] text-slate-200 antialiased min-h-screen selection:bg-white/20 selection:text-white`}>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))]"></div>
        {children}
      </body>
    </html>
  );
}
