import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from "@/context/NotificationContext";

import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeSchool — Every student deserves a safe place to learn",
  description:
    "SafeSchool provides a secure, confidential environment for reporting bullying, harassment, and violence. We ensure your voice is heard while protecting your identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${geistSans.variable} antialiased font-sans bg-white text-slate-900 min-h-screen flex flex-col`}>
        <AuthProvider>
          <NotificationProvider>
            <Toaster position="top-right" reverseOrder={false} />
           
              {children}
            
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
