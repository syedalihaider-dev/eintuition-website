import { NextResponse } from "next/server";

export function jsonOk(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message, status = 400, details = undefined) {
  const body = { success: false, error: message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
