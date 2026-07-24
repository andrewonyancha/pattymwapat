import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import SupportButton from "./components/SupportButton";
import { AuthProvider } from "./components/AuthProvider";

export const metadata: Metadata = {
  title: "Pattywapat Autospares - Quality Auto Parts in Nairobi, Kenya",
  description: "Pattywapat Autospares is your trusted auto parts supplier in Nairobi, Kenya. We offer genuine car parts, accessories, and expert support for all vehicle makes. Fast delivery across Nairobi and nationwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="td0XyrxehBDvua-n4Y1_FgekwvN4xgqEKUz4UOnFXa0" />
      <body
        className="md:mx-4 mx-2 overflow-x-hidden"
      >
        <AuthProvider>
        <Header />
        {children}
        <Footer />
        <ScrollToTopButton />
        <SupportButton />
        </AuthProvider>
      </body>
    </html>
  );
}
