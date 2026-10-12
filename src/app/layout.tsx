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
  title: "THE GENTLEMEN'S ROOM | Luxury Barber Studio & Grooming Atelier",
  description:
    "An ultra-premium cinematic grooming sanctuary. Precision cuts, bespoke beard sculpting, and an elevated ritual crafted around you.",
  keywords: [
    "Barbershop",
    "Luxury Grooming",
    "Skin Fade",
    "Gentlemen's Barber",
    "Bespoke Haircut",
    "Hot Towel Shave",
    "Beard Sculpting",
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
      <body className="min-h-screen bg-[#ffffff] text-[#0f0f0f] antialiased selection:bg-[#9e7b3a] selection:text-[#ffffff]">
        {children}
      </body>
    </html>
  );
}
