import Link from "next/link"

export function Header() {
  return (
    <nav id="nav" className="fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur-md border-gray-100">
      <div className="max-w-5xl px-5 lg:max-w-6xl lg:px-0 mx-auto h-16 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          Sentinel
        </Link>

        <div className="flex items-center gap-8">
          <Link href="#features" className="text-sm font-mono text-gray-600 hover:text-gray-900 hover:underline underline-offset-3 transition-all">
            Features
          </Link>

          <Link href="/monitor/demo" className="text-sm font-mono text-gray-600 hover:text-gray-900 hover:underline underline-offset-3 transition-all">
            Demo site
          </Link>

          <Link
            href="/sign-in"
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}