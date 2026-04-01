"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Container, { Description, Title } from "./container";

const incidents = [
  {
    id: 1,
    type: "Global",
    badge: "bg-red-50 text-red-600 ring-1 ring-red-100",
    dot: "bg-red-400",
    domain: "website.com",
    time: "14:32",
  },
  {
    id: 2,
    type: "Regional",
    badge: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    dot: "bg-amber-400",
    domain: "test.website.com",
    time: "09:11",
  },
  {
    id: 3,
    type: "Resolved",
    badge: "bg-green-50 text-green-600 ring-1 ring-green-100",
    dot: "bg-green-400",
    domain: "website.com",
    time: "22:04",
  },
];

export default function IncidentList() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((i) => (i + 1) % incidents.length),
      2500
    );
    return () => clearInterval(t);
  }, []);

  return (
    <Container className="relative border-b border-l border-divide">
      <div className="h-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl overflow-hidden ">
        
        <div className="flex flex-col">
          {incidents.map((inc, i) => (
            <div
              key={inc.id}
              className={cn(
                "flex items-center gap-3 px-3 h-11 rounded-xl transition-all duration-500",
                i === active
                  ? "opacity-100 bg-neutral-100"
                  : "opacity-40 bg-transparent"
              )}
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${inc.dot}`} />
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${inc.badge}`}
              >
                {inc.type}
              </span>
              <span className="text-[13px] font-medium text-neutral-700 truncate flex-1">
                {inc.domain}
              </span>
              <span className="text-[10px] text-neutral-400 shrink-0 tabular-nums">
                {inc.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 flex flex-col bottom-0 z-50 p-10 gap-1">
        <Title>Incident Detection</Title>
        <Description>Instantly identify global and regional outages with real-time incident tracking.</Description>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-b from-white/0 to-white to-20% z-10 rounded-b-2xl" />
    </Container>
  );
}