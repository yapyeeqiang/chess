import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
