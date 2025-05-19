import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const monasans = Mona_Sans({
  variable: "--font-monasans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
    title: "Prepverse",
    description: "Prepverse is a platform for preparing for interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monasans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
