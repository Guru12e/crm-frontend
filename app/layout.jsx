import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PiBi - GTM Engine",
  description:
    "A powerful tool for go to market strategies, helping businesses launch and optimize their products effectively. Analyzing market trends and customer feedback is crucial for success.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <SessionWrapper>{children}</SessionWrapper>
        </Suspense>
      </body>
    </html>
  );
}
