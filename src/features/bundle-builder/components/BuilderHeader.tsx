export function BuilderHeader() {
  return (
    <header className="space-y-2 sm:space-y-3">
      <p className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-primary sm:block">
        Bundle Builder
      </p>
      <div className="space-y-3">
        <h1 className="mx-auto max-w-[348px] text-center text-[31.88px] font-semibold leading-[1.1] tracking-[-0.06px] text-text sm:hidden">
          Let&apos;s get started!
        </h1>
        <h1 className="hidden max-w-3xl text-[32px] font-semibold leading-[0.98] tracking-[-0.04em] text-text sm:block sm:text-5xl">
          Build your home security system
        </h1>
        <p className="hidden max-w-2xl text-sm leading-6 text-text-muted sm:block sm:text-base">
          Choose your cameras, plan, sensors, and extra protection. Your
          selected quantities stay in sync with the review panel.
        </p>
      </div>
    </header>
  )
}
