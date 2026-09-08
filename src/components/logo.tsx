import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/icon-wheel.png"
      alt=""
      width={32}
      height={32}
      className={cn(
        "size-8 rounded-full bg-[#12100e] object-cover ring-1 ring-[#c9a86a]/45",
        className,
      )}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-[1.35rem] leading-none tracking-tight", className)}>
      Just<span className="italic text-[#d4af6a]">Spin</span>
      <sup className="ml-0.5 align-super font-sans text-[0.55em] font-medium not-italic tracking-normal text-accent">
        ™
      </sup>
    </span>
  );
}
