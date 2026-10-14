"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  MapPin,
  Download,
  PhoneCall,
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "./ServicesSection";

interface SalonSpecialist {
  id: string;
  name: string;
  title: string;
  experience: string;
}

const SPECIALISTS: SalonSpecialist[] = [
  {
    id: "any",
    name: "First Available Senior Stylist",
    title: "H&S Master Team",
    experience: "Priority Chair Assignment",
  },
  {
    id: "arjun",
    name: "Arjun Mehra",
    title: "Creative Hair Director & Fade Master",
    experience: "12 Years Exp • Precision Cuts & Color",
  },
  {
    id: "riya",
    name: "Riya Kapoor",
    title: "Senior Balayage & Keratin Specialist",
    experience: "10 Years Exp • Hair Botox & Couture Color",
  },
  {
    id: "zaid",
    name: "Zaid Khan",
    title: "Master Barber & Beard Architect",
    experience: "9 Years Exp • Skin Fades & Razor Craft",
  },
];

const TIME_SLOTS = [
  { time: "09:30 AM", period: "Morning" },
  { time: "11:00 AM", period: "Morning" },
  { time: "12:30 PM", period: "Afternoon" },
  { time: "02:00 PM", period: "Afternoon" },
  { time: "03:30 PM", period: "Afternoon" },
  { time: "05:00 PM", period: "Evening" },
  { time: "06:30 PM", period: "Evening" },
  { time: "07:30 PM", period: "Evening" },
  { time: "08:30 PM", period: "Evening" },
  { time: "09:15 PM", period: "Evening" },
];

interface BookingSectionProps {
  selectedServiceId?: string;
  onSelectServiceId?: (id: string) => void;
}

export default function BookingSection({
  selectedServiceId = "signature-haircut",
  onSelectServiceId,
}: BookingSectionProps) {
  const [activeServiceId, setActiveServiceId] = useState(selectedServiceId);
  const [selectedBarberId, setSelectedBarberId] = useState("any");
  const [selectedDateIndex, setSelectedDateIndex] = useState(1);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    service: ServiceItem;
    barber: SalonSpecialist;
    date: string;
    time: string;
    name: string;
  } | null>(null);

  // Sync external selectedServiceId when user clicks "Book Service" in ServicesSection
  useEffect(() => {
    if (selectedServiceId) {
      setActiveServiceId(selectedServiceId);
    }
  }, [selectedServiceId]);

  // Deterministic initial dates for SSR/prerender stability
  const [dates, setDates] = useState(() => [
    { full: "Tuesday, October 13", dayName: "Tue", monthName: "Oct", dayNum: 13 },
    { full: "Wednesday, October 14", dayName: "Wed", monthName: "Oct", dayNum: 14 },
    { full: "Thursday, October 15", dayName: "Thu", monthName: "Oct", dayNum: 15 },
    { full: "Friday, October 16", dayName: "Fri", monthName: "Oct", dayNum: 16 },
    { full: "Saturday, October 17", dayName: "Sat", monthName: "Oct", dayNum: 17 },
    { full: "Sunday, October 18", dayName: "Sun", monthName: "Oct", dayNum: 18 },
    { full: "Monday, October 19", dayName: "Mon", monthName: "Oct", dayNum: 19 },
    { full: "Tuesday, October 20", dayName: "Tue", monthName: "Oct", dayNum: 20 },
    { full: "Wednesday, October 21", dayName: "Wed", monthName: "Oct", dayNum: 21 },
    { full: "Thursday, October 22", dayName: "Thu", monthName: "Oct", dayNum: 22 },
  ]);

  useEffect(() => {
    const dynamicDates = Array.from({ length: 10 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return {
        full: d.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        monthName: d.toLocaleDateString("en-US", { month: "short" }),
        dayNum: d.getDate(),
      };
    });
    setDates(dynamicDates);
  }, []);

  const selectedService =
    SERVICES_DATA.find((s) => s.id === activeServiceId) || SERVICES_DATA[0];
  const selectedBarber =
    SPECIALISTS.find((b) => b.id === selectedBarberId) || SPECIALISTS[0];

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!clientName.trim()) errors.name = "Please provide your full name";
    if (!clientEmail.trim() || !clientEmail.includes("@"))
      errors.email = "Please enter a valid email address";
    if (!clientPhone.trim() || clientPhone.length < 7)
      errors.phone = "Please provide a valid mobile number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ref = "HS-" + Math.floor(100000 + Math.random() * 900000);
      setConfirmedBooking({
        reference: ref,
        service: selectedService,
        barber: selectedBarber,
        date: dates[selectedDateIndex].full,
        time: selectedTime,
        name: clientName,
      });
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0E4A35", "#B48A3C", "#EAD39C", "#0F1F18"],
        });
      } catch {
        // Safe fallback
      }
    }, 600);
  };

  const downloadCalendarFile = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//H&S Salon//Booking//EN
BEGIN:VEVENT
SUMMARY:Appointment: ${confirmedBooking.service.title} - H&S Salon
DESCRIPTION:Luxury salon appointment with ${confirmedBooking.barber.name}. Reference: ${confirmedBooking.reference}
LOCATION:H&S Salon, Shop 12 & 13, Sagar Darshan Tower, Sector 18, Nerul West, Navi Mumbai 400706
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${confirmedBooking.reference}-hs-salon.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="booking" className="relative py-24 md:py-32 bg-[#FAF8F4] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B48A3C]/30 bg-white mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0E4A35]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#0E4A35] font-bold">
              RESERVE YOUR APPOINTMENT
            </span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.05em] text-[#0F1F18] uppercase leading-tight mb-4"
          >
            EXPERIENCE THE <span className="text-[#9E7B3A]">H&amp;S STANDARD.</span>
          </h2>

          <p
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-base sm:text-xl text-[#0E4A35] italic mb-3 font-medium"
          >
            “Confidence, redefined. Reserve your private styling station.”
          </p>

          <p className="text-xs sm:text-sm text-[#5F6661] max-w-lg mx-auto leading-relaxed mb-6">
            Select your signature service, preferred specialist, and time slot.
            Open daily from 9:30 AM to 10:00 PM at Nerul West, Navi Mumbai.
          </p>

          {/* H&S Standards Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto text-left sm:text-center">
            <div className="flex sm:flex-col items-center gap-2.5 sm:gap-1.5 p-3 rounded-xl bg-white border border-black/10 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-[#0E4A35]/10 text-[#0E4A35] flex items-center justify-center text-xs font-bold flex-shrink-0">
                ✓
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#0F1F18] block leading-tight">
                  Private Station
                </span>
                <span className="text-[10px] text-[#5F6661]">Zero wait time guarantee</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2.5 sm:gap-1.5 p-3 rounded-xl bg-white border border-black/10 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-[#9E7B3A]/10 text-[#9E7B3A] flex items-center justify-center text-xs font-bold flex-shrink-0">
                ₹
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#0F1F18] block leading-tight">
                  No Advance Deposit
                </span>
                <span className="text-[10px] text-[#5F6661]">Pay at salon after service</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2.5 sm:gap-1.5 p-3 rounded-xl bg-white border border-black/10 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-[#0E4A35]/10 text-[#0E4A35] flex items-center justify-center text-xs font-bold flex-shrink-0">
                ★
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#0F1F18] block leading-tight">
                  Bespoke Consultation
                </span>
                <span className="text-[10px] text-[#5F6661]">Face &amp; crown architecture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto rounded-2xl bg-white border-2 border-[#B48A3C] p-8 md:p-12 shadow-xl relative animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F4] border border-[#0E4A35] mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#0E4A35]" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-[#0E4A35] font-mono font-bold block mb-2">
              APPOINTMENT CONFIRMED • REF #{confirmedBooking.reference}
            </span>

            <h3
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl sm:text-4xl font-bold text-[#0F1F18] mb-4"
            >
              We Look Forward To Welcoming You, {confirmedBooking.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#5F6661] max-w-md mx-auto mb-8">
              Your styling station at H&amp;S Salon is reserved. A confirmation message has been prepared for your visit.
            </p>

            <div className="rounded-xl bg-[#FAF8F4] border border-black/10 p-6 text-left space-y-3.5 mb-8 text-xs">
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#5F6661] uppercase tracking-wider font-semibold">Service</span>
                <span className="text-[#0F1F18] font-bold">{confirmedBooking.service.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#5F6661] uppercase tracking-wider font-semibold">Specialist</span>
                <span className="text-[#0E4A35] font-bold">{confirmedBooking.barber.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#5F6661] uppercase tracking-wider font-semibold">Date &amp; Time</span>
                <span className="text-[#0F1F18] font-mono">
                  {confirmedBooking.date} at {confirmedBooking.time}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#5F6661] uppercase tracking-wider font-semibold">Duration</span>
                <span className="text-[#0F1F18]">{confirmedBooking.service.duration}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#5F6661] uppercase tracking-wider font-bold">Total Payable At Salon</span>
                <span
                  style={{ fontFamily: "var(--font-serif)" }}
                  className="text-xl font-bold text-[#9E7B3A]"
                >
                  {confirmedBooking.service.price}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={downloadCalendarFile}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0E4A35] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#9E7B3A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Add To Calendar (.ics)</span>
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-transparent border border-black/20 text-[#0F1F18] hover:bg-[#FAF8F4] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          /* Wizard Form */
          <form
            onSubmit={handleBookingSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Service */}
              <div className="rounded-2xl bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0E4A35] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F1F18] uppercase tracking-wider"
                  >
                    Select Signature Service
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES_DATA.map((srv) => {
                    const isSrvSelected = activeServiceId === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setActiveServiceId(srv.id);
                          if (onSelectServiceId) onSelectServiceId(srv.id);
                        }}
                        className={`p-4 rounded-xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                          isSrvSelected
                            ? "bg-[#FAF8F4] border-[#0E4A35] ring-1 ring-[#0E4A35] shadow-sm"
                            : "bg-white border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              isSrvSelected ? "text-[#0E4A35]" : "text-[#0F1F18]"
                            }`}
                          >
                            {srv.title}
                          </span>
                          <span
                            style={{ fontFamily: "var(--font-serif)" }}
                            className="text-sm font-bold text-[#9E7B3A] flex-shrink-0"
                          >
                            {srv.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#5F6661] font-mono">
                          <span>{srv.duration}</span>
                          {isSrvSelected && (
                            <span className="text-[10px] text-[#0E4A35] font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#0E4A35]" /> Selected
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Specialist */}
              <div className="rounded-2xl bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0E4A35] text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F1F18] uppercase tracking-wider"
                  >
                    Choose Preferred Specialist
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SPECIALISTS.map((barber) => {
                    const isSelected = selectedBarberId === barber.id;
                    const avatarLetter =
                      barber.id === "any"
                        ? "★"
                        : barber.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("");
                    return (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarberId(barber.id)}
                        className={`p-4 rounded-xl text-left border transition-all duration-300 cursor-pointer flex items-start gap-3 relative ${
                          isSelected
                            ? "bg-[#FAF8F4] border-[#0E4A35] ring-1 ring-[#0E4A35] shadow-sm"
                            : "bg-white border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#0E4A35] text-[#EAD39C]"
                              : "bg-[#FAF8F4] text-[#0E4A35] border border-black/10"
                          }`}
                        >
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs sm:text-sm font-bold text-[#0F1F18] truncate">
                              {barber.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0E4A35] flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#0E4A35] font-semibold mb-0.5 leading-snug">
                            {barber.title}
                          </div>
                          <div className="text-[10px] text-[#5F6661] font-mono">
                            {barber.experience}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Date & Time */}
              <div className="rounded-2xl bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0E4A35] text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F1F18] uppercase tracking-wider"
                  >
                    Select Date &amp; Time
                  </h3>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#5F6661] block mb-3 font-mono font-semibold">
                    Available Dates (Next 10 Days)
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((d, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDateIndex(idx)}
                        className={`flex flex-col items-center justify-center min-w-[72px] p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          selectedDateIndex === idx
                            ? "bg-[#0E4A35] text-white border-[#0E4A35] font-bold shadow-xs"
                            : "bg-[#FAF8F4] text-[#4A4640] border-black/10 hover:border-black/30"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono tracking-wider">
                          {d.dayName}
                        </span>
                        <span className="text-lg font-bold">{d.dayNum}</span>
                        <span className="text-[10px] uppercase font-mono">
                          {d.monthName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#5F6661] block mb-3 font-mono font-semibold">
                    Available Time Slots (9:30 AM – 10:00 PM)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2.5 px-3 rounded-lg text-center text-xs border font-mono transition-all duration-200 cursor-pointer ${
                          selectedTime === slot.time
                            ? "bg-[#9E7B3A] text-white border-[#9E7B3A] font-bold"
                            : "bg-[#FAF8F4] text-[#0F1F18] border-black/10 hover:border-black/30"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Client Info */}
              <div className="rounded-2xl bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0E4A35] text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F1F18] uppercase tracking-wider"
                  >
                    Your Guest Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-[#5F6661] font-semibold block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rohan Sharma"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full rounded-lg bg-[#FAF8F4] border px-4 py-3 text-xs text-[#0F1F18] focus:outline-none focus:border-[#0E4A35] ${
                        formErrors.name ? "border-red-500" : "border-black/10"
                      }`}
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-red-500 mt-1 block">
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-[#5F6661] font-semibold block mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className={`w-full rounded-lg bg-[#FAF8F4] border px-4 py-3 text-xs text-[#0F1F18] focus:outline-none focus:border-[#0E4A35] ${
                        formErrors.phone ? "border-red-500" : "border-black/10"
                      }`}
                    />
                    {formErrors.phone && (
                      <span className="text-[10px] text-red-500 mt-1 block">
                        {formErrors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[10px] tracking-[0.15em] uppercase text-[#5F6661] font-semibold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="rohan@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className={`w-full rounded-lg bg-[#FAF8F4] border px-4 py-3 text-xs text-[#0F1F18] focus:outline-none focus:border-[#0E4A35] ${
                      formErrors.email ? "border-red-500" : "border-black/10"
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[10px] text-red-500 mt-1 block">
                      {formErrors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-[#5F6661] font-semibold block mb-1">
                    Styling Notes or Preferences
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Skin fade preference, hair color shade, bridal consultation, or coffee preference..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full rounded-lg bg-[#FAF8F4] border border-black/10 px-4 py-3 text-xs text-[#0F1F18] focus:outline-none focus:border-[#0E4A35]"
                  />
                </div>
              </div>
            </div>

            {/* Summary Sticky Panel */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-2xl bg-white border-2 border-[#B48A3C]/35 p-6 md:p-8 shadow-md relative">
                <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#0E4A35] font-mono font-bold block">
                      APPOINTMENT SUMMARY
                    </span>
                    <h4
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-xl font-bold text-[#0F1F18]"
                    >
                      H&amp;S Salon • Nerul West
                    </h4>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#9E7B3A]" />
                </div>

                <div className="space-y-4 mb-8 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6661]">Selected Service:</span>
                    <span className="text-[#0F1F18] font-bold text-right">
                      {selectedService.title}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6661]">Specialist:</span>
                    <span className="text-[#0E4A35] font-bold text-right">
                      {selectedBarber.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6661]">Date:</span>
                    <span className="text-[#0F1F18] text-right font-mono">
                      {dates[selectedDateIndex].full}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6661]">Time:</span>
                    <span className="text-[#0F1F18] text-right font-mono">
                      {selectedTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#5F6661]">Session Duration:</span>
                    <span className="text-[#0F1F18] text-right font-mono">
                      {selectedService.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-black/10">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#0F1F18]">
                      Estimated Total:
                    </span>
                    <span
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-3xl font-bold text-[#9E7B3A]"
                    >
                      {selectedService.price}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FAF8F4] p-4 border border-black/5 space-y-2 mb-8 text-[11px] text-[#5F6661]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0E4A35] flex-shrink-0 mt-0.5" />
                    <span>Shop 12 &amp; 13, Sagar Darshan Tower, Sector 18, Nerul West, Navi Mumbai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-[#0E4A35] flex-shrink-0" />
                    <span>Concierge Direct: +91 91677 79514 / +91 91677 79515</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0E4A35] flex-shrink-0" />
                    <span>No advance deposit required. Pay at salon after service.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#0E4A35] text-white font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#9E7B3A] transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Your Station...</span>
                  ) : (
                    <span>Confirm Appointment</span>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#5F6661] mt-3">
                  Instant confirmation with downloadable calendar invite
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
