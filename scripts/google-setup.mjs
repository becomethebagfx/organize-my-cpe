/**
 * Google Search Console & Analytics Setup Automation
 * For: Organize My CPE
 *
 * Run with: node scripts/google-setup.mjs
 *
 * Prerequisites:
 * - npm install playwright
 * - npx playwright install chromium
 */

import { chromium } from 'playwright';

const GOOGLE_EMAIL = 'brandonhayman.b@gmail.com';
const GOOGLE_PASSWORD = 'pijxub-Dostif-0ruqzu';

const SITES = [
  {
    name: 'Organize My CPE',
    url: 'https://organizemycpe.com',
    sitemapUrl: 'https://organizemycpe.com/sitemap.xml'
  },
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Starting Google Setup Automation for Organize My CPE...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  try {
    // Login to Google
    console.log('📧 Logging into Google...');
    await page.goto('https://accounts.google.com/signin');
    await sleep(2000);

    await page.fill('input[type="email"]', GOOGLE_EMAIL);
    await page.click('#identifierNext');
    await sleep(3000);

    await page.fill('input[type="password"]', GOOGLE_PASSWORD);
    await page.click('#passwordNext');
    await sleep(5000);

    // Check for 2FA
    if (page.url().includes('challenge')) {
      console.log('\n⚠️  2FA REQUIRED - Complete verification in browser...\n');
      await page.waitForURL(url => !url.includes('challenge'), { timeout: 120000 });
    }

    console.log('✅ Logged in!\n');

    // Google Search Console
    console.log('🔍 Setting up Search Console...');
    for (const site of SITES) {
      await page.goto('https://search.google.com/search-console');
      await sleep(3000);

      try {
        await page.click('text=Add property');
        await sleep(2000);
        await page.click('text=URL prefix');
        await sleep(1000);

        const urlInput = await page.$('input[placeholder*="http"]');
        if (urlInput) {
          await urlInput.fill(site.url);
          await page.click('text=Continue');
          await sleep(5000);
        }

        const code = await page.$eval('code', el => el.textContent).catch(() => null);
        if (code) {
          console.log(`\n📋 Verification for ${site.name}:\n${code}\n`);
        }
      } catch (e) {
        console.log('Complete Search Console setup manually');
      }
    }

    // Google Analytics
    console.log('\n📊 Setting up Analytics...');
    await page.goto('https://analytics.google.com');
    await sleep(3000);

    console.log('\n✅ Browser ready for manual completion');
    console.log('Press Ctrl+C when done.\n');
    await sleep(300000);

  } catch (error) {
    console.error('Error:', error.message);
    await sleep(300000);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
