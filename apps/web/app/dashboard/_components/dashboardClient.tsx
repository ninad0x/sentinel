"use client";

import WebsiteCard from "./websiteCard";
import { CardData } from "@/lib/types";
import { AddWebsite } from "./addWebsiteDialog";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardClient() {

  const router = useRouter()

  const { data } = useQuery({
    queryKey: ["website"],
    queryFn: () => fetch(`/api/dashboard`).then((res) => res.json()),
    staleTime: 30_000,
  });

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  };

  return (
    <div className="bg-gray-50/50 h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="flex flex-col mx-auto h-full max-w-5xl bg-gray-50 border"
      >
        {/* NAV */}
        <motion.nav
          variants={fadeUp}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="mt-5 flex items-center justify-between px-8 py-5 border-b border-gray-200"
        >
          <p className="font-semibold text-lg text-gray-900 tracking-tight">
            Dashboard
          </p>
          <Button onClick={() => {
            router.push("/monitor/demo")
          }} >Demo</Button>
          <div className="flex items-center gap-6 text-sm font-mono text-gray-400">
            <AddWebsite />
          </div>
        </motion.nav>

        <motion.div
          variants={fadeUp}
          className="text-xs font-medium text-gray-400 uppercase tracking-widest px-8 py-4 border-b border-gray-200 flex justify-between items-center"
        >
          Your Websites
        </motion.div>

        {/* LIST */}
        <motion.div variants={fadeUp}>
          <motion.div
            key={data?.length}
            className="grid grid-cols-1 md:grid-cols-2"
            initial="hidden"
            animate="visible"
          >
            {data?.map((site: CardData, index: number) => (
              <motion.div
                className="border-b border-gray-200 md:odd:border-r"
                key={site.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                    filter: "blur(10px)",
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: { delay: Math.floor(index / 2) * 0.15 },
                  },
                }}
              >
                <WebsiteCard site={site} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
