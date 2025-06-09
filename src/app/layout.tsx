import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth.actions";

const monasans = Mona_Sans({
  variable: "--font-monasans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
    title: "Prepverse",
    description: "Prepverse is a platform for preparing for interviews",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/signin");
  return (
    <html lang="en" className="dark">
      <body
        className={`${monasans.className} antialiased pattern`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
