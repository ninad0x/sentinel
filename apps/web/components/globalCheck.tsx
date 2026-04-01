import { cn } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import Container, { Description, Title } from "./container";

export function RegionFlags() {
  const regions = [
    {
      flag: "IN",
      name: "Mumbai",
      code: "ap-south-1",
      country: "India",
      shadow: "bg-linear-to-b from-orange-400/70 via-white/80 to-green-500/60",
    },
    {
      flag: "IE",
      name: "Dublin",
      code: "eu-west-1",
      country: "Ireland",
      shadow: "bg-linear-to-r from-green-500/60 via-white/80 to-orange-400/70",
    },
    {
      flag: "US",
      name: "Virginia",
      code: "us-east-1",
      country: "United States",
      shadow:
        "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.55)_0%,rgba(59,130,246,0.35)_30%,transparent_50%),linear-gradient(rgba(239,68,68,0.45),rgba(239,68,68,0.45))]",
    },
  ];

  return (
    <Container className="relative justify-between border-r border-t border-divide">
      <div className="flex items-center justify-center gap-4 mb-4">
        {regions.map((r) => (
          <div key={r.code} className="relative w-36 group">
            <div
              className={cn(
                "absolute -inset-1 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition duration-300",
                `${r.shadow}`,
              )}
            />
            <div className="relative flex flex-col items-center gap-3 p-5 rounded-2xl ring ring-neutral-200/50 bg-neutral-50 ">
              <ReactCountryFlag
                countryCode={r.flag}
                svg
                style={{
                  width: "2rem",
                  height: "2rem",
                }}
                title={r.country}
              />

              <div className="text-center">
                <p className="text-[13px] font-medium text-neutral-800">
                  {r.name}
                </p>
                <p className="text-[8px] lg:text-[10px] text-neutral-400 mt-0.5">{r.code}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 flex flex-col bottom-0 z-50 p-10 gap-1">

        <Title>Multi-region monitoring</Title>
        <Description>
          Monitor across multiple locations to detect region-specific issues faster.
        </Description>
      </div>

    </Container>
  );
}
