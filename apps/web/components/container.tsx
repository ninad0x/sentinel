import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const Title = ({ children }: { children: ReactNode }) => {
  return (
    <h3 className="text-[16px] font-semibold tracking-tight text-neutral-800">
      {children}
    </h3>
  );
};

export const Description = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-[13px] leading-relaxed text-neutral-400 max-w-[60%]">
      {children}
    </p>
  );
};

export const Subtle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-sm text-neutral-400 leading-relaxed">
      {children}
    </p>
  );
};

export default function Container({
  children,
  className,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("p-14 h-80 flex flex-col justify-center bg-white", className)}>
      {children}
    </div>
  );
}