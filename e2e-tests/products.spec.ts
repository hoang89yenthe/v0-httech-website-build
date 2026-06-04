import { test, expect } from "@playwright/test";

test.describe("Products and Details E2E Tests", () => {
  test("should load the products list page and filter by query param", async ({ page }) => {
    // Truy cập trang sản phẩm với query lọc PLC & HMI
    await page.goto("/san-pham?category=plc-hmi");

    // Đợi trang tải
    await expect(page.locator("h1")).toHaveText("Sản Phẩm");

    // Xác nhận tab lọc danh mục tương ứng được active
    const activeTab = page.locator("button[role='tab'][aria-selected='true']");
    await expect(activeTab).toHaveText("PLC & HMI");

    // Kiểm tra có ít nhất 1 sản phẩm hiển thị trong Grid
    const cards = page.locator("[data-card]");
    await expect(cards.first()).toBeVisible();
  });

  test("should display details of a specific product", async ({ page }) => {
    // Truy cập chi tiết sản phẩm Biến tần Siemens V20
    const slug = "bien-tan-siemens-v20-075kw";
    await page.goto(`/san-pham/${slug}`);

    // Kiểm tra tiêu đề chính (h1)
    const productTitle = page.locator("h1");
    await expect(productTitle).toBeVisible();
    await expect(productTitle).toContainText("Biến tần Siemens SINAMICS V20");

    // Kiểm tra sự tồn tại của bảng thông số kỹ thuật (specs table)
    const specsTable = page.locator("table");
    await expect(specsTable).toBeVisible();

    // Kiểm tra nút liên hệ Hotline và Zalo
    const callButton = page.locator("article a[href^='tel:']").filter({ hasText: "Gọi đặt hàng ngay" });
    await expect(callButton).toBeVisible();

    const zaloButton = page.locator("article a[href*='zalo.me']").filter({ hasText: "Chat Zalo báo giá" });
    await expect(zaloButton).toBeVisible();
  });

  test("should embed correct SEO metadata and JSON-LD structured data", async ({ page }) => {
    const slug = "plc-siemens-s7-1200-cpu1214c";
    await page.goto(`/san-pham/${slug}`);

    // Kiểm tra canonical URL thẻ link
    const canonicalLink = page.locator("link[rel='canonical']");
    await expect(canonicalLink).toHaveAttribute("href", new RegExp(`/san-pham/${slug}$`));

    // Kiểm tra sự tồn tại của script JSON-LD cho cấu trúc Google Search Console
    const jsonLdScript = page.locator(`script#json-ld-${slug}`);
    await expect(jsonLdScript).toHaveAttribute("type", "application/ld+json");
    
    const scriptContent = await jsonLdScript.innerHTML();
    const parsedData = JSON.parse(scriptContent);
    expect(parsedData["@type"]).toBe("Product");
    expect(parsedData["name"]).toContain("S7-1200");
  });
});
