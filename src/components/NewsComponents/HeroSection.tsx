import React from "react";

type HeroSectionProps = {
  title?: string;
};

const HeroSection: React.FC<HeroSectionProps> = ({ title = "News and Insights" }) => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-[40vh] flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/images/News/news1.jpg')" }} 
    >
      <div className="absolute inset-0 bg-black/40" />
     
       <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight max-w-4xl [text-shadow:2px_2px_6px_rgba(0,0,0,0.55)]">
            {title}
          </h1>
        </div>
    </section>
  );
};

export default HeroSection;
