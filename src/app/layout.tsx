import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "H&S SALON | Luxury Hair • Skin • Makeup • Nails",
  description:
    "Where luxury begins. Welcome to H&S Salon — Nerul's premier destination for precision haircuts, balayage, Keratin & Botox rituals, luxury skin care, bridal makeup, and nail artistry.",
  keywords: [
    "H&S Salon",
    "salonhns",
    "Luxury Salon Nerul",
    "Hair Skin Makeup Nails",
    "Precision Haircut",
    "Balayage Navi Mumbai",
    "Luxury Grooming",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${jakarta.variable} font-sans scroll-smooth`}
    >
      <body className="min-h-screen bg-[#ffffff] text-[#13211B] antialiased selection:bg-[#0E4A35] selection:text-[#F5F1EB]">
        {children}
      </body>
    </html>
  );
}
