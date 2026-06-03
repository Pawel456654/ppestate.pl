import Image from "next/image";

type BrandMarkProps = {
  variant?: "default" | "menu";
  logoCircle?: boolean;
  stacked?: boolean;
};

export default function BrandMark({
  variant = "default",
  logoCircle = false,
  stacked = false,
}: BrandMarkProps) {
  const isMenu = variant === "menu";
  const isHero = logoCircle && stacked;

  return (
    <div
      className={
        stacked ? "flex flex-col items-center gap-6 text-center" : "flex items-center gap-3"
      }
    >
      <div
        className={
          logoCircle
            ? "flex h-32 w-32 shrink-0 items-center justify-center md:h-40 md:w-40"
            : "flex h-full w-16 shrink-0 items-center justify-center"
        }
      >
        <Image
          src="/hero-logo-mark.png"
          alt="PP Estate symbol"
          width={logoCircle ? 160 : 64}
          height={logoCircle ? 160 : 64}
          sizes={logoCircle ? "160px" : "64px"}
          className={
            logoCircle
              ? "h-32 w-32 scale-[1.12] object-contain md:h-40 md:w-40"
              : "h-16 w-16 translate-y-[2px] scale-[1.12] object-contain"
          }
          priority={logoCircle}
          preload={!logoCircle}
        />
      </div>
      <div className="leading-none">
        <p
          className={
            isHero
              ? "text-3xl font-extrabold tracking-[0.18em] sm:text-4xl md:text-5xl"
              : "text-xl font-extrabold tracking-[0.18em] sm:text-2xl"
          }
        >
          <span className={isMenu ? "text-white md:text-logo" : "text-logo"}>PP</span>{" "}
          <span className={isMenu ? "text-blue-200 md:text-primary" : "text-primary"}>ESTATE</span>
        </p>
        <p
          className={`mt-1 font-semibold tracking-[0.38em] ${
            isHero
              ? "text-sm sm:text-base md:text-lg"
              : "text-[10px] sm:text-xs"
          } ${isMenu ? "text-white/80 md:text-[#0d3479]/80" : "text-[#0d3479]/80"}`}
        >
          NIERUCHOMOSCI
        </p>
      </div>
    </div>
  );
}
