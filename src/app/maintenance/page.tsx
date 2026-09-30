export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center">
          <span className="text-white font-heading font-bold text-2xl">O</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-primary mb-3">
          Sedang Dalam Pemeliharaan
        </h1>
        <p className="text-primary/60 leading-relaxed">
          Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 text-primary/40 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse" />
          Maintenance mode aktif
        </div>
      </div>
    </div>
  )
}
