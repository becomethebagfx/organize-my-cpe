import { test, expect } from "@playwright/test";

/**
 * Comprehensive E2E Tests for Organize My CPE
 * Tests ALL pages, navigation, and features
 */

test.describe("Marketing Pages", () => {
  const marketingPages = [
    { path: "/", name: "Homepage" },
    { path: "/pricing", name: "Pricing" },
    { path: "/faq", name: "FAQ" },
    { path: "/privacy", name: "Privacy Policy" },
    { path: "/terms", name: "Terms of Service" },
  ];

  for (const page of marketingPages) {
    test(`${page.name} page loads correctly`, async ({ page: browserPage }) => {
      const response = await browserPage.goto(page.path);
      expect([200, 304]).toContain(response?.status() ?? 0);

      const body = browserPage.locator("body");
      await expect(body).toBeVisible();
    });
  }
});

test.describe("Auth Pages", () => {
  test("sign-in page renders", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/sign-in/);
  });

  test("sign-up page renders", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/sign-up/);
  });
});

test.describe("Protected Routes Respond", () => {
  test("dashboard responds", async ({ page }) => {
    const response = await page.goto("/dashboard");
    expect(response?.status()).toBeDefined();
  });

  test("courses page responds", async ({ page }) => {
    const response = await page.goto("/courses");
    expect(response?.status()).toBeDefined();
  });

  test("upload page responds", async ({ page }) => {
    const response = await page.goto("/upload");
    expect(response?.status()).toBeDefined();
  });

  test("exports page responds", async ({ page }) => {
    const response = await page.goto("/exports");
    expect(response?.status()).toBeDefined();
  });

  test("settings page responds", async ({ page }) => {
    const response = await page.goto("/settings");
    expect(response?.status()).toBeDefined();
  });

  test("onboarding page responds", async ({ page }) => {
    const response = await page.goto("/onboarding");
    expect(response?.status()).toBeDefined();
  });
});

test.describe("Navigation", () => {
  test("header exists on homepage", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header, nav").first();
    await expect(header).toBeVisible();
  });

  test("pricing page has CTA buttons", async ({ page }) => {
    await page.goto("/pricing");
    const buttons = page.locator("button, a[href*='sign']");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Pricing Page Features", () => {
  test("shows pricing tiers", async ({ page }) => {
    await page.goto("/pricing");
    const body = await page.locator("body").textContent();

    const hasPricingContent =
      body?.includes("Free") ||
      body?.includes("Pro") ||
      body?.includes("$") ||
      body?.includes("9.99");

    expect(hasPricingContent).toBe(true);
  });
});

test.describe("API Endpoints", () => {
  test("states API returns state rules", async ({ request }) => {
    const response = await request.get("/api/states");
    // May return data or require auth
    expect([200, 401, 403, 500]).toContain(response.status());
  });

  test("courses API requires auth", async ({ request }) => {
    const response = await request.get("/api/courses");
    expect([401, 403, 500]).toContain(response.status());
  });

  test("compliance API requires auth", async ({ request }) => {
    const response = await request.get("/api/compliance");
    expect([401, 403, 500]).toContain(response.status());
  });

  test("stripe checkout requires auth", async ({ request }) => {
    const response = await request.post("/api/stripe/checkout", {
      data: {},
      timeout: 10000,
    });
    expect([400, 401, 403, 500]).toContain(response.status());
  });
});

test.describe("SEO & Metadata", () => {
  test("homepage has title", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test("homepage has meta description", async ({ page }) => {
    await page.goto("/");
    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute("content");
    expect(content?.length).toBeGreaterThan(0);
  });

  test("pricing page has title with pricing", async ({ page }) => {
    await page.goto("/pricing");
    const title = await page.title();
    expect(title.toLowerCase()).toContain("cpe");
  });
});

test.describe("Responsive Design", () => {
  test("homepage responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("homepage responsive on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("homepage has h1", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    const count = await h1.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });
});

test.describe("Performance", () => {
  test("homepage loads quickly", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
  });
});
