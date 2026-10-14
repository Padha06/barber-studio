"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TopLandingScrollytelling from "@/components/TopLandingScrollytelling";
import LuxuryCursor from "@/components/LuxuryCursor";
import CraftHorizontalSection from "@/components/CraftHorizontalSection";
import RoyalSignatureTreatment from "@/components/RoyalSignatureTreatment";
import ServicesSection from "@/components/ServicesSection";
import ClientsAndWordMarquee from "@/components/ClientsAndWordMarquee";
import StudioExperience from "@/components/StudioExperience";
import ProductShowcase from "@/components/ProductShowcase";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("signature-haircut");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToSection("booking");
  };

  return (
    <main className="min-h-screen bg-white text-[#0F0F0F] selection:bg-[#9E7B3A] selection:text-white relative">
      {/* Film Grain Atmosphere */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Magnetic Responsive Custom Luxury Cursor (Desktop) */}
      <LuxuryCursor />

      {/* 1. Sticky Luxury Navigation */}
      <Navbar onOpenBooking={() => scrollToSection("booking")} />

      {/* 2. Top Landing Page Scrollytelling Video (337 Frames Desktop / 170 Frames Mobile) */}
      <TopLandingScrollytelling
        onBookChair={() => scrollToSection("booking")}
        onExploreServices={() => scrollToSection("services")}
      />

      {/* 3. Pinned Horizontal Craft Reel: The 4 Core Disciplines */}
      <CraftHorizontalSection
        onSelectCraft={(category) => {
          scrollToSection("services");
        }}
      />

      {/* 4. The Royal Crown & Beard Sanctuary Ritual (High-Converting Spotlight) */}
      <RoyalSignatureTreatment
        onReserve={() => {
          setSelectedServiceId("fade-beard-ritual");
          scrollToSection("booking");
        }}
      />

      {/* 5. Bespoke Editorial Services */}
      <ServicesSection onSelectService={handleSelectService} />

      {/* 6. Dual-Direction Client & Discipline Marquee */}
      <ClientsAndWordMarquee />

      {/* 7. Atelier Atmosphere & Studio Sanctuary */}
      <StudioExperience />

      {/* 8. Apothecary Grooming Collection */}
      <ProductShowcase />

      {/* 9. Appointment Reservation Engine */}
      <BookingSection
        selectedServiceId={selectedServiceId}
        onSelectServiceId={(id) => setSelectedServiceId(id)}
      />

      {/* 10. Minimal Clean Luxury Footer */}
      <Footer />
    </main>
  );
}

