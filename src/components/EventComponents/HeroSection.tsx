import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-full min-h-[50vh] md:min-h-[60vh]" style={{
      backgroundImage: "url('/images/event.webp')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }} />

      {/* Centered Text */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        textAlign: 'center',
        zIndex: 2
      }}>
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-3xl" style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Events
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;