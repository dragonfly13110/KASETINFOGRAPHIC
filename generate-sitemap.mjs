import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// --- Configuration ---
// 1. ตั้งค่า URL ของเว็บไซต์จริงของคุณ (สำคัญมาก!)
const BASE_URL = 'https://kasetinfo.netlify.app'; 

// 2. โหลด Environment Variables จากไฟล์ .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Supabase URL or Anon Key is not defined in .env file');
  process.exit(1);
}

// --- Main Sitemap Generation Logic ---
async function generateSitemap() {
  console.log('Starting sitemap generation...');
  const today = new Date().toISOString().split('T')[0];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // 3. กำหนดรายการหน้าเว็บแบบ Static
    const staticPages = [
      '/',
      '/#/infographics',
      '/#/articles',
      '/#/technology',
      '/#/admin',
      '/#/all-stories',
    ].map(p => `${BASE_URL}${p}`);

    let allUrls = staticPages.map(url => ({ loc: url, lastmod: today }));

    // 4. ดึงข้อมูลหน้าเว็บแบบ Dynamic (จาก Supabase)
    try {
      const { data: infographics, error } = await supabase
        .from('infographics')
        .select('id, updated_at'); // ดึง updated_at มาใช้กับ <lastmod>

      if (error) {
        throw error; // Let the outer catch block handle it
      }

      const dynamicUrls = infographics.map(item => ({
        loc: `${BASE_URL}/#/item/${item.id}`,
        lastmod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : today,
      }));

      allUrls = [...staticPages.map(url => ({ loc: url, lastmod: today })), ...dynamicUrls];

    } catch (fetchErr) {
      console.warn('\n\x1b[33m%s\x1b[0m', '⚠️ WARNING: Failed to fetch dynamic routes from Supabase.');
      console.warn('This is likely a network issue. The sitemap will be generated with static routes only.');
      console.warn('Original Error:', fetchErr.message || fetchErr);
      console.warn('');
      // The build will continue using only the static URLs defined above.
    }

    // 5. สร้างเนื้อหา XML
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(urlData => {
    const isHomePage = urlData.loc === BASE_URL || urlData.loc === `${BASE_URL}/`;
    const isItemPage = urlData.loc.includes('/#/item/');
    const priority = isHomePage ? '1.0' : isItemPage ? '0.8' : '0.9';

    return `
    <url>
      <loc>${urlData.loc}</loc>
      <lastmod>${urlData.lastmod}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${priority}</priority>
    </url>`;
  }).join('')}
</urlset>`;

    // 6. เขียนไฟล์ sitemap.xml ไปที่โฟลเดอร์ public
    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent);

    console.log(`✅ Sitemap generated successfully at ${sitemapPath} with ${allUrls.length} URLs.`);
  } catch (err) {
    // This outer catch is for unexpected errors in the script itself (e.g., fs errors)
    console.error('\n\x1b[31m%s\x1b[0m', '❌ CRITICAL ERROR: The sitemap generation script failed unexpectedly.');
    console.error(err);
    process.exit(1); // Fail the build on critical errors
  }
}

generateSitemap();