# Paystack — MONTÈ payment rules

Env: `PAYSTACK_SECRET_KEY` (server only), `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_SITE_URL`. Use test keys (`sk_test_…`) everywhere except production.

## Flow
1. **Checkout (server action)**: Zod-validate. Re-read the products, compute line prices, shipping (from `shippingRules`) and the total in kobo. Reserve stock atomically. Create the `orders` doc (`paymentStatus: PENDING`, `reservedUntil: now + 30m`, unique `orderNumber` such as `MNT-24F7K2`).
2. **Initialize**: `POST https://api.paystack.co/transaction/initialize` with `Authorization: Bearer <secret>` and the body `{ email, amount: totalKobo (integer), currency: "NGN", reference: <our unique ref>, callback_url: SITE_URL + "/order/verify", metadata: { orderId, orderNumber } }`. Store the `payments` doc (`PENDING`). Redirect to `authorization_url`.
3. **Callback page `/order/verify?reference=`**: calls `GET /transaction/verify/:reference` server-side, then runs the **same idempotent `markPaid`** as the webhook and shows the status. It is a convenience only.
4. **Webhook `POST /api/paystack/webhook`** is the source of truth:
   - Read the body with `await req.text()` (the raw body). Compute `hmac = createHmac("sha512", SECRET).update(raw).digest("hex")` and compare it with `x-paystack-signature` using `crypto.timingSafeEqual` (check the lengths first). On a mismatch, return 401.
   - Parse the JSON, then switch on `event`: `charge.success`, `charge.failed` and `refund.processed`. Ignore everything else with 200.
   - `markPaid(reference, data)`:
     - Find the payment by reference. If it is already `SUCCESS`, return (idempotent).
     - Check that `data.amount === order.total` and `data.currency === "NGN"`. If not, mark `NEEDS_ATTENTION`, alert the admin and do not fulfil.
     - In a transaction, make a conditional update of the payment from `PENDING` to `SUCCESS` (`updateOne({reference, status: {$ne: "SUCCESS"}})`). If `modifiedCount === 0`, another worker won, so return. Then mark the order `PAID`, convert the reservations into stock decrements and write `stockMovements`.
     - After commit, send the confirmation email (Resend) and store an `emailSentAt` guard so it is not sent twice.
   - Return 200 quickly. Store the raw payload on the payment (`raw`).
5. **Cron `/api/cron/payments`** (Vercel Cron, protected with `CRON_SECRET`): release expired reservations, mark old `PENDING` orders `EXPIRED`, re-verify `PENDING` references from the last 24h.
6. **Refunds**: admin action, then `POST /refund` with `{ transaction: reference, amount? }`. Record `REFUNDED` when `refund.processed` arrives.

## Tests (must exist)
- Signature: valid passes, forged fails, a one-byte tampered body fails, a missing header fails.
- Idempotency: the same `charge.success` twice gives one stock decrement and one email.
- Amount mismatch gives `NEEDS_ATTENTION`, not `PAID`.
- Oversell: two concurrent checkouts for the last unit give one reservation and one `OUT_OF_STOCK`.
- Paystack test cards: success, declined, abandoned.

## Never
- Never send the client a price to trust, or accept an amount from the client.
- Never log the secret key or the full webhook headers.
- Never mark an order paid from the callback query string alone.
