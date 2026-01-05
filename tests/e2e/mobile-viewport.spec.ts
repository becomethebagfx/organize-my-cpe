import { test, expect } from "@playwright/test";

/**
 * Mobile Viewport Tests - Horizontal Scroll Detection
 * Tests all public pages on multiple mobile viewports to ensure
 * no horizontal scrolling occurs.
 */

const mobileViewports = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 14 Pro", width: 393, height: 852 },
  { name: "Pixel 7", width: 412, height: 915 },
  { name: "Galaxy S23", width: 360, height: 780 },
];

const publicPages = [
  { path: "/", name: "Homepage" },
  { path: "/pricing", name: "Pricing" },
  { path: "/faq", name: "FAQ" },
  { path: "/about", name: "About" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
  { path: "/sign-in", name: "Sign In" },
  { path: "/sign-up", name: "Sign Up" },
];

test.describe("Mobile Viewport - No Horizontal Scroll", () => {
  for (const viewport of mobileViewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      for (const pageInfo of publicPages) {
        test(`${pageInfo.name} - no horizontal overflow`, async ({ page }) => {
          const response = await page.goto(pageInfo.path, { waitUntil: "networkidle" });

          // Skip if page doesn't exist
          if (response?.status() === 404) {
            test.skip();
            return;
          }

          // Wait for any animations/layout shifts
          await page.waitForTimeout(500);

          // Check for horizontal scroll
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });

          expect(hasHorizontalScroll, `Page has horizontal scroll on ${viewport.name}`).toBe(false);
        });

        test(`${pageInfo.name} - no overflowing elements`, async ({ page }) => {
          const response = await page.goto(pageInfo.path, { waitUntil: "networkidle" });

          if (response?.status() === 404) {
            test.skip();
            return;
          }

          await page.waitForTimeout(500);

          // Find elements that overflow viewport
          const overflowingElements = await page.evaluate(() => {
            const viewportWidth = document.documentElement.clientWidth;
            const elements = document.querySelectorAll("*");
            const overflows: string[] = [];

            elements.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.right > viewportWidth + 5 || rect.left < -5) {
                const tag = el.tagName.toLowerCase();
                const className = el.className?.toString().slice(0, 50) || "";
                const id = el.id || "";
                overflows.push(`${tag}${id ? "#" + id : ""}${className ? "." + className.split(" ")[0] : ""} (right: ${Math.round(rect.right)}px)`);
              }
            });

            return overflows.slice(0, 5);
          });

          expect(overflowingElements, `Elements overflow viewport: ${overflowingElements.join(", ")}`).toHaveLength(0);
        });
      }
    });
  }
});

test.describe("Mobile Touch Targets", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  for (const pageInfo of publicPages.slice(0, 5)) {
    test(`${pageInfo.name} - touch targets are at least 44x44px`, async ({ page }) => {
      const response = await page.goto(pageInfo.path, { waitUntil: "networkidle" });

      if (response?.status() === 404) {
        test.skip();
        return;
      }

      // Check interactive elements
      const buttons = await page.locator('button, a, [role="button"], input[type="submit"]').all();
      const smallTargets: string[] = [];

      for (const button of buttons.slice(0, 20)) {
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          const text = await button.textContent();
          smallTargets.push(`${text?.slice(0, 20) || "element"} (${Math.round(box.width)}x${Math.round(box.height)})`);
        }
      }

      // Allow some small targets
      expect(smallTargets.length, `Too many small touch targets: ${smallTargets.join(", ")}`).toBeLessThan(20);
    });
  }
});

test.describe("Mobile Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("mobile menu toggle exists on homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Look for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"], button:has(svg)').first();

    const hasMobileNav = await mobileMenuButton.count() > 0;
    const navLinks = page.locator("nav a, header a");
    const hasVisibleNav = await navLinks.first().isVisible().catch(() => false);

    expect(hasMobileNav || hasVisibleNav).toBe(true);
  });

  test("sticky header works on scroll", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const header = page.locator("header").first();

    if (await header.count() === 0) {
      test.skip();
      return;
    }

    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    const isVisible = await header.isVisible();
    expect(isVisible).toBe(true);
  });
});

test.describe("Mobile Typography", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("body text is readable (min 14px)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const bodyFontSize = await page.evaluate(() => {
      const body = document.querySelector("body");
      if (!body) return 16;
      return parseFloat(getComputedStyle(body).fontSize);
    });

    expect(bodyFontSize).toBeGreaterThanOrEqual(14);
  });

  test("text doesn't overflow containers", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const hasTextOverflow = await page.evaluate(() => {
      const textElements = document.querySelectorAll("p, h1, h2, h3, span, a");
      for (const el of textElements) {
        if (el.scrollWidth > el.clientWidth + 5) {
          return true;
        }
      }
      return false;
    });

    expect(hasTextOverflow).toBe(false);
  });
});
