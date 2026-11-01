export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-between">
      {/* Brand Navigation Header */}
      <header className="border-b border-outline-variant bg-surface/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-display font-semibold text-lg shadow-soft">
              W
            </div>
            <div>
              <span className="font-display font-semibold text-xl tracking-tight text-primary block leading-tight">
                D Williams Fashion Hub
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-secondary">
                Tayhlor Platform
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-container text-on-primary-container">
              Bespoke Artisan Studio
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant mb-6 shadow-soft">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-secondary">
            Verified Digital Atelier
          </span>
        </div>

        <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight max-w-4xl leading-[1.15]">
          Bespoke tailoring, crafted with timeless precision.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-secondary max-w-2xl font-normal leading-relaxed">
          From anatomical measurements in centimetres to the final fitting, every garment order,
          deposit, and stitch is recorded and verified in one place.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <div className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-primary text-on-primary font-medium text-sm shadow-soft cursor-default">
            Artisan Tailoring System
          </div>
          <div className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-surface-container text-primary font-medium text-sm border border-outline-variant shadow-soft cursor-default">
            Documented Design Foundation
          </div>
        </div>
      </section>

      {/* Foundation & Architecture Cards */}
      <section className="bg-surface-container-low py-16 border-t border-outline-variant">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-primary tracking-tight">
              Craftsmanship & Architectural Principles
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Core structural pillars defined by the Tayhlor Product Specification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Precision Measurements */}
            <div className="bg-surface rounded-xl p-8 border border-outline-variant shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center mb-6 font-display font-semibold text-xl">
                  01
                </div>
                <h3 className="font-display font-semibold text-xl text-primary mb-3">
                  Precision Measurements
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Standardised anatomical captures in centimetres (chest, waist, hip, shoulder, sleeve, inseam, length). Each garment submission preserves an immutable snapshot.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant text-xs text-secondary font-medium">
                Centimetre Standard • FR-10
              </div>
            </div>

            {/* Card 2: Two-Stage Payments */}
            <div className="bg-surface rounded-xl p-8 border border-outline-variant shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 font-display font-semibold text-xl">
                  02
                </div>
                <h3 className="font-display font-semibold text-xl text-primary mb-3">
                  Two-Stage Financials
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Strict 70% deposit upon tailor acceptance before work begins, followed by the remaining 30% balance upon collection for fitting. Server-verified via Paystack.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant text-xs text-secondary font-medium">
                70/30 Structure • FR-40/FR-42
              </div>
            </div>

            {/* Card 3: Accountable Progress */}
            <div className="bg-surface rounded-xl p-8 border border-outline-variant shadow-medium flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center mb-6 font-display font-semibold text-xl">
                  03
                </div>
                <h3 className="font-display font-semibold text-xl text-primary mb-3">
                  Lifecycle Tracking
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Orders progress through strictly regulated states. Completion requires verified balance settlement and recorded satisfactory fitting with zero fabricated updates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant text-xs text-secondary font-medium">
                Satisfactory Fitting Gate • PRD 8.4
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand & Compliance Footer */}
      <footer className="border-t border-outline-variant bg-surface py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-secondary">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span className="font-display font-semibold text-primary">D Williams Fashion Hub</span>
            <span className="hidden sm:inline text-outline">•</span>
            <span>Tayhlor Atelier System</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span>Verified Information Standard (G3)</span>
            <span className="text-outline">•</span>
            <span>Privacy Notice (FR-73)</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

