import Link from "next/link";

const Banner = () => {
  return (
    <section
      className="relative flex min-h-[480] items-center overflow-hidden bg-cover bg-center bg-no-repeat sm:min-h-[550] lg:min-h-[600]"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(255, 248, 240, 0.92) 0%,
            rgba(255, 248, 240, 0.72) 40%,
            rgba(255, 248, 240, 0.08) 100%
          ),
          url('/images/wedding-banner.png')
        `,
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#9b5264] sm:text-sm">
            Weddings Planned Beautifully
          </p>

          <h1 className="font-serif text-4xl leading-[1.12] text-[#482433] sm:text-5xl md:text-6xl lg:text-7xl">
            Your Love Story,
            <br />
            Our Expertise.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-[#59464a] sm:text-base">
            Thoughtfully planned weddings, beautifully executed, so you can
            enjoy every moment that matters. Let us turn your dream wedding
            into an unforgettable celebration.
          </p>

          <Link
            href="#services"
            className="mt-8 inline-flex items-center gap-3 bg-[#7C0A09] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#703447] hover:shadow-lg"
          >
            Explore Wedding Services
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#fffaf6]/30 to-transparent" />
    </section>
  );
};

export default Banner;
