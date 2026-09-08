import { Link } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/use-t";

export function AdCard({ cuisine }: { cuisine: string }) {
  const t = useT();
  return (
    <aside className="rounded-lg border border-dashed border-hairline bg-well px-4 py-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-raised text-accent">
          <Megaphone className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {t("partnerSlot")}
          </p>
          <p className="mt-1 font-display text-lg leading-snug tracking-tight">
            {t("ownChair", { cuisine })}
          </p>
          <p className="mt-1 text-sm text-muted">{t("placementsBlurb")}</p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link to="/partners">{t("seePlacements")}</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
