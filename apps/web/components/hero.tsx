"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WorldMap from "./worldmap";
import BlurText from "./blurText";

export function Hero() {
  return (
    <section className="relative h-220">

      <div className="relative max-w-7xl mx-auto h-full">

        <motion.div
          className="absolute w-full mx-auto pointer-events-none mt-8 mask-y-from-70%"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <WorldMap />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative z-10 flex h-full px-6 justify-center items-center lg:top-5"
        >
          <div className="top-0 max-w-4xl mx-auto text-center space-y-6">

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-gray-600">
                Real-time monitoring
              </span>
            </div>

            <BlurText className="text-6xl font-semibold tracking-tight leading-tight ">Monitor your websites from everywhere</BlurText>

            <BlurText delayStagger={0.05} className="text-lg text-gray-500 max-w-2xl mx-auto">
              Track uptime, latency, and incidents across multiple regions.
              Get instant alerts when things go wrong.
            </BlurText>

            <div className="flex items-center justify-center gap-4 pt-6 flex-wrap">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-neutral-800 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition  "
              >
                Get Started
              </Link>

              <Link
                href="/monitor/demo"
                className="px-6 py-3 bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50 transition "
              >
                Demo site
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}