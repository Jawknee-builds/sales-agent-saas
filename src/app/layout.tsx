import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/dashboard/Sidebar"; // Import Client Component
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales Agent SaaS",
  description: "AI-Powered Sales Development Representative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
