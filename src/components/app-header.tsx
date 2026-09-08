import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { AuthSlot } from "@/components/auth-slot";
import { LanguageSelectCompact } from "@/components/language-select";
import { LogoMark, Wordmark } from "@/components/logo";
import { MoreMenu } from "@/components/more-menu";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/use-t";
import { useBite } from "@/lib/store";

type Props = {
  onLocation: () => void;
  onSettings: () => void;
};

export function AppHeader({ onLocation, onSettings }: Props) {
  const location = useBite((s) => s.location);
  const t = useT();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const cityLabel = ready && location?.label ? location.label : t("setCity");

  return (
    <header className="safe-header sticky top-0 z-30 border-b border-border/80 bg-bg/90">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 text-fg">
          <LogoMark className="size-7" />
          <Wordmark />
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onLocation}
            className="flex h-11 max-w-[6.5rem] items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:bg-raised hover:text-fg sm:max-w-[10.5rem]"
          >
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{cityLabel}</span>
          </button>
          <div className="hidden sm:block">
            <LanguageSelectCompact />
          </div>
          <Button variant="ghost" size="icon" onClick={onSettings} aria-label={t("customizeAria")}>
            <SlidersHorizontal />
          </Button>
          <MoreMenu />
          <AuthSlot />
        </div>
      </div>
    </header>
  );
}
