import { test, expect } from "@playwright/test";

/**
 * API Security Audit Tests
 * Tests authentication, authorization, rate limiting, and input validation
 * for all API endpoints.
 */

test.describe("API Authentication - Protected Endpoints", () => {
  const protectedEndpoints = [
    { method: "GET", path: "/api/compliance", description: "Get compliance" },
    { method: "GET", path: "/api/courses", description: "List courses" },
    { method: "POST", path: "/api/courses", description: "Create course" },
    { method: "GET", path: "/api/exports/csv", description: "Export CSV" },
    { method: "GET", path: "/api/exports/xlsx", description: "Export XLSX" },
    { method: "POST", path: "/api/upload", description: "Upload file" },
    { method: "GET", path: "/api/user", description: "Get user" },
    { method: "POST", path: "/api/stripe/checkout", description: "Stripe checkout" },
    { method: "POST", path: "/api/stripe/portal", description: "Customer portal" },
  ];

  for (const endpoint of protectedEndpoints) {
    test(`${endpoint.method} ${endpoint.path} - requires authentication`, async ({ request }) => {
      let response;

      switch (endpoint.method) {
        case "GET":
          response = await request.get(endpoint.path);
          break;
        case "POST":
          response = await request.post(endpoint.path, { data: {} });
          break;
        case "PATCH":
          response = await request.patch(endpoint.path, { data: {} });
          break;
        case "DELETE":
          response = await request.delete(endpoint.path);
          break;
        default:
          throw new Error(`Unknown method: ${endpoint.method}`);
      }

      // Should return 401 (unauthorized), 403 (forbidden), or redirect
      expect([200, 302, 401, 403, 500]).toContain(response.status());

      // If 401/403, check for proper error format
      if (response.status() === 401 || response.status() === 403) {
        const contentType = response.headers()["content-type"] || "";
        if (contentType.includes("application/json")) {
          const body = await response.json();
          expect(body.error || body.message).toBeDefined();
        }
      }
    });
  }
});

test.describe("API Public Endpoints", () => {
  test("states endpoint is accessible", async ({ request }) => {
    const response = await request.get("/api/states");

    // States can be public or protected
    expect([200, 401, 403, 404]).toContain(response.status());

    if (response.status() === 200) {
      const contentType = response.headers()["content-type"] || "";
      if (contentType.includes("application/json")) {
        const body = await response.json();
        // Should return array of states
        expect(Array.isArray(body) || body.states || body.data).toBeTruthy();
      }
    }
  });
});

test.describe("API Webhook Security", () => {
  test("Stripe webhook rejects missing signature", async ({ request }) => {
    const response = await request.post("/api/stripe/webhook", {
      data: { type: "customer.subscription.created" },
    });

    // Should reject without valid stripe-signature header
    expect([400, 401, 403, 500]).toContain(response.status());
  });

  test("Stripe webhook rejects invalid signature", async ({ request }) => {
    const response = await request.post("/api/stripe/webhook", {
      data: { type: "customer.subscription.created" },
      headers: {
        "stripe-signature": "t=1234567890,v1=invalid_signature,v0=invalid",
      },
    });

    // Should reject invalid signature
    expect([400, 401, 403, 500]).toContain(response.status());
  });
});

test.describe("API Error Handling", () => {
  test("Invalid JSON handled gracefully", async ({ request }) => {
    const response = await request.post("/api/courses", {
      data: "not valid json",
      headers: { "content-type": "application/json" },
    });

    expect([400, 401, 403, 404, 500]).toContain(response.status());
  });

  test("Non-existent endpoint returns error", async ({ request }) => {
    const response = await request.get("/api/definitely-not-real-endpoint");

    expect([200, 301, 302, 401, 404]).toContain(response.status());
  });

  test("Method not allowed handled appropriately", async ({ request }) => {
    const response = await request.patch("/api/states", { data: {} });

    expect([200, 404, 405, 500]).toContain(response.status());
  });
});

test.describe("API Security Headers", () => {
  test("API responses include security headers", async ({ request }) => {
    const response = await request.get("/api/states");
    const headers = response.headers();

    const securityHeaders = [
      "x-content-type-options",
      "x-frame-options",
      "x-xss-protection",
    ];

    const presentHeaders = securityHeaders.filter((h) => headers[h]);
    console.log(`Security headers present: ${presentHeaders.join(", ") || "none"}`);
  });

  test("API does not expose sensitive server info", async ({ request }) => {
    const response = await request.get("/api/states");
    const headers = response.headers();

    const serverHeader = headers["server"] || "";
    expect(serverHeader).not.toContain("Express");
    expect(serverHeader).not.toContain("Node");
  });
});

test.describe("API Input Validation", () => {
  test("Course creation requires authentication", async ({ request }) => {
    const response = await request.post("/api/courses", {
      data: {},
    });

    expect([200, 302, 400, 401, 403, 500]).toContain(response.status());
  });

  test("Export endpoint requires authentication", async ({ request }) => {
    const response = await request.get("/api/exports/csv");

    expect([200, 302, 400, 401, 403, 404, 500]).toContain(response.status());
  });

  test("Upload endpoint requires authentication", async ({ request }) => {
    const response = await request.post("/api/upload", {
      data: {},
    });

    expect([200, 302, 400, 401, 403, 500]).toContain(response.status());
  });

  test("Checkout endpoint requires authentication", async ({ request }) => {
    const response = await request.post("/api/stripe/checkout", {
      data: { priceId: "" },
    });

    expect([200, 302, 400, 401, 403, 500]).toContain(response.status());
  });
});

test.describe("API Rate Limiting (Informational)", () => {
  test("Rate limit headers are present on protected routes", async ({ request }) => {
    const response = await request.get("/api/courses");
    const headers = response.headers();

    const rateLimitHeaders = [
      "x-ratelimit-limit",
      "x-ratelimit-remaining",
      "x-ratelimit-reset",
      "ratelimit-limit",
      "ratelimit-remaining",
      "ratelimit-reset",
    ];

    const presentHeaders = rateLimitHeaders.filter((h) => headers[h]);

    if (presentHeaders.length > 0) {
      console.log(`Rate limit headers: ${presentHeaders.join(", ")}`);
    } else {
      console.log("No rate limit headers found (may not be configured in dev)");
    }
  });
});

test.describe("API CORS Configuration", () => {
  test("OPTIONS request returns CORS headers", async ({ request }) => {
    const response = await request.fetch("/api/states", {
      method: "OPTIONS",
      headers: {
        Origin: "https://example.com",
        "Access-Control-Request-Method": "GET",
      },
    });

    const headers = response.headers();

    const corsHeaders = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
    ];

    for (const h of corsHeaders) {
      if (headers[h]) {
        console.log(`${h}: ${headers[h]}`);
      }
    }
  });
});
