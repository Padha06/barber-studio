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
    id: "argan-repair-elixir-01",
    number: "NO. 01",
    name: "Moroccan Argan & Keratin Silk Elixir",
    category: "Hair Ritual",
    price: "₹1,650",
    volume: "100ml / 3.4 fl oz",
    description:
      "Cold-pressed golden argan oil and hydrolyzed keratin proteins that seal split ends, protect against thermal styling up to 230°C, and impart weightless mirror shine.",
    scentNotes: "Top: White Bergamot • Heart: Moroccan Neroli • Base: Warm Amber & Sandalwood",
    holdShine: "Finish: Luminous Glass Shine • Weightless Absorption",
    image: "/frames/frame-198.webp",
    inStock: true,
  },
  {
    id: "matte-sculpt-clay-02",
    number: "NO. 02",
    name: "Artisan Matte Texture Sculpting Clay",
    category: "Styling & Grooming",
    price: "₹1,250",
    volume: "100g / 3.5 oz",
    description:
      "Kaolin mineral clay and natural beeswax engineered for effortless all-day separation, structured volume, and a clean matte finish that washes out in a single rinse.",
    scentNotes: "Top: Crushed Cardamom • Heart: Virginia Cedar • Base: Dry Vetiver",
    holdShine: "Hold: Strong Pliable • Finish: 100% Natural Matte",
    image: "/frames/frame-212.webp",
    inStock: true,
  },
  {
    id: "botox-masque-03",
    number: "NO. 03",
    name: "Collagen & Caviar Deep Repair Masque",
    category: "Wash Lounge Care",
    price: "₹2,400",
    volume: "250ml / 8.4 oz",
    description:
      "Our signature wash-lounge post-color and post-Botox home maintenance masque. Restores lipid barrier integrity and extends salon smoothness for weeks.",
    scentNotes: "Top: Peony Blossom • Heart: White Tea • Base: Cashmere Musk",
    holdShine: "Effect: Intensive Cuticle Reconstruction & Frizz Control",
    image: "/frames/frame-218.webp",
    inStock: true,
  },
  {
    id: "beard-skin-serum-04",
    number: "NO. 04",
    name: "Cedarwood & Jojoba Beard Conditioning Oil",
    category: "Men's Grooming",
    price: "₹1,150",
    volume: "50ml / 1.7 fl oz",
    description:
      "Nutrient-dense botanical blend crafted to soften coarse beard hair, soothe post-razor skin, and leave a refined, subtle masculine finish.",
    scentNotes: "Top: Sicilian Lemon • Heart: Atlas Cedarwood • Base: Ambergris",
    holdShine: "Hold: Light Taming • Finish: Healthy Natural Sheen",
    image: "/frames/frame-224.webp",
    inStock: true,
  },
  {
    id: "sea-salt-volume-05",
    number: "NO. 05",
    name: "Botanical Sea Kelp Volume & Texture Mist",
    category: "Pre-Styling Prep",
    price: "₹1,100",
    volume: "150ml / 5.1 fl oz",
    description:
      "Infused with marine minerals and pro-vitamin B5 to lift roots, add effortless blow-dry body, and shield hair from coastal humidity.",
    scentNotes: "Top: Sea Spray & Sage • Heart: Eucalyptus • Base: Clean Driftwood",
    holdShine: "Hold: Light Flexible • Finish: Airy Textured Volume",
    image: "/frames/frame-232.webp",
    inStock: true,
  },
  {
    id: "hs-signature-kit-06",
    number: "NO. 06",
    name: "The H&S Complete Luxury Care Set",
    category: "Signature Collection",
    price: "₹4,950",
    volume: "Complete 4-Piece Salon Box",
    description:
      "Curated gift and home-ritual box featuring our Sulfate-Free Silk Shampoo, Collagen Masque, Argan Elixir, and Artisan Styling Clay.",
    scentNotes: "H&S Salon Signature Botanical Atelier Blend",
    holdShine: "Professional Salon-Grade Complete Regimen",
    image: "/frames/frame-242.webp",
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B48A3C]/30 bg-[#FAF8F4] mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0E4A35]" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#0E4A35] font-bold">
                THE TOOLS OF EXCELLENCE
              </span>
            </div>
            <h2
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.05em] text-[#0F1F18] uppercase leading-tight"
            >
              CHOSEN WITH <span className="text-[#9E7B3A]">PURPOSE.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-[#5F6661] leading-relaxed mb-3">
              Only the finest formulations and instruments touch your hair and skin at H&amp;S Salon.
              Maintain your salon-fresh finish at home with our curated aftercare collection.
            </p>
            <p className="text-[11px] text-[#0E4A35] font-mono tracking-wider uppercase font-semibold">
              • Reserve Online &amp; Collect During Your Salon Visit
            </p>
          </div>
        </div>

        {/* Reserve Success Alert */}
        {reserveSuccess && (
          <div className="mb-8 p-4 rounded-xl bg-[#FAF8F4] border border-[#0E4A35] text-[#0F1F18] flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-[#0E4A35]" />
              <span className="text-xs tracking-wider">
                Reserved <strong>{reserveSuccess}</strong> for collection at H&amp;S Salon!
              </span>
            </div>
            <button
              onClick={() => setReserveSuccess(null)}
              className="text-[#5F6661] hover:text-[#0F1F18]"
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
                className="group relative rounded-2xl bg-[#FAF8F4] border border-black/10 hover:border-[#0E4A35] transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xs"
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
                    <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#0F1F18] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10">
                      {product.number}
                    </span>
                  </div>

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-5 py-2.5 rounded-full bg-white text-[#0F1F18] text-[11px] font-bold tracking-[0.15em] uppercase flex items-center gap-2 hover:bg-[#0E4A35] hover:text-white transition-colors cursor-pointer shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-white border-t border-black/5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#0E4A35] font-semibold">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-[#5F6661] font-mono">
                        {product.volume}
                      </span>
                    </div>

                    <h3
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-lg sm:text-xl font-bold text-[#0F1F18] group-hover:text-[#0E4A35] transition-colors mb-2"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#5F6661] line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                    <span
                      style={{ fontFamily: "var(--font-serif)" }}
                      className="text-xl sm:text-2xl font-bold text-[#0F1F18]"
                    >
                      {product.price}
                    </span>

                    <button
                      onClick={() => handleReserve(product)}
                      className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer ${
                        isReserved
                          ? "bg-[#EBF5EA] border border-[#0E4A35] text-[#0E4A35]"
                          : "border border-[#0E4A35] text-[#0E4A35] hover:bg-[#0E4A35] hover:text-white"
                      }`}
                    >
                      {isReserved ? "Reserved" : "Reserve In Salon"}
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
          <div className="relative max-w-xl w-full rounded-2xl bg-white border border-black/10 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#5F6661] hover:text-[#0F1F18] p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] tracking-[0.25em] text-[#0E4A35] uppercase font-mono font-bold block mb-1">
              {selectedProduct.number} • {selectedProduct.category}
            </span>
            <h3
              style={{ fontFamily: "var(--font-serif)" }}
              className="text-2xl sm:text-3xl font-bold text-[#0F1F18] mb-2"
            >
              {selectedProduct.name}
            </h3>
            <div className="text-xl font-bold text-[#9E7B3A] mb-4">
              {selectedProduct.price}{" "}
              <span className="text-xs text-[#5F6661] font-normal font-sans">
                ({selectedProduct.volume})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4A4640] leading-relaxed mb-6">
              {selectedProduct.description}
            </p>

            <div className="space-y-3 rounded-xl bg-[#FAF8F4] p-4 border border-black/5 mb-6 text-xs">
              <div>
                <span className="text-[#0E4A35] font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                  Botanical &amp; Fragrance Notes
                </span>
                <span className="text-[#0F1F18]">{selectedProduct.scentNotes}</span>
              </div>
              <div className="pt-2 border-t border-black/5">
                <span className="text-[#0E4A35] font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                  Performance &amp; Finish
                </span>
                <span className="text-[#0F1F18]">{selectedProduct.holdShine}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2.5 text-xs tracking-wider uppercase text-[#5F6661] hover:text-[#0F1F18]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleReserve(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-6 py-2.5 rounded-full bg-[#0E4A35] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#9E7B3A] cursor-pointer"
              >
                Reserve For Salon Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
