import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import image1 from "../../assets/images/membershipPage-images/image1.webp";
import image2 from "../../assets/images/membershipPage-images/image2.webp";
import image3 from "../../assets/images/membershipPage-images/image3.jpg";
import image4 from "../../assets/images/membershipPage-images/image3.jpg";

interface Benefit {
  id: string;
  title: string;
  description: string;
  image: string;
}

const benefits: Benefit[] = [
  {
    id: "b1",
    title: "Professional Recognition",
    description:
      "Be part of a recognized professional forum that promotes accountability, standards, and credibility in accounting practice.",
    image: image1,
  },
  {
    id: "b2",
    title: "Networking & Collaboration",
    description:
      "Connect with fellow practitioners, attend events, and collaborate across the profession.",
    image: image2,
  },
  {
    id: "b3",
    title: "Access to Resources & Knowledge",
    description:
      "Gain access to guidelines, tools, CPD resources, and professional updates.",
    image: image3,
  },
  {
    id: "b4",
    title: "Professional Development",
    description:
      "Enhance your skills through structured CPD programs and professional learning opportunities.",
    image: image4,
  },
];

// 🔧 Card sizing
const CARD_WIDTH_MOBILE = 260;
const CARD_WIDTH_DESKTOP = 300;
const CARD_GAP = 32;

function Benefits(): JSX.Element {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const visibleCards = isMobile ? 1 : 3;
  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;

  const maxIndex = Math.max(0, benefits.length - visibleCards);
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  return (
    <section className="bg-white py-16">
      {/* TITLE */}
      <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-10">
        Benefits of Joining APF Uganda
      </h2>
       <p className="
          text-sm
          sm:text-base
          text-black
          leading-relaxed
          sm:leading-[2.4]
          max-w-[1050px]
          mx-auto
        ">
          By joining APF Uganda, you will be part of a professional community
          that connects accounting practitioners, supports their growth, and
          represents their interests across Uganda.
        </p>

      {/* CAROUSEL */}
      <div className="flex justify-center">
        <div className="relative">
          {/* LEFT ARROW (outside mask) */}
          <button
            onClick={prev}
            aria-label="Previous"
            className={`absolute
              -left-10
              top-1/2 -translate-y-1/2 z-10
              w-8 h-8 flex items-center justify-center rounded-full
              bg-purple-500
              ${index === 0 ? "opacity-40 cursor-not-allowed" : "opacity-100"}
            `}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          {/* MASK (STRICT VIEWPORT — SHOWS EXACTLY 3 ON DESKTOP) */}
          <div
            className="overflow-hidden"
            style={{
              width:
                cardWidth * visibleCards +
                CARD_GAP * (visibleCards - 1),
            }}
          >
            {/* TRACK */}
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                gap: `${CARD_GAP}px`,
                transform: `translateX(-${
                  index * (cardWidth + CARD_GAP)
                }px)`,
              }}
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-100"
                  style={{ width: cardWidth }}
                >
                  {/* IMAGE */}
                  <div className="h-[180px] sm:h-[200px] overflow-hidden">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ARROW (outside mask) */}
          <button
            onClick={next}
            aria-label="Next"
            className={`absolute
              -right-10
              top-1/2 -translate-y-1/2 z-10
              w-8 h-8 flex items-center justify-center rounded-full
              bg-purple-500
              ${index === maxIndex ? "opacity-40 cursor-not-allowed" : "opacity-100"}
            `}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors
              ${i === index ? "bg-purple-600" : "bg-slate-300"}
            `}
          />
        ))}
      </div>
    </section>
  );
}

export default Benefits;
