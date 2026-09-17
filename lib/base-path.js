export const BASE_PATH = (() => {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
  if (!raw || raw === "/") return "";
  return raw;
})();

/** Prefix an app path with basePath for fetch()/absolute URLs. Link/router do this automatically. */
export function withBasePath(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!BASE_PATH) return normalized;
  if (normalized === "/") return BASE_PATH;
  return `${BASE_PATH}${normalized}`;
}
