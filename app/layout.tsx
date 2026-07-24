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
  title: "Pemafarm - Fresh Vegetables and Fruits Delivered to Your Doorstep",
  description: " Pemafarm is your go-to online store for fresh, organic vegetables and fruits. We source directly from local farmers to ensure quality and freshness. Enjoy convenient home delivery and explore our special offers today!",
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
