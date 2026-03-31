"use client";

import Bars from "./bars";
import { RegionFlags } from "./globalCheck";
import IncidentCarousel from "./incidentStack";
import PhoneEmailPopup from "./phoneEmailPopup";
import { motion } from "motion/react";

export function Features() {
  const variants = {
    initial: {
      opacity: 0,
      y: 40,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  };

  return (
    <>
      <motion.div
        id="features"
        className="border-x border-divide flex flex-col items-center max-w-6xl mx-auto"
        variants={variants}
        initial="initial"
        whileInView="visible"
        viewport={{ margin: "-100px" }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center py-20 space-y-4">
          <p className="text-xs uppercase tracking-widest text-red-500">
            with sentinel
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900">
            Stay ahead of downtime
          </h2>

          <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base">
            Track uptime, detect incidents from multiple regions and get alerts
            instantly!
          </p>
        </div>
        <div className="bg-divide h-px w-full"></div>

        <motion.div
          variants={variants}
          initial="initial"
          whileInView="visible"
          viewport={{ margin: "-100px" }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl lg:max-w-6xl grid grid-cols-1 md:grid-cols-7 bg-white"
        >
          <div className="md:col-span-4">
            <Bars />
          </div>

          <div className="md:col-span-3">
            <IncidentCarousel />
          </div>

          <div className="md:col-span-3">
            <RegionFlags />
          </div>

          <div className="md:col-span-4">
            <PhoneEmailPopup />
          </div>
        </motion.div>

      </motion.div>
      <div className="bg-divide h-px w-full" />
    </>
  );
}
