import type { APIRoute } from 'astro';

const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/attractions', priority: 0.9, changefreq: 'monthly' },
  { url: '/treasures', priority: 0.9, changefreq: 'monthly' },
  { url: '/food', priority: 0.8, changefreq: 'monthly' },
  { url: '/transport', priority: 0.8, changefreq: 'monthly' },
  { url: '/saltlake', priority: 0.8, changefreq: 'daily' },
  { url: '/saltlake/navigate', priority: 0.7, changefreq: 'monthly' },
  { url: '/essentials', priority: 0.7, changefreq: 'monthly' },
  { url: '/fankui', priority: 0.5, changefreq: 'yearly' },
];

export const GET: APIRoute = () => {
  const baseURL = 'https://www.yanseyc.cn';
  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
