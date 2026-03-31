import { motion } from "motion/react";
import { GmailIcon } from "./icons/gmailIcon";
import { Description, Title } from "./container";

export default function PhoneEmailPopup() {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="h-80 flex col-span-1 md:col-span-4 relative justify-center"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-b from-white/0 to-white to-20% z-20 rounded-b-2xl" />

      <motion.div
        variants={{
          initial: { y: 0 },
          hover: { y: -40 },
        }}
        transition={{ duration: 0.2 }}
        className="phone absolute bottom-0 h-[90%] top-5 w-[50%] border-x border-t border-neutral-200/50 rounded-t-[44px] pt-2 px-2 z-10 bg-neutral-100 shadow-premium"
      >
        <div className="bg-white relative h-full w-full rounded-t-[38px] border border-neutral-100 overflow-hidden pt-4 px-4">
          {/* notification */}
          <motion.div
            variants={{
              initial: {
                y: -40,
                opacity: 0,
                scale: 0.9,
                filter: "blur(10px)",
                transition: { duration: 0.15, delay: 0 },
              },
              hover: {
                y: 5,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.6,
                  delay: 0.3,
                },
              },
            }}
            className="absolute inset-x-2 top-10 z-30 rounded-2xl bg-white/90 backdrop-blur-md shadow-premium ring-1 ring-black/5 flex items-center p-2 gap-3"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] from-white to-neutral-50 ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_white]">
              <GmailIcon className="size-6" />
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <div className="text-xs font-semibold text-red-500">
                Global incident!
              </div>
              <div className="truncate text-[10px] text-neutral-500 mt-0.5">
                Your website.com is down ...
              </div>
            </div>
          </motion.div>

          <div className="w-14 h-3 bg-neutral-200 rounded-full mx-auto mb-7" />
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square rounded-xl bg-neutral-100" />
            <div className="aspect-square rounded-xl bg-neutral-100" />
            <div className="aspect-square rounded-xl bg-neutral-100" />
            <div className="aspect-square rounded-xl bg-neutral-100" />
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 flex flex-col bottom-0 z-50 p-10 gap-1">
        <Title>Real-time email alerts</Title>
        <Description>
          Receive instant notifications with key details when downtime or incidents occur.
        </Description>
      </div>
    </motion.div>
  );
}
