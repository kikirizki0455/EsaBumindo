/**
 * API Route untuk generate robots.txt
 */

import { generateRobotsTxt } from "@/lib/seo-utils";

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );

  const robotsTxt = generateRobotsTxt();
  res.write(robotsTxt);
  res.end();
}
