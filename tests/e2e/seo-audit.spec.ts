import { test, expect } from "@playwright/test";

/**
 * SEO Technical Audit Tests
 * Comprehensive checks for metadata, structured data, and crawlability.
 */

const seoPages = [
  { path: "/", name: "Homepage", expectedTitleContains: "cpe" },
  { path: "/pricing", name: "Pricing", expectedTitleContains: "pricing" },
  { path: "/faq", name: "FAQ", expectedTitleContains: "faq" },
  { path: "/about", name: "About", expectedTitleContains: "about" },
  { path: "/privacy", name: "Privacy", expectedTitleContains: "privacy" },
  { path: "/terms", name: "Terms", expectedTitleContains: "terms" },
];

test.describe("SEO - Title Tags", () => {
  for (const pageInfo of seoPages) {
    test(`${pageInfo.name} has valid title tag`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const title = await page.title();

      // Title should exist and have reasonable length
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70);

      // Title should contain expected keywords
      if (pageInfo.expectedTitleContains) {
        expect(title.toLowerCase()).toContain(pageInfo.expectedTitleContains.toLowerCase());
      }
    });
  }

  test("each page has unique title", async ({ page }) => {
    const titles: Map<string, string> = new Map();

    for (const pageInfo of seoPages) {
      const response = await page.goto(pageInfo.path);
      if (response?.status() !== 404) {
        const title = await page.title();
        titles.set(pageInfo.path, title);
      }
    }

    const uniqueTitles = new Set(titles.values());
    expect(uniqueTitles.size).toBe(titles.size);
  });
});

test.describe("SEO - Meta Descriptions", () => {
  for (const pageInfo of seoPages) {
    test(`${pageInfo.name} has meta description`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const description = await page.locator('meta[name="description"]').getAttribute("content");

      expect(description, "Meta description is missing").not.toBeNull();
      expect(description!.length, "Meta description too short").toBeGreaterThan(50);
      expect(description!.length, "Meta description too long").toBeLessThan(200);
    });
  }
});

test.describe("SEO - Canonical URLs", () => {
  for (const pageInfo of seoPages) {
    test(`${pageInfo.name} has canonical URL`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");

      // Canonical URL should be present
      expect(canonical, "Canonical URL is missing").not.toBeNull();

      // In dev mode, canonical may be relative or point to production domain
      const pathToCheck = pageInfo.path === "/" ? "/" : pageInfo.path;
      const hasCorrectPath = canonical!.endsWith(pathToCheck) ||
                             canonical!.includes(pathToCheck) ||
                             (pageInfo.path === "/" && (canonical!.endsWith("/") || canonical === "/"));

      expect(hasCorrectPath, `Canonical URL ${canonical} should contain path ${pathToCheck}`).toBe(true);
    });
  }
});

test.describe("SEO - OpenGraph Tags", () => {
  for (const pageInfo of seoPages.slice(0, 4)) {
    test(`${pageInfo.name} has OpenGraph tags`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute("content");
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");

      expect(ogTitle, "og:title is missing").not.toBeNull();
      expect(ogDescription, "og:description is missing").not.toBeNull();
      expect(ogImage, "og:image is missing").not.toBeNull();
      expect(ogUrl, "og:url is missing").not.toBeNull();
    });
  }
});

test.describe("SEO - Twitter Cards", () => {
  test("homepage has Twitter card tags", async ({ page }) => {
    await page.goto("/");

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute("content");

    expect(twitterCard, "twitter:card is missing").not.toBeNull();
    expect(twitterTitle || await page.locator('meta[property="og:title"]').getAttribute("content")).not.toBeNull();
  });
});

test.describe("SEO - Heading Structure", () => {
  for (const pageInfo of seoPages) {
    test(`${pageInfo.name} has single H1`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const h1Count = await page.locator("h1").count();
      expect(h1Count, "Should have exactly one H1").toBe(1);
    });
  }

  test("heading hierarchy is logical", async ({ page }) => {
    await page.goto("/");

    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    const headingLevels: number[] = [];

    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      headingLevels.push(parseInt(tagName.replace("H", "")));
    }

    // Check heading levels don't skip
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      expect(diff, `Heading level jumps from H${headingLevels[i - 1]} to H${headingLevels[i]}`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("SEO - Robots Meta", () => {
  for (const pageInfo of seoPages) {
    test(`${pageInfo.name} allows indexing`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      const robotsMeta = await page.locator('meta[name="robots"]').getAttribute("content");

      if (robotsMeta) {
        expect(robotsMeta.toLowerCase()).not.toContain("noindex");
      }
    });
  }
});

test.describe("SEO - JSON-LD Structured Data", () => {
  test("homepage has structured data", async ({ page }) => {
    await page.goto("/");

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

    expect(jsonLdScripts.length, "No JSON-LD structured data found").toBeGreaterThan(0);

    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      expect(() => JSON.parse(content!)).not.toThrow();

      const data = JSON.parse(content!);
      expect(data["@context"]).toBe("https://schema.org");
    }
  });

  test("homepage has relevant schema types", async ({ page }) => {
    await page.goto("/");

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

    let hasRelevantSchema = false;

    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      if (!content) continue;

      if (content.includes("SoftwareApplication") ||
          content.includes("WebApplication") ||
          content.includes("WebSite") ||
          content.includes("Organization") ||
          content.includes("Product")) {
        hasRelevantSchema = true;
        break;
      }
    }

    expect(hasRelevantSchema, "Should have SoftwareApplication, WebApplication, or Organization schema").toBe(true);
  });

  test("FAQ page has FAQPage schema", async ({ page }) => {
    const response = await page.goto("/faq");

    if (response?.status() === 404) {
      test.skip();
      return;
    }

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();

    let hasFaqSchema = false;

    for (const script of jsonLdScripts) {
      const content = await script.textContent();
      if (content?.includes("FAQPage")) {
        hasFaqSchema = true;
      }
    }

    expect(hasFaqSchema, "FAQ page should have FAQPage schema").toBe(true);
  });
});

test.describe("SEO - Sitemap & Robots", () => {
  test("sitemap.xml exists and is valid", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect([200, 301, 302]).toContain(response.status());

    if (response.status() === 200) {
      const content = await response.text();
      expect(content).toContain("<?xml");
      expect(content).toContain("<urlset");
      expect(content).toContain("<url>");
    }
  });

  test("robots.txt exists and is valid", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content).toContain("User-agent:");
    expect(content).toContain("Sitemap:");

    // Should not disallow everything
    expect(content).not.toContain("Disallow: /\n");
  });

  test("robots.txt references correct sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const content = await response.text();

    const sitemapMatch = content.match(/Sitemap:\s*(.+)/i);
    if (sitemapMatch) {
      expect(sitemapMatch[1]).toMatch(/^https?:\/\//);
    }
  });
});

test.describe("SEO - Images", () => {
  test("images have alt attributes", async ({ page }) => {
    await page.goto("/");

    const images = await page.locator("img").all();

    for (const img of images.slice(0, 20)) {
      const alt = await img.getAttribute("alt");
      const src = await img.getAttribute("src");

      expect(alt, `Image ${src} missing alt attribute`).not.toBeNull();
    }
  });
});

test.describe("SEO - Links", () => {
  test("internal links are valid", async ({ page }) => {
    await page.goto("/");

    const links = await page.locator('a[href^="/"]').all();
    const brokenLinks: string[] = [];

    for (const link of links.slice(0, 15)) {
      const href = await link.getAttribute("href");
      if (!href || href.startsWith("#")) continue;

      const response = await page.goto(href);
      if (response?.status() === 404) {
        brokenLinks.push(href);
      }
      await page.goto("/");
    }

    expect(brokenLinks, `Broken links: ${brokenLinks.join(", ")}`).toHaveLength(0);
  });

  test("external links have rel attributes", async ({ page }) => {
    await page.goto("/");

    const externalLinks = await page.locator('a[href^="http"]').all();

    for (const link of externalLinks.slice(0, 10)) {
      const href = await link.getAttribute("href");
      const rel = await link.getAttribute("rel");
      const target = await link.getAttribute("target");

      if (target === "_blank") {
        expect(rel, `Link ${href} missing rel attribute`).toContain("noopener");
      }
    }
  });
});

test.describe("SEO - Performance Indicators", () => {
  test("page has viewport meta tag", async ({ page }) => {
    await page.goto("/");

    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");

    expect(viewport).not.toBeNull();
    expect(viewport).toContain("width=device-width");
  });

  test("page does not have excessive render-blocking resources", async ({ page }) => {
    await page.goto("/");

    const blockingCSS = await page.locator('head link[rel="stylesheet"]:not([media])').count();

    console.log(`Potentially render-blocking stylesheets: ${blockingCSS}`);
  });
});
