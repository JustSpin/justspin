import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageChrome } from "@/components/page-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CUISINES } from "@/lib/cuisines";
import { partnerMailto, PRICING, payoutReady, startCheckout, type PayKind } from "@/lib/monetize";

export const Route = createFileRoute("/partners")({ component: PartnersPage });

const PLANS: PayKind[] = ["featured", "alwaysOn", "takeover"];

function PartnersPage() {
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState<"success" | "cancel" | null>(null);
  const [form, setForm] = useState({
    restaurant: "",
    city: "",
    cuisine: "mexican",
    email: "",
    website: "",
  });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const checkout = q.get("checkout");
    if (checkout === "success") setNotice("success");
    if (checkout === "cancel") setNotice("cancel");
    if (checkout) window.history.replaceState({}, "", "/partners");
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = partnerMailto(form);
    setSent(true);
  };

  return (
    <PageChrome kicker="Back to the wheel">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          For restaurants
        </p>
        <h1 className="font-display mt-3 max-w-[18ch] text-4xl tracking-tight sm:text-5xl">
          Be the table they land on.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          JustSpin sends hungry people to a cuisine, then a kitchen. Featured
          placements sit in the first chair — before the delivery apps, before
          the scroll. A payout account has not been assigned yet, so checkout
          does not charge.
        </p>

        {notice === "success" ? (
          <p className="mt-6 rounded-lg border border-accent/40 bg-surface px-4 py-3 text-sm text-muted">
            Payment sent. Fill the form below so we know which table to feature.
          </p>
        ) : null}
        {notice === "cancel" ? (
          <p className="mt-6 text-sm text-muted">Checkout canceled. Nothing charged.</p>
        ) : null}

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {PLANS.map((kind) => {
            const tier = PRICING[kind];
            return (
              <article
                key={kind}
                className="flex flex-col rounded-lg border border-border bg-surface p-5"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
                  {tier.name}
                </p>
                <p className="font-display mt-2 text-3xl tracking-tight">
                  ${tier.price}
                  <span className="text-base text-muted">/{tier.unit}</span>
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{tier.blurb}</p>
                <Button
                  type="button"
                  className="mt-4"
                  disabled={!payoutReady(kind)}
                  onClick={() => startCheckout(kind)}
                >
                  {payoutReady(kind) ? `Pay $${tier.price}/${tier.unit}` : "Payout not assigned"}
                </Button>
              </article>
            );
          })}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-12 rounded-xl border border-border bg-surface p-5 sm:p-6"
        >
          <h2 className="font-display text-2xl tracking-tight">Request a placement</h2>
          <p className="mt-1 text-sm text-muted">
            Send this so we know which kitchen to feature. Checkout will take
            payment once a payout account is assigned.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Restaurant">
              <Input
                required
                value={form.restaurant}
                onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
                placeholder="Night + Market"
              />
            </Field>
            <Field label="City">
              <Input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Minneapolis"
              />
            </Field>
            <Field label="Cuisine">
              <select
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                className="flex h-12 w-full rounded-md border border-border bg-well px-4 text-base text-fg"
              >
                {CUISINES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Email">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@kitchen.com"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Website">
                <Input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://"
                />
              </Field>
            </div>
          </div>

          <Button type="submit" className="mt-6" size="lg">
            Send inquiry
          </Button>
          {sent ? (
            <p className="mt-3 text-sm text-muted">
              Your mail app should open with the details. If it didn't, write us from that
              address and mention your city.
            </p>
          ) : null}
        </form>
      </main>
    </PageChrome>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
