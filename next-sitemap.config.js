/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pemafarmfresh.co.ke',
  generateRobotsTxt: true,          // ← this is what autogenerates robots.txt
  // Optional but useful defaults
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,                // splits into multiple sitemaps if >5000 URLs
  generateIndexSitemap: true,       // creates sitemap-index.xml if needed
  exclude: [
    '/admin/*',
    '/private/*',
    '/api/*',                       // usually good to exclude API routes
    '/404',                         // etc.
  ],
  // If you have dynamic pages not caught automatically → add custom transform later
};