import { createFileRoute } from "@tanstack/react-router";
import { PageChrome } from "@/components/page-chrome";
import { BRAND } from "@/lib/brand";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/marks")({ component: MarksPage });

function MarksPage() {
  const t = useT();
  return (
    <PageChrome kicker={t("backWheel")}>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          {t("marksKicker")}
        </p>
        <h1 className="font-display mt-3 max-w-[18ch] text-4xl tracking-tight sm:text-5xl">
          {t("marksTitle", { mark: BRAND.mark })}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{t("marksLead")}</p>

        <section className="mt-10 space-y-6 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-xl tracking-tight text-fg">{t("theMarks")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="text-fg">{BRAND.mark}</span> — {t("theName")}
              </li>
              <li>
                {t("theLogo")}
              </li>
              <li>
                <span className="text-fg">“{BRAND.slogan}”</span> — {t("theSlogan")}
              </li>
              <li>
                JustSpin Pro™ — {t("theMembership")}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-tight text-fg">{t("theftTitle")}</h2>
            <p className="mt-3">{t("theftP1")}</p>
            <p className="mt-3">{t("theftP2")}</p>
          </div>

          <div>
            <h2 className="font-display text-xl tracking-tight text-fg">{t("copyrightTitle")}</h2>
            <p className="mt-3">{t("copyrightP", { year: BRAND.year, owner: BRAND.owner })}</p>
          </div>

          <p className="text-xs text-subtle">{t("marksFoot", { inbox: BRAND.inbox })}</p>
        </section>
      </main>
    </PageChrome>
  );
}
