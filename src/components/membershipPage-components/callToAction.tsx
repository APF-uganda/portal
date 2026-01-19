export default function CallToAction() {
  return (
    <section className="bg-[#f7f3ff] py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* HEADING */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#260B41] mb-4">
          Ready to Advance Your Career?
        </h2>

        {/* DESCRIPTION */}
        <p className="text-base md:text-lg text-[#260B41] max-w-3xl mx-auto mb-8">
          Join APF Uganda today and become part of a vibrant community committed
          to excellence in the accountancy profession. Unlock exclusive
          benefits, expand your network, and shape the future of accountancy.
        </p>

        {/* CTA BUTTON */}
        <button
          className="
            inline-flex items-center justify-center
            px-6 py-3
            bg-purple-700 text-white font-semibold
            rounded-lg
            shadow-md
            transition-all duration-300
            hover:bg-purple-800 hover:-translate-y-0.5
            focus:outline-none focus:ring-2 focus:ring-purple-400
          "
        >
          Join APF Today
        </button>
      </div>
    </section>
  );
}
