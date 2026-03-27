"use client";

import Bars from "./bars";
import { RegionFlags } from "./globalCheck";
import IncidentCarousel from "./incidentStack";
import PhoneEmailPopup from "./phoneEmailPopup";

export function Features() {
  return (
    <div className="mt-15 max-w-6xl mx-auto  flex flex-col gap-2">
      <h1 className="text-xl my-5 font-bold text-gray-900 tracking-tight">Features</h1>

      <div
        id="features"
        className="
        max-w-5xl lg:max-w-6xl mx-auto rounded-2xl overflow-hidden 
        grid grid-cols-1 md:grid-cols-7
         divide-neutral-200
        bg-white border border-neutral-200
      "
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
      </div>
    </div>
  );
}
