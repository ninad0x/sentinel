import Link from "next/link";

export function CTA() {
  return (
    <div className="border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-8 py-24 text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          Start monitoring in minutes
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          No credit card required. Add your first website and get insights immediately.
        </p>
        <Link 
          href="/sign-in"
          className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}