import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { PRICING, type PayKind } from "@/lib/monetize";

const KINDS = new Set<PayKind>(["pro", "featured", "alwaysOn", "takeover"]);

function amountCents(kind: PayKind) {
  return Math.round(Number(PRICING[kind].price) * 100);
}

export const confirmPayment = createServerFn({ method: "POST" })
  .validator((input: { kind: PayKind }) => {
    if (!KINDS.has(input.kind)) throw new Error("Unknown plan");
    return input;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into payments (user_id, kind, amount_cents, status)
      values (${context.userId}, ${data.kind}, ${amountCents(data.kind)}, 'paid')
    `;
    if (data.kind === "pro") {
      await sql`
        insert into profiles (user_id, is_pro)
        values (${context.userId}, true)
        on conflict (user_id) do update set is_pro = true
      `;
    }
    return { ok: true as const, kind: data.kind, isPro: data.kind === "pro" };
  });

export const cancelPro = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, is_pro)
      values (${context.userId}, false)
      on conflict (user_id) do update set is_pro = false
    `;
    return { isPro: false };
  });
