import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AuthSlot } from "@/components/auth-slot";
import { LanguageSelectCompact } from "@/components/language-select";
import { LogoMark, Wordmark } from "@/components/logo";
import { MoreMenu } from "@/components/more-menu";
import { useT } from "@/lib/use-t";

export function PageChrome({
  children,
  kicker,
}: {
  children: ReactNode;
  kicker?: string;
}) {
  const t = useT();
  return (
    <div className="relative min-page bg-bg text-fg">
      <div className="paper-grain pointer-events-none fixed inset-0 opacity-[0.035]" />
      <header className="safe-header sticky top-0 z-30 border-b border-border/80 bg-bg/90">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 text-fg">
            <LogoMark className="size-7" />
            <Wordmark />
          </Link>
          <div className="flex items-center gap-1">
            <MoreMenu />
            <div className="hidden sm:block">
              <LanguageSelectCompact />
            </div>
            <AuthSlot />
            <Link
              to="/"
              className="flex h-11 items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:bg-raised hover:text-fg"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{kicker ?? t("backWheel")}</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="relative">{children}</div>
    </div>
  );
}
