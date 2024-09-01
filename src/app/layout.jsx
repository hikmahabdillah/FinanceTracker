"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
        {children}
        </SessionProvider>
        <script src="https://kit.fontawesome.com/6a1f5752a8.js" crossOrigin="anonymous" />
      </body>
    </html>
  );
}
