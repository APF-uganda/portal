import { useState, useCallback } from "react";
import "../../assets/css/membership/benefits.css";

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
    id: "benefit-1",
    title: "Professional Recognition",
    description:
      "Be part of a recognized professional forum that promotes accountability, standards, and credibility in accounting practice.",
    image: image1,
  },
  {
    id: "benefit-2",
    title: "Networking & Collaboration",
    description:
      "Connect with fellow practitioners, attend events, and collaborate across the profession.",
    image: image2,
  },
  {
    id: "benefit-3",
    title: "Access to Resources & Knowledge",
    description:
      "Gain access to guidelines, tools, CPD resources, and professional updates.",
    image: image3,
  },
  {
    id: "benefit-4", 
    title: "Access to Resources & Knowledge",
    description:
      "Gain access to guidelines, tools, CPD resources, and professional updates.",
    image: image4,
  },
];

const CARD_WIDTH = 320;
const CARD_GAP = 32;
const VISIBLE_CARDS = 3;

export function Benefits(): JSX.Element {
  const maxIndex = Math.max(0, benefits.length - VISIBLE_CARDS);
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, maxIndex));
  }, [maxIndex]);

  return (
    <section className="section light" aria-label="Benefits of joining APF Uganda">
      <h2 className="center">Benefits of Joining APF Uganda</h2>

      <div className="carousel-wrapper">
        <button
          className="carousel-arrow left"
          onClick={prev}
           style={{ display: index === 0 ? 'none' : 'flex' }}
          // disabled={index === 0}
          aria-label="Previous benefits"
        >
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path d="M7.5 1 L3 6 L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
        <div className="carousel-container">
            <div className="carousel-viewport" role="region" aria-roledescription="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * (CARD_WIDTH + CARD_GAP)}px)`,
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {benefits.map((benefit) => (
              <div key={benefit.id} className="benefit-item">
                <div className="benefit-image">
                  <img src={benefit.image} alt={benefit.title} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-arrow right"
          onClick={next}
          style={{ display: index >= maxIndex ? 'none' : 'flex' }}
          // disabled={index >= maxIndex}
          aria-label="Next benefits"
        >
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.5 1 L9 6 L4.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
        </div>
      
      </div>
    </section>
  );
}