export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/loading-hamster.svg"
          alt="Loading..."
          width={120}
          height={120}
          className="animate-[pulse_2s_infinite]"
        />
        <p className="text-sm font-medium text-primary/70">Memuat...</p>
      </div>
    </div>
  )
}
