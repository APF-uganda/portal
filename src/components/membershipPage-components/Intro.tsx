/**
 * Intro component for the membership page.
 * Displays an introductory section about joining APF Uganda.
 */
function Intro() {
  return (
    <section className="bg-gray-50 py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
          Be part of APF Uganda
        </h2>

        <p className="
          text-sm
          sm:text-base
          text-gray-700
          leading-relaxed
          sm:leading-[2.2]
          max-w-[720px]
          sm:max-w-[820px]
          mx-auto
        ">
          By joining APF Uganda, you will be part of a professional community
          that connects accounting practitioners, supports their growth, and
          represents their interests across Uganda.
        </p>
      </div>
    </section>
  );
}

export default Intro;
