'use state'

import type { Metadata } from "next";
import "./globals.css";
import { BoardProvider } from "@/providers/board-provider";

export const metadata: Metadata = {
  title: "Chess Clone",
  description: "Let's play chess!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BoardProvider>
          {children}
        </BoardProvider>
      </body>
    </html>
  );
}
