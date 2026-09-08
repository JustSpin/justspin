import { useMemo } from "react";
import { t } from "@/lib/i18n";
import { useBite } from "@/lib/store";

export function useT() {
  const locale = useBite((s) => s.locale);
  return useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => t(locale, key, vars);
  }, [locale]);
}
