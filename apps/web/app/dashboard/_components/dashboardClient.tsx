"use client";

import WebsiteCard from "./websiteCard";
import { CardData } from "@/lib/types";
import { AddWebsite } from "./addWebsiteDialog";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardClient() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
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

          <div className="flex items-center gap-2 text-sm font-mono text-gray-400">
            <Button
              className="cursor-pointer font-mono"
              variant="link"
              onClick={() => {
                router.push("/monitor/demo");
              }}
            >
              Demo site
            </Button>

            <AddWebsite disable={data ? data.length >= 2 : true} />
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
            {isLoading ? 
            
            (
              <div className="col-span-2 px-8 py-16 flex items-center justify-center">
                <p className="text-sm text-gray-400 font-mono">Loading...</p>
              </div>
            ) : !data?.length ? 
            
            (
              <div className="col-span-2 px-8 py-16 flex flex-col items-center gap-3 text-center">
                <p className="text-sm font-medium text-gray-900">
                  No monitors yet
                </p>
                <p className="text-sm text-gray-400">
                  Add a website to start monitoring, or check out the{" "}
                  <Link
                    href="/monitor/demo"
                    className="text-gray-900 underline underline-offset-2"
                  >
                    demo site
                  </Link>{" "}
                  to see how it works.
                </p>
              </div>
            ) : (
              data.map((site: CardData, index: number) => (
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
              ))
            )}

          </motion.div>
        </motion.div>
        <div className=" mt-auto px-8 py-4 border-gray-200">
          {data?.length >= 2 && (
            <p className="text-sm text-gray-400 text-center font-mono">Only 2 monitors allowed</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
