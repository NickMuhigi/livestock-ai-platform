export function LogoMarquee() {
  const logos = [
    "AgriTech Co",
    "FarmWise",
    "HerdVault",
    "VetCloud",
    "CattleIQ",
    "PastureAI",
    "RanchOS",
    "LiveBase",
    "BovineNet",
    "DairyFlow",
  ]

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Logo Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12 items-center justify-items-center grayscale opacity-50">
          {logos.map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="flex items-center justify-center"
            >
              <div className="flex h-8 items-center gap-2 font-bold text-base tracking-tight select-none text-muted-foreground">
                <div className="h-5 w-5 rounded bg-muted-foreground/20" />
                {logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
