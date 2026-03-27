"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const WorldMap = dynamic(() => import("./worldmap"), { ssr: true });

export function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto flex items-center justify-center">
        {/* World map background */}
        <div className="absolute inset-0 pointer-events-none mt-8 max-w-6xl">
          <WorldMap />
        </div>

        {/* Hero content */}
        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-8"
        >
          <div className="max-w-4xl mx-auto text-center space-y-6">

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-600">Real-time monitoring</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-shadow tracking-tight leading-tight">
              Monitor your websites<br />from everywhere
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              Track uptime, latency, and incidents across multiple regions.
              Get instant alerts when things go wrong.
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              >
                Get Started
              </Link>

              <Link
                href="/monitor/demo"
                className="px-6 py-3 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Demo site
              </Link>
            </div>

          </div>
        </motion.div>

    </section>
  )
}