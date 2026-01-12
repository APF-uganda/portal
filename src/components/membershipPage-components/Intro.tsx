

import '../../assets/css/membership/intro.css';

/**
 * Intro component for the membership page.
 * Displays an introductory section about joining APF Uganda.
 */
function Intro () {
  return (
    <section className="intro-wrapper">
      <div className="section-intro">
        <h2>Be part of APF Uganda</h2>
        <p>
          By joining APF Uganda, you will be part of a professional community
          that connects accounting practitioners, supports their growth, and represents
          their interests across Uganda.
        </p>
      </div>
    </section>
  );
};

export default Intro;
