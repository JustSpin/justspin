import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/use-t";

export function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || isPending) {
    return <div className="size-8 shrink-0 animate-pulse rounded-full bg-raised" aria-hidden />;
  }
  if (!user) {
    return (
      <Link
        to="/login"
        className="flex h-11 items-center px-2 text-sm text-muted hover:text-fg"
      >
        {t("signIn")}
      </Link>
    );
  }
  const label = user.displayName ?? user.primaryEmail ?? t("account");
  return (
    <Link
      to="/account"
      className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-raised ring-1 ring-hairline"
      aria-label={t("accountAria", { label })}
    >
      {user.profileImageUrl ? (
        <img src={user.profileImageUrl} alt="" className="size-8 object-cover" />
      ) : (
        <span className="text-xs font-medium text-fg">{label.charAt(0).toUpperCase()}</span>
      )}
    </Link>
  );
}
