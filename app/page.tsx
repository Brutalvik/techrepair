export default function Home() {
  return (
    <section className="relative min-h-screen bg-background">
      {/* Faded image background on the right */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-full bg-[url('/images/hero-tech-placeholder.png')] bg-right bg-no-repeat bg-contain opacity-60" />
        {/* Gradient that makes the image fade into the background on the left */}
        <div className="absolute inset-y-0 left-0 right-1/4 bg-gradient-to-r from-background via-background/80 to-transparent" />
        {/* TODO: Replace '/images/hero-tech-placeholder.png' with your own hero image */}
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 pb-10 md:px-6">
        <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-center">
          {/* Left side: copy */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                Infinite Tech Repairs
              </p>

              <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
                <span className="block">We Fix Everything.</span>
                <span className="mt-1 block text-blue-500">
                  Fast, Professional &amp; Reliable
                </span>
                <span className="mt-1 block">Tech Repair Services.</span>
              </h1>
            </div>

            <p className="max-w-xl text-base md:text-lg opacity-80">
              From smartphones to gaming consoles — certified experts ready to
              bring your device back to life.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-full bg-primary px-7 py-3 text-sm font-medium shadow-md transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Book a Repair
              </button>

              <button
                type="button"
                className="rounded-full border border-border bg-transparent px-7 py-3 text-sm font-medium transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Check Repair Status
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs md:text-sm opacity-75">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                Same-day diagnostics • No fix, no fee • Warranty on repairs
              </span>
            </div>
          </div>

          {/* Right side: visual alignment area for the hero image */}
          <div className="flex flex-1 items-center justify-center">
            <div className="h-[320px] w-full max-w-md">
              {/* This area corresponds to the hero image.
                  The actual image is currently coming from the section background above.
                  You can keep it this way, or render an <Image> / <img> here instead. */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
