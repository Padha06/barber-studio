"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Download,
} from "lucide-react";
import { SERVICES_DATA, ServiceItem } from "./ServicesSection";

interface BarberSpecialist {
  id: string;
  name: string;
  title: string;
  experience: string;
}

const BARBERS: BarberSpecialist[] = [
  {
    id: "any",
    name: "First Available Artisan",
    title: "Guild Master Barber",
    experience: "Immediate Priority",
  },
  {
    id: "marcus",
    name: "Marcus Vance",
    title: "Master Barber & Atelier Director",
    experience: "14 Years Exp • Precision Cut",
  },
  {
    id: "julian",
    name: "Julian Croft",
    title: "Senior Skin Fade Specialist",
    experience: "10 Years Exp • Razor Detailing",
  },
  {
    id: "dominic",
    name: "Dominic Ross",
    title: "Bespoke Beard & Shave Artisan",
    experience: "8 Years Exp • Hot Towel Master",
  },
];

const TIME_SLOTS = [
  { time: "09:30 AM", period: "Morning" },
  { time: "10:30 AM", period: "Morning" },
  { time: "11:30 AM", period: "Morning" },
  { time: "01:00 PM", period: "Afternoon" },
  { time: "02:00 PM", period: "Afternoon" },
  { time: "03:30 PM", period: "Afternoon" },
  { time: "04:30 PM", period: "Afternoon" },
  { time: "05:30 PM", period: "Evening" },
  { time: "06:30 PM", period: "Evening" },
  { time: "07:15 PM", period: "Evening" },
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
  const [selectedTime, setSelectedTime] = useState("11:30 AM");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    service: ServiceItem;
    barber: BarberSpecialist;
    date: string;
    time: string;
    name: string;
  } | null>(null);

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
    BARBERS.find((b) => b.id === selectedBarberId) || BARBERS[0];

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!clientName.trim()) errors.name = "Please provide your full name";
    if (!clientEmail.trim() || !clientEmail.includes("@"))
      errors.email = "Please enter a valid email address";
    if (!clientPhone.trim() || clientPhone.length < 7)
      errors.phone = "Please provide a valid phone number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ref = "GR-" + Math.floor(100000 + Math.random() * 900000);
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
          colors: ["#9E7B3A", "#B89552", "#0F0F0F", "#ECE8E1"],
        });
      } catch {
        // Safe fallback
      }
    }, 700);
  };

  const downloadCalendarFile = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Gentlemen's Room//Booking//EN
BEGIN:VEVENT
SUMMARY:Appointment: ${confirmedBooking.service.title} - The Gentlemen's Room
DESCRIPTION:Artisan service with ${confirmedBooking.barber.name}. Reference: ${confirmedBooking.reference}
LOCATION:The Gentlemen's Room Atelier, 142 Savile Row, Mayfair, London
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${confirmedBooking.reference}-appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="booking" className="relative py-24 md:py-32 bg-[#FAF9F7] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9E7B3A]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9E7B3A] font-bold">
              RESERVE YOUR APPOINTMENT
            </span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.06em] text-[#0F0F0F] uppercase leading-tight mb-4"
          >
            YOUR CHAIR IS <span className="text-[#9E7B3A]">WAITING.</span>
          </h2>

          <p
            style={{ fontFamily: "var(--font-serif)" }}
            className="text-base sm:text-xl text-[#9E7B3A] italic mb-3 font-medium"
          >
            “Make time for yourself. Leave looking your best.”
          </p>

          <p className="text-xs sm:text-sm text-[#6E6962] max-w-lg mx-auto leading-relaxed">
            Select your signature service, preferred barber craftsman, and time.
            We look forward to welcoming you to the studio.
          </p>
        </div>

        {/* Confirmation Modal */}
        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto bg-white border border-[#9E7B3A] p-8 md:p-12 shadow-xl relative animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F7] border border-[#9E7B3A] mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#9E7B3A]" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-[#9E7B3A] font-mono font-bold block mb-2">
              APPOINTMENT CONFIRMED • REF #{confirmedBooking.reference}
            </span>

            <h3
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl sm:text-4xl font-bold text-[#0F0F0F] mb-4"
            >
              We Look Forward To Welcoming You, {confirmedBooking.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#6E6962] max-w-md mx-auto mb-8">
              A detailed confirmation email and SMS reminder have been dispatched. Your chair and refreshments are reserved.
            </p>

            <div className="bg-[#FAF9F7] border border-black/10 p-6 text-left space-y-3.5 mb-8 text-xs">
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#6E6962] uppercase tracking-wider font-semibold">Service</span>
                <span className="text-[#0F0F0F] font-bold">{confirmedBooking.service.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#6E6962] uppercase tracking-wider font-semibold">Master Barber</span>
                <span className="text-[#9E7B3A] font-bold">{confirmedBooking.barber.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#6E6962] uppercase tracking-wider font-semibold">Date & Time</span>
                <span className="text-[#0F0F0F] font-mono">
                  {confirmedBooking.date} at {confirmedBooking.time}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-2.5">
                <span className="text-[#6E6962] uppercase tracking-wider font-semibold">Duration</span>
                <span className="text-[#0F0F0F]">{confirmedBooking.service.duration}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[#6E6962] uppercase tracking-wider font-bold">Total Due In Studio</span>
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
                className="w-full sm:w-auto px-6 py-3.5 bg-[#0F0F0F] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#9E7B3A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Add To Calendar (.ics)</span>
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-black/20 text-[#0F0F0F] hover:bg-[#FAF9F7] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
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
              <div className="bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F0F0F] uppercase tracking-wider"
                  >
                    Select Grooming Service
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES_DATA.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setActiveServiceId(srv.id);
                        if (onSelectServiceId) onSelectServiceId(srv.id);
                      }}
                      className={`p-4 text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        activeServiceId === srv.id
                          ? "bg-[#FAF9F7] border-[#9E7B3A] shadow-xs"
                          : "bg-white border-black/10 hover:border-black/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-[#0F0F0F]">
                          {srv.title}
                        </span>
                        <span
                          style={{ fontFamily: "var(--font-serif)" }}
                          className="text-sm font-bold text-[#9E7B3A]"
                        >
                          {srv.price}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6E6962] font-mono">
                        {srv.duration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Barber */}
              <div className="bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F0F0F] uppercase tracking-wider"
                  >
                    Choose Preferred Barber
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BARBERS.map((barber) => (
                    <button
                      key={barber.id}
                      type="button"
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`p-4 text-left border transition-all duration-300 cursor-pointer ${
                        selectedBarberId === barber.id
                          ? "bg-[#FAF9F7] border-[#9E7B3A] shadow-xs"
                          : "bg-white border-black/10 hover:border-black/30"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#0F0F0F] mb-1">
                        {barber.name}
                      </div>
                      <div className="text-[11px] text-[#9E7B3A] font-semibold mb-0.5">
                        {barber.title}
                      </div>
                      <div className="text-[10px] text-[#6E6962] font-mono">
                        {barber.experience}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Date & Time */}
              <div className="bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F0F0F] uppercase tracking-wider"
                  >
                    Select Date & Time
                  </h3>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6E6962] block mb-3 font-mono font-semibold">
                    Available Dates (Next 10 Days)
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((d, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDateIndex(idx)}
                        className={`flex flex-col items-center justify-center min-w-[72px] p-3 border transition-all duration-200 cursor-pointer ${
                          selectedDateIndex === idx
                            ? "bg-[#0F0F0F] text-white border-[#0F0F0F] font-bold shadow-xs"
                            : "bg-[#FAF9F7] text-[#4A4640] border-black/10 hover:border-black/30"
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
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6E6962] block mb-3 font-mono font-semibold">
                    Available Chair Time Slots
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 px-3 text-center text-xs border font-mono transition-all duration-200 cursor-pointer ${
                          selectedTime === slot.time
                            ? "bg-[#9E7B3A] text-white border-[#9E7B3A] font-bold"
                            : "bg-[#FAF9F7] text-[#0F0F0F] border-black/10 hover:border-black/30"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 4: Client Info */}
              <div className="bg-white border border-black/10 p-6 md:p-8 shadow-2xs">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3
                    style={{ fontFamily: "var(--font-serif)" }}
                    className="text-lg sm:text-xl font-bold text-[#0F0F0F] uppercase tracking-wider"
                  >
                    Your Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-[#6E6962] font-semibold block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander Hayes"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full bg-[#FAF9F7] border px-4 py-3 text-xs text-[#0F0F0F] focus:outline-none focus:border-[#9E7B3A] ${
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
                    <label className="text-[10px] tracking-[0.15em] uppercase text-[#6E6962] font-semibold block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 7911 123456"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className={`w-full bg-[#FAF9F7] border px-4 py-3 text-xs text-[#0F0F0F] focus:outline-none focus:border-[#9E7B3A] ${
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
                  <label className="text-[10px] tracking-[0.15em] uppercase text-[#6E6962] font-semibold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="alexander@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className={`w-full bg-[#FAF9F7] border px-4 py-3 text-xs text-[#0F0F0F] focus:outline-none focus:border-[#9E7B3A] ${
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
                  <label className="text-[10px] tracking-[0.15em] uppercase text-[#6E6962] font-semibold block mb-1">
                    Special Notes or Preferred Beverage
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Skin sensitivity, espresso preference, or wedding event prep..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full bg-[#FAF9F7] border border-black/10 px-4 py-3 text-xs text-[#0F0F0F] focus:outline-none focus:border-[#9E7B3A]"
                  />
                </div>
              </div>
            </div>

            {/* Summary Sticky Panel */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-white border border-black/10 p-6 md:p-8 shadow-md relative">
                <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#9E7B3A] font-mono font-bold block">
                      APPOINTMENT SUMMARY
                    </span>
                    <h4
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-xl font-bold text-[#0F0F0F]"
                    >
                      The Gentlemen&apos;s Room
                    </h4>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#9E7B3A]" />
                </div>

                <div className="space-y-4 mb-8 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6962]">Selected Service:</span>
                    <span className="text-[#0F0F0F] font-bold text-right">
                      {selectedService.title}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6962]">Artisan Barber:</span>
                    <span className="text-[#9E7B3A] font-bold text-right">
                      {selectedBarber.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6962]">Date:</span>
                    <span className="text-[#0F0F0F] text-right font-mono">
                      {dates[selectedDateIndex].full}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6962]">Time:</span>
                    <span className="text-[#0F0F0F] text-right font-mono">
                      {selectedTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6962]">Session Duration:</span>
                    <span className="text-[#0F0F0F] text-right font-mono">
                      {selectedService.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-black/10">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#0F0F0F]">
                      Total Due In Studio:
                    </span>
                    <span
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-3xl font-bold text-[#9E7B3A]"
                    >
                      {selectedService.price}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF9F7] p-4 border border-black/5 space-y-2 mb-8 text-[11px] text-[#6E6962]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#9E7B3A] flex-shrink-0" />
                    <span>142 Savile Row, Mayfair, London W1S 3PW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7B3A] flex-shrink-0" />
                    <span>No advance deposit required. Pay in chair after service.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E7B3A] flex-shrink-0" />
                    <span>Complimentary single-malt whisky or espresso included.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0F0F0F] text-white font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#9E7B3A] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Your Chair...</span>
                  ) : (
                    <span>Request Appointment</span>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#6E6962] mt-3">
                  Instant email confirmation with automated calendar invite
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
