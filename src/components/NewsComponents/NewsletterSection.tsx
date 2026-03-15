import React from "react";

const NewsletterSection: React.FC = () => {
  return (
    <section className="bg-[#DED2F6] py-8 md:py-12 px-4 md:px-6 lg:px-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4">Never Miss an Update</h2>

        {/* Sentence broken into two lines */}
        <p className="text-sm md:text-base text-gray-700 mb-1 md:mb-2">
          Subscribe to our newsletter for the latest insights,
        </p>
        <p className="text-sm md:text-base text-gray-700 mb-6 md:mb-8">
          policy changes, and events directly in your inbox.
        </p>

        {/* Input + Button - responsive layout */}
        <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white text-gray-800 placeholder-gray-400 flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm md:text-base"
          />
          <button
            type="submit"
            className="bg-[#7944B4] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl hover:bg-purple-700 transition text-sm md:text-base font-medium whitespace-nowrap"
          >
            <span className="hidden sm:inline">Subscribe to Newsletter</span>
            <span className="sm:hidden">Subscribe</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;