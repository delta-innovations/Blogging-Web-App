import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NIVOX",
  description: "A sleek, quantum-inspired blog platform built with Next.js",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <AuthProvider>
            <Navbar />
            <main className="container mx-auto p-4">{children}</main>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}