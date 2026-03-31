import Image from "next/image";

export default function WorldMap() {
  return (
    <div className="relative w-full aspect-2/1">
      <Image
        src="/world-map.svg"
        alt="world map"
        fill
        priority
        className="pointer-events-none select-none opacity-80"
      />
    </div>
  );
}