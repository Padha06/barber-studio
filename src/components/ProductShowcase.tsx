"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Eye, Check, X } from "lucide-react";

export interface GroomingProduct {
  id: string;
  number: string;
  name: string;
  category: string;
  price: string;
  volume: string;
  description: string;
  scentNotes: string;
  holdShine: string;
  image: string;
  inStock: boolean;
}

export const PRODUCTS_DATA: GroomingProduct[] = [
  {
    id: "beard-oil-01",
    number: "NO. 01",
    name: "Cedar & Bergamot Beard Oil",
    category: "Beard Care",
    price: "$38",
    volume: "50ml / 1.7 fl oz",
    description:
      "Cold-pressed Moroccan argan oil and golden jojoba infused with Atlas cedarwood, Sicilian bergamot, and smoky vetiver to eliminate beard itch and soften coarse bristles.",
    scentNotes: "Top: Italian Bergamot • Heart: Virginia Cedarwood • Base: Smoky Vetiver & Leather",
    holdShine: "Hold: Light Natural • Shine: Subtle Lustre",
    image: "/sequence/ezgif-frame-240.jpg",
    inStock: true,
  },
  {
    id: "matte-clay-02",
    number: "NO. 02",
    name: "Volcanic Mineral Matte Clay",
    category: "Hair Styling",
    price: "$34",
    volume: "100ml / 3.4 oz",
    description:
      "Formulated with bentonite volcanic earth and beeswax. Delivers extreme pliable all-day texture with zero greasy residue and a strictly matte, natural finish.",
    scentNotes: "Top: Crushed Black Pepper • Heart: Neroli • Base: Ambergris & Dry Wood",
    holdShine: "Hold: Strong Pliable • Shine: 100% Matte",
    image: "/sequence/ezgif-frame-250.jpg",
    inStock: true,
  },
  {
    id: "classic-pomade-03",
    number: "NO. 03",
    name: "Amber Glass Classic Pomade",
    category: "Hair Styling",
    price: "$36",
    volume: "100ml / 3.4 oz",
    description:
      "Water-soluble high-retention pomade engineered for razor-part executive cuts and slick gentleman contours. Rinses out effortlessly with warm water.",
    scentNotes: "Top: Mandarin Zest • Heart: Tonka Bean • Base: Bourbon Vanilla & Tobacco",
    holdShine: "Hold: High Firm • Shine: Controlled Classic Gloss",
    image: "/sequence/ezgif-frame-260.jpg",
    inStock: true,
  },
  {
    id: "beard-balm-04",
    number: "NO. 04",
    name: "Conditioning Shea Beard Balm",
    category: "Beard Care",
    price: "$32",
    volume: "60ml / 2.0 oz",
    description:
      "Dense leave-in conditioning balm with unrefined shea butter, sweet almond oil, and raw beeswax to tame stubborn flyaway whiskers and seal in moisture.",
    scentNotes: "Top: Crisp Cardamom • Heart: Nutmeg • Base: Dark Amber & Sandalwood",
    holdShine: "Hold: Medium Sculpting • Shine: Matte Sateen",
    image: "/sequence/ezgif-frame-270.jpg",
    inStock: true,
  },
  {
    id: "sea-salt-spray-05",
    number: "NO. 05",
    name: "Mineral Sea Salt Texture Mist",
    category: "Hair Prep",
    price: "$28",
    volume: "150ml / 5.1 fl oz",
    description:
      "Infused with natural Atlantic sea kelp extract and magnesium. Adds effortless wind-blown volume, gritty separation, and lightweight thickness before blow-drying.",
    scentNotes: "Top: Coastal Sage • Heart: Sea Kelp • Base: Clean Driftwood",
    holdShine: "Hold: Light Flexible • Shine: Natural Raw",
    image: "/sequence/ezgif-frame-280.jpg",
    inStock: true,
  },
  {
    id: "master-valet-kit-06",
    number: "NO. 06",
    name: "Atelier Master Grooming Valet",
    category: "Signature Collection",
    price: "$145",
    volume: "Complete 5-Piece Boxset",
    description:
      "Presented in an embossed dark walnut valet casket. Includes full sizes of our Beard Oil, Matte Clay, Hand-Carved Carbon Comb, Boar Bristle Brush, and Canvas Dopp Kit.",
    scentNotes: "Curated Master Signature Cologne Blend",
    holdShine: "Universal Professional Barber Grade",
    image: "/sequence/ezgif-frame-300.jpg",
    inStock: true,
  },
];

export default function ProductShowcase() {
  const [selectedProduct, setSelectedProduct] = useState<GroomingProduct | null>(null);
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [reserveSuccess, setReserveSuccess] = useState<string | null>(null);

  const handleReserve = (product: GroomingProduct) => {
    if (!reservedIds.includes(product.id)) {
      setReservedIds((prev) => [...prev, product.id]);
    }
    setReserveSuccess(product.name);
    setTimeout(() => setReserveSuccess(null), 4000);
  };

  return (
    <section id="grooming" className="relative py-24 md:py-32 bg-[#ffffff] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-[#FAF9F7] mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9E7B3A]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#9E7B3A] font-bold">
                APOTHECARY & HOME MAINTENANCE
              </span>
            </div>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.06em] text-[#0F0F0F] uppercase leading-tight"
            >
              THE FINISHING <span className="text-[#9E7B3A]">TOUCH.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-[#6E6962] leading-relaxed mb-3">
              Formulated in small artisan batches in the UK. Every bottle and jar is packaged
              in UV-protective dark amber glass and matte-black tin to preserve active botanicals.
            </p>
            <p className="text-[11px] text-[#9E7B3A] font-mono tracking-wider uppercase font-semibold">
              • In-Studio Pickup Available With Any Appointment
            </p>
          </div>
        </div>

        {/* Reserve Success Alert */}
        {reserveSuccess && (
          <div className="mb-8 p-4 bg-[#FAF9F7] border border-[#9E7B3A] text-[#0F0F0F] flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-[#9E7B3A]" />
              <span className="text-xs tracking-wider">
                Reserved <strong>{reserveSuccess}</strong> for collection during your next chair appointment!
              </span>
            </div>
            <button
              onClick={() => setReserveSuccess(null)}
              className="text-[#6E6962] hover:text-[#0F0F0F]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS_DATA.map((product) => {
            const isReserved = reservedIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="group relative bg-[#FAF9F7] border border-black/10 hover:border-[#9E7B3A] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                {/* Product Image Frame */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#ECE8E1]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Top Product Number Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#0F0F0F] bg-white/90 backdrop-blur-sm px-2.5 py-1 border border-black/10">
                      {product.number}
                    </span>
                  </div>

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 bg-white text-[#0F0F0F] text-[11px] font-bold tracking-[0.15em] uppercase flex items-center gap-2 hover:bg-[#9E7B3A] hover:text-white transition-colors cursor-pointer shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Formula</span>
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-white border-t border-black/5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#6E6962] font-semibold">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-[#6E6962] font-mono">
                        {product.volume}
                      </span>
                    </div>

                    <h3
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-lg sm:text-xl font-bold text-[#0F0F0F] group-hover:text-[#9E7B3A] transition-colors mb-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#6E6962] line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <span
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-xl sm:text-2xl font-bold text-[#0F0F0F]"
                    >
                      {product.price}
                    </span>

                    <button
                      onClick={() => handleReserve(product)}
                      className={`px-4 py-2 text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer ${
                        isReserved
                          ? "bg-[#EBF5EA] border border-[#528F42] text-[#2F6D22]"
                          : "border border-[#0F0F0F] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white"
                      }`}
                    >
                      {isReserved ? "Reserved" : "Reserve In Studio"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-xl w-full bg-white border border-black/10 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#6E6962] hover:text-[#0F0F0F] p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] tracking-[0.25em] text-[#9E7B3A] uppercase font-mono font-bold block mb-1">
              {selectedProduct.number} • {selectedProduct.category}
            </span>
            <h3
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl sm:text-3xl font-bold text-[#0F0F0F] mb-2"
            >
              {selectedProduct.name}
            </h3>
            <div className="text-xl font-bold text-[#9E7B3A] mb-4">
              {selectedProduct.price}{" "}
              <span className="text-xs text-[#6E6962] font-normal font-sans">
                ({selectedProduct.volume})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4A4640] leading-relaxed mb-6">
              {selectedProduct.description}
            </p>

            <div className="space-y-3 bg-[#FAF9F7] p-4 border border-black/5 mb-6 text-xs">
              <div>
                <span className="text-[#9E7B3A] font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                  Fragrance Notes
                </span>
                <span className="text-[#0F0F0F]">{selectedProduct.scentNotes}</span>
              </div>
              <div className="pt-2 border-t border-black/5">
                <span className="text-[#9E7B3A] font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                  Hold & Finish
                </span>
                <span className="text-[#0F0F0F]">{selectedProduct.holdShine}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2.5 text-xs tracking-wider uppercase text-[#6E6962] hover:text-[#0F0F0F]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleReserve(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-6 py-2.5 bg-[#0F0F0F] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#9E7B3A]"
              >
                Reserve For Chair Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
