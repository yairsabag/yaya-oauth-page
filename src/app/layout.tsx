import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RegistrationProvider } from '../contexts/RegistrationContext'
import { Suspense } from 'react'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yaya AI - Your WhatsApp Assistant",
  description: "Save your time, text your calendar, todo list, reminders, and more with Yaya AI - your executive assistant in WhatsApp.",
};

// Component wrapper לטיפול ב-Suspense
function RegistrationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationProvider>
        {children}
      </RegistrationProvider>
    </Suspense>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RegistrationWrapper>
          {children}
        </RegistrationWrapper>
      </body>
    </html>
  );
}
