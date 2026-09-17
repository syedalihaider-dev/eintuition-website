/** @type {import('next').NextConfig} */
// Local: leave NEXT_PUBLIC_BASE_PATH empty. Live (cPanel): set "/eintuition".
const rawBase = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim();
const basePath = rawBase === "/" ? "" : rawBase;

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  // Required when app lives in a real public_html folder: LiteSpeed 301s
  // /eintuition → /eintuition/, and Next's default (no trailing slash) 308s
  // the other way — infinite loop on home only.
  trailingSlash: true,
  poweredByHeader: false,
  // Shared cPanel hosts often can't spawn many workers (EAGAIN). Keep build single-threaded.
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
