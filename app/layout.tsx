import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uply – Smart Resume Builder",
  description:
    "Create stunning resumes instantly using AI-powered templates and smart content suggestions.",
  metadataBase: new URL("https://your-domain.com"), // update later
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Uply – Smart Resume Builder",
    description:
      "Generate professional resumes instantly with AI. Modern templates, ATS-friendly design.",
    type: "website",
    url: "https://your-domain.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Uply Landing Page",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} 
          bg-[#0a0a0a] 
          text-white 
          antialiased 
          min-h-screen
          selection:bg-[#2fabb8]/30 
          selection:text-white
        `}
      >
        {children}
      </body>
    </html>
  );
}
