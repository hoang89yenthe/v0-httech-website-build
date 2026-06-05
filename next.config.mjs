/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js inline scripts + Vercel Analytics
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      // Tailwind inline styles
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Ảnh: Unsplash (mock), Sanity CDN, data URI
      "img-src 'self' data: https://images.unsplash.com https://cdn.sanity.io",
      // Fetch: Gemini API, Sanity API
      "connect-src 'self' https://generativelanguage.googleapis.com https://api.sanity.io https://*.api.sanity.io https://*.sanity.io",
      // Không cho nhúng site trong iframe
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
