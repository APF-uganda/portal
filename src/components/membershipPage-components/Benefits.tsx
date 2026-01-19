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

const CARD_WIDTH = 320;
const CARD_GAP = 32;
const VISIBLE_CARDS = 3;

 function Benefits(): JSX.Element {
  const maxIndex = Math.max(0, benefits.length - VISIBLE_CARDS);
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
      <h2 className="text-center text-2xl font-bold mb-8">
        Benefits of Joining APF Uganda
      </h2>

      {/* CAROUSEL WRAPPER */}
      <div className="relative flex items-center justify-center">
        {/* LEFT ARROW */}
        <button
          onClick={prev}
          aria-label="Previous"
          className={`absolute left-[70px] top-1/2 -translate-y-1/2 z-10
            w-6 h-6 flex items-center justify-center rounded-full
            bg-white border border-slate-200 shadow
            ${index === 0 ? "opacity-40 cursor-not-allowed" : "opacity-100"}
          `}
        >
          <ChevronLeft className="w-3 h-3 text-slate-500" />
        </button>

        {/* VIEWPORT */}
        <div
          className="overflow-hidden"
          style={{
            width: CARD_WIDTH * 3 + CARD_GAP * 2,
          }}
        >
          {/* TRACK */}
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              gap: `${CARD_GAP}px`,
              transform: `translateX(-${
                index * (CARD_WIDTH + CARD_GAP)
              }px)`,
            }}
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex-shrink-0 bg-white rounded-lg overflow-hidden
                           border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                style={{ width: CARD_WIDTH }}
              >
                {/* IMAGE */}
                <div className="h-[200px] overflow-hidden">
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

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          aria-label="Next"
          className={`absolute right-[70px] top-1/2 -translate-y-1/2 z-10
            w-6 h-6 flex items-center justify-center rounded-full
            bg-white border border-slate-200 shadow
            ${index === maxIndex ? "opacity-40 cursor-not-allowed" : "opacity-100"}
          `}
        >
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </button>
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
