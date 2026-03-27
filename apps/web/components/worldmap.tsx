// worldmap-server.tsx (Server Component, no "use client")
import DottedMap from "dotted-map";
import Image from "next/image";

export default function WorldMap() {
  const map = new DottedMap({ height: 100, grid: "diagonal" });
  const svgMap = map.getSVG({
    radius: 0.22,
    color: "#00000040",
    shape: "circle",
    backgroundColor: "white",
  });

  return (
    <div className="w-full aspect-2/1 bg-transparent rounded-lg relative">
      <Image
        priority={true}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none mask-y-from-75%"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
    </div>
  );
}