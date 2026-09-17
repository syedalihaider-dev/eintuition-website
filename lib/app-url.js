export function getAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const raw = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
  const basePath = !raw || raw === "/" ? "" : raw;
  return `http://localhost:3000${basePath}`;
}
