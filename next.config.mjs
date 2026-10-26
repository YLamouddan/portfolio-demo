/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DOCUMENT_ENDPOINT: process.env.VERCEL === "1"
      ? "/api/extract_document"
      : "/api/documents/extract",
  },
};

export default nextConfig;
