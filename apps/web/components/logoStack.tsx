"use client";

import React from "react";
import { motion } from "motion/react";
import { TailwindcssWordmark } from "./ui/svgs/tailwindcssWordmark";
import { VercelWordmark } from "./ui/svgs/vercelWordmark";
import { ResendWordmarkBlack } from "./ui/svgs/resendWordmarkBlack";
import { MotionDark } from "./ui/svgs/motionDark";
import { NextjsLogoLight } from "./ui/svgs/nextjsLogoLight";
import { AwsLight } from "./ui/svgs/awsLight";
import { cn } from "@/lib/utils";
import { Gmail } from "./ui/svgs/gmail";

const logos = [
  NextjsLogoLight,
  TailwindcssWordmark,
  MotionDark,
  VercelWordmark,
  ResendWordmarkBlack,
  AwsLight,
  Gmail,
  NextjsLogoLight,
];

export default function LogoStack() {
    const cols = 4
  const variants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  };

  return (
    <div>
      <div className="bg-divide h-px w-full" />

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="flex flex-col justify-center items-center max-w-5xl lg:max-w-6xl mx-auto"
      >
        <h2 className="py-8 text-center font-mono text-sm tracking-tight text-neutral-500 uppercase w-full border-x border-divide">
          Made with the latest
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 border-divide w-full border border-b-0">
          {logos.map((Logo, i) => (
            <motion.div
              key={i}
              variants={variants}
              initial="initial"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 ,delay: i * 0.08 + 0.3 }}
              className={cn(
                "flex items-center justify-center min-h-32 p-4 py-10 border-divide",
                "border-r border-b",
                (i % 4 === cols -1) && "border-r-0",
                (i >= logos.length - cols) && "border-b-0",
              )}
            >
              <Logo
                className={cn(
                  "h-4 **:fill-zinc-700",
                  (Logo === AwsLight || Logo === Gmail) && "h-6",
                )}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="bg-divide h-px w-full" />
    </div>
  );
}
