import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { toInvoiceNumber } from "@/lib/authorize";

export const runtime = "nodejs";

function verifySignature(rawBody, signatureHeader) {
  const signatureKey = process.env.AUTHORIZE_SIGNATURE_KEY;
  if (!signatureKey || signatureKey.includes("replace_me")) {
    // Optional in sandbox; if unset, accept payloads (still only updates known invoices)
    return true;
  }
  if (!signatureHeader) return false;

  const hash = crypto
    .createHmac("sha512", signatureKey)
    .update(rawBody)
    .digest("hex")
    .toUpperCase();

  const expected = `sha512=${hash}`;
  return expected.toLowerCase() === String(signatureHeader).toLowerCase();
}

async function markSucceededFromPayload(payload) {
  const invoiceNumber =
    payload?.payload?.merchantReferenceId ||
    payload?.payload?.invoiceNumber ||
    payload?.payload?.order?.invoiceNumber ||
    null;

  const transId =
    payload?.payload?.id ||
    payload?.payload?.transId ||
    payload?.payload?.transactionId ||
    null;

  if (!invoiceNumber && !transId) return;

  const payment =
    (invoiceNumber &&
      (await prisma.payment.findFirst({
        where: {
          OR: [
            { authorizeInvoiceNumber: String(invoiceNumber) },
            { id: { startsWith: String(invoiceNumber) } },
          ],
        },
      }))) ||
    (transId &&
      (await prisma.payment.findFirst({
        where: { authorizeTransId: String(transId) },
      })));

  if (!payment) {
    // Try exact invoice helper match against pending payments
    if (invoiceNumber) {
      const pending = await prisma.payment.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      const match = pending.find(
        (p) => toInvoiceNumber(p.id) === String(invoiceNumber)
      );
      if (match) {
        await prisma.payment.update({
          where: { id: match.id },
          data: {
            status: "SUCCEEDED",
            authorizeInvoiceNumber: String(invoiceNumber),
            ...(transId ? { authorizeTransId: String(transId) } : {}),
          },
        });
      }
    }
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCEEDED",
      ...(invoiceNumber
        ? { authorizeInvoiceNumber: String(invoiceNumber) }
        : {}),
      ...(transId ? { authorizeTransId: String(transId) } : {}),
    },
  });
}

async function markRefunded(payload) {
  const transId =
    payload?.payload?.id ||
    payload?.payload?.transId ||
    payload?.payload?.transactionId ||
    null;
  if (!transId) return;

  await prisma.payment.updateMany({
    where: { authorizeTransId: String(transId) },
    data: { status: "REFUNDED" },
  });
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-anet-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const eventType = event?.eventType || "";
    if (
      eventType.includes("payment.authcapture") ||
      eventType.includes("payment.capture") ||
      eventType === "net.authorize.payment.authcapture.created"
    ) {
      await markSucceededFromPayload(event);
    } else if (
      eventType.includes("refund") ||
      eventType === "net.authorize.payment.refund.created"
    ) {
      await markRefunded(event);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
