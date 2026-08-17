import type { LoaderFunctionArgs } from "react-router";
export function loader({request}:LoaderFunctionArgs){const origin=new URL(request.url).origin;return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin\nSitemap: ${origin}/sitemap.xml\n`,{headers:{"Content-Type":"text/plain; charset=utf-8"}})}
