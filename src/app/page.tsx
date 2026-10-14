"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TopLandingScrollytelling from "@/components/TopLandingScrollytelling";
import ServicesSection from "@/components/ServicesSection";
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
    <main className="min-h-screen bg-white text-[#0F0F0F] selection:bg-[#9E7B3A] selection:text-white w-full max-w-[100vw] overflow-x-clip">
      {/* 1. Sticky Luxury Navigation */}
      <Navbar onOpenBooking={() => scrollToSection("booking")} />

      {/* 2. Top Landing Page Scrollytelling Video (337 Frames Desktop / 170 Frames Mobile) */}
      <TopLandingScrollytelling
        onBookChair={() => scrollToSection("booking")}
        onExploreServices={() => scrollToSection("services")}
      />

      {/* 3. Bespoke Editorial Services */}
      <ServicesSection onSelectService={handleSelectService} />

      {/* 4. Appointment Reservation Engine */}
      <BookingSection
        selectedServiceId={selectedServiceId}
        onSelectServiceId={(id) => setSelectedServiceId(id)}
      />

      {/* 5. Minimal Clean Luxury Footer */}
      <Footer />
    </main>
  );
}


