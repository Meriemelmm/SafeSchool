import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeSchool — Every student deserves a safe place to learn",
  description:
    "SafeSchool provides a secure, confidential environment for reporting bullying, harassment, and violence. We ensure your voice is heard while protecting your identity.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${geistSans.variable} antialiased font-sans bg-white text-slate-900 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">
             {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
