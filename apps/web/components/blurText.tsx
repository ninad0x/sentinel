import React from "react";
import { motion } from "motion/react";

export default function BlurText({
  children,
  className,
  delayParent,
  delayChildren,
  delayStagger
}: {
  children: string;
  className: string;
  delayParent?: number;
  delayChildren?: number;
  delayStagger?: number
}) {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: delayStagger ?? 0.1, delayChildren: delayChildren ?? 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={item}
          className="inline-block mr-[0.2em]"
        >
          {word}
          {/* {i === 2 && <br />} */}
        </motion.span>
      ))}
    </motion.h1>
  );
}
