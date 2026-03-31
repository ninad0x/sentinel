"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Container, { Description, Title } from "./container";

export default function Bars() {
  return (
    <Container className="relative border-b border-r border-divide">
      <div
        className={cn(
          "border border-neutral-200 flex flex-col rounded-t-2xl h-64",
          "flex items-center shadow-xl px-5 py-14 md:p-15",
        )}
      >
        
        <div className="w-full flex gap-0.5 items-end justify-center h-10 ">
          {Array.from({ length: 30 }).map((_, i) => {
            return (
              <motion.div
                key={i}
                className="relative"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                {/* bar */}
                <div className="cursor-pointer w-1 md:w-1.5 h-6 hover:h-8.5 transition-all rounded-sm bg-emerald-500" />

                {/* tooltip */}
                <motion.div
                  variants={{
                    rest: { opacity: 0, y: 6, filter: "blur(6px)" },
                    hover: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 
                         rounded-md px-2 py-1 text-xs 
                         bg-neutral-900 text-white shadow-md"
                >
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-medium text-white">
                      99.9%
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between mt-3 w-full md:px-11.5">
          <span className="text-xs text-neutral-400">30d ago</span>
          <span className="text-xs text-neutral-400">Today</span>
        </div>

      </div>

      <div className="absolute inset-x-0 flex flex-col bottom-0 z-50 p-10 gap-1">

        <Title>Uptime Monitoring</Title>
        <Description>Track your system health over time with a clear visual history of uptime and outages.</Description>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-b from-white/0 to-white to-30% z-10 rounded-b-2xl" />


    </Container>
  );
}
