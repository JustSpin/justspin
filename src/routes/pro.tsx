import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { cancelPro, confirmPayment } from "@/lib/payments";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PageChrome } from "@/components/page-chrome";
import { Button } from "@/components/ui/button";
import { PAYOUT, PRICING, payoutReady, startCheckout } from "@/lib/monetize";
import { useBite } from "@/lib/store";

export const Route = createFileRoute("/pro")({ component: ProPage });

const PERKS = [
  "No partner slots between your results",
  "Just Ask picks the table and the dish",
  "Starred tables and spin history on your account",
  "Dietary locks on the wheel, coming next",
];

function ProPage() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = Boolean(user);
  const proUnlocked = useBite((s) => s.proUnlocked);
  const setProUnlocked = useBite((s) => s.setProUnlocked);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notice, setNotice] = useState<"success" | "cancel" | "error" | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || isPending || !user) return;
    const q = new URLSearchParams(window.location.search);
    const checkout = q.get("checkout");
    if (checkout === "cancel") {
      setNotice("cancel");
      window.history.replaceState({}, "", "/pro");
      return;
    }
    if (checkout !== "success") return;
    let live = true;
    setBusy(true);
    confirmPayment({ data: { kind: "pro" } })
      .then(() => {
        if (!live) return;
        setProUnlocked(true);
        setNotice("success");
        window.history.replaceState({}, "", "/pro");
      })
      .catch(() => {
        if (live) setNotice("error");
      })
      .finally(() => {
        if (live) setBusy(false);
      });
    return () => {
      live = false;
    };
  }, [mounted, isPending, user, setProUnlocked]);

  const activate = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await confirmPayment({ data: { kind: "pro" } });
      setProUnlocked(true);
      setNotice("success");
    } catch {
      setNotice("error");
    } finally {
      setBusy(false);
    }
  };

  const drop = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await cancelPro();
      setProUnlocked(false);
    } catch {
      setNotice("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageChrome>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          Membership
        </p>
        <img
          src="/poster.jpg"
          alt="JustSpin — Can't decide? Just spin."
          width={1000}
          height={1490}
          className="mt-6 w-full max-w-[200px] rounded-xl border border-border bg-[#12100e]"
        />
        <h1 className="font-display mt-6 max-w-[16ch] text-4xl tracking-tight sm:text-5xl">
          Dinner without the noise.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          JustSpin Pro is ${PRICING.pro.price}/{PRICING.pro.unit}. It unlocks on
          the account you sign in with. A payout account has not been assigned
          yet, so nothing is charged.
        </p>

        <ul className="mt-8 space-y-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm leading-relaxed">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Check className="size-3.5" />
              </span>
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-2xl tracking-tight">
            {proUnlocked ? "Pro is on this account" : "Pay $1.99 / month"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {payoutReady("pro")
              ? PAYOUT.type === "personal"
                ? `PayPal Personal — $${Number(PRICING.pro.price).toFixed(2)} each time, on the account you sign in with.`
                : `Checkout sends ${PRICING.pro.price.toFixed(2)}/${PRICING.pro.unit} to the assigned payout account. Cancel here to turn Pro off on this login.`
              : "Personal PayPal is the payout type. Checkout stays closed until that PayPal email or paypal.me is named."}
          </p>

          {notice === "success" ? (
            <p className="mt-3 text-sm text-accent">Pro is live on this account.</p>
          ) : null}
          {notice === "cancel" ? (
            <p className="mt-3 text-sm text-muted">Checkout canceled. Nothing charged.</p>
          ) : null}
          {notice === "error" ? (
            <p className="mt-3 text-sm text-accent">
              Couldn't update this account. Sign in and try Activate again.
            </p>
          ) : null}

          {!mounted || isPending ? (
            <div className="mt-5 h-12 w-48 animate-pulse rounded-lg bg-raised" />
          ) : !signedIn ? (
            <Button asChild className="mt-5" size="lg">
              <Link to="/login">Sign in to subscribe</Link>
            </Button>
          ) : proUnlocked ? (
            <Button
              type="button"
              variant="outline"
              className="mt-5"
              disabled={busy}
              onClick={() => void drop()}
            >
              Turn Pro off
            </Button>
          ) : payoutReady("pro") ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                type="button"
                size="lg"
                disabled={busy}
                onClick={() => startCheckout("pro")}
              >
                Pay with PayPal
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={busy}
                onClick={() => void activate()}
              >
                I paid — activate
              </Button>
            </div>
          ) : (
            <Button type="button" className="mt-5" size="lg" disabled>
              Checkout not assigned
            </Button>
          )}
        </div>
      </main>
    </PageChrome>
  );
}
