import Image from "next/image";

export default function UnderConstruction() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="flex max-w-lg flex-col items-center gap-12">
        <Image
          src="/hero-logo-mark.png"
          alt="PP Estate"
          width={160}
          height={160}
          className="h-32 w-32 object-contain sm:h-40 sm:w-40"
          priority
        />

        <div>
          <h1 className="text-4xl font-extrabold tracking-[0.18em] text-logo sm:text-5xl md:text-6xl">
            PP <span className="text-primary">ESTATE</span>
          </h1>
          <p className="mt-3 text-sm font-semibold tracking-[0.38em] text-[#0d3479]/80 sm:text-base md:text-lg">
            NIERUCHOMOŚCI
          </p>
        </div>

        <p className="text-2xl font-medium text-slate-500 sm:text-3xl md:text-4xl">
          Strona w budowie
        </p>
      </div>
    </main>
  );
}
