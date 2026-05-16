export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Dark aesthetic branding */}
      <div className="hidden md:flex flex-col justify-between bg-zinc-950 text-white p-12 relative overflow-hidden">
        {/* Abstract background gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10" />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-zinc-950"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">Taskly AI</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Transform the way your team works.
          </h2>
          <p className="text-zinc-400">
            Intelligent task management designed for high-performance teams. Predict bottlenecks before they happen.
          </p>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
