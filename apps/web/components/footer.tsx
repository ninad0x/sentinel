import Link from "next/link";

export function Footer() {
  return (
    <div className="border-t mt-20 border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-gray-400">Built by Ninad</p>
          <div className="flex gap-6 text-xs font-mono text-gray-400">
            <Link href="https://github.com/ninad0x" target="_" className="hover:text-gray-900 transition">GitHub</Link>
            <Link href="https://x.com/GaonkarNinad" target="_" className="hover:text-gray-900 transition">Twitter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}