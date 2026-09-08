import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PageChrome } from "@/components/page-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (mounted && !isPending && user) {
    return <Navigate to="/account" />;
  }

  const onEmail = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Guest",
        });
        if (err) throw new Error(err.message ?? "Could not create the account.");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message ?? "Could not sign in.");
      }
      window.location.href = "/account";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageChrome>
      <main className="mx-auto max-w-md px-4 py-10 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          {t("loginKicker")}
        </p>
        <h1 className="font-display mt-3 text-4xl tracking-tight">
          {mode === "up" ? t("loginUpTitle") : t("loginInTitle")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t("loginBlurb")}</p>

        {!authEnabled ? (
          <p className="mt-8 text-sm text-muted">{t("signInDisabled")}</p>
        ) : (
          <>
            <div className="mt-8 grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
                >
                  {t("continueWith", { name: p.label })}
                </Button>
              ))}
            </div>

            <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
              {t("orEmail")}
            </p>

            <form onSubmit={(e) => void onEmail(e)} className="mt-4 space-y-3">
              {mode === "up" ? (
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex"
                    autoComplete="name"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordHint")}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                />
              </div>
              {error ? <p className="text-sm text-accent">{error}</p> : null}
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? t("working") : mode === "up" ? t("createAccount") : t("signIn")}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              {mode === "up" ? (
                <>
                  {t("alreadyChair")}{" "}
                  <button
                    type="button"
                    className="text-fg underline-offset-4 hover:underline"
                    onClick={() => {
                      setMode("in");
                      setError(null);
                    }}
                  >
                    {t("signIn")}
                  </button>
                </>
              ) : (
                <>
                  {t("newHere")}{" "}
                  <button
                    type="button"
                    className="text-fg underline-offset-4 hover:underline"
                    onClick={() => {
                      setMode("up");
                      setError(null);
                    }}
                  >
                    {t("createAccount")}
                  </button>
                </>
              )}
            </p>
            <p className="mt-6 text-center text-xs text-subtle">
              <Link to="/" className="underline-offset-4 hover:underline">
                {t("backWheel")}
              </Link>
            </p>
          </>
        )}
      </main>
    </PageChrome>
  );
}
