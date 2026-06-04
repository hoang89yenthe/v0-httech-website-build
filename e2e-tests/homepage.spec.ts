import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Truy cập trang chủ trước mỗi test
    await page.goto("/");
  });

  test("should load the homepage with correct brand and header details", async ({ page }) => {
    // Kiểm tra tiêu đề trang
    await expect(page).toHaveTitle(/HT TECH - Thiết Bị Điện Công Nghiệp & Tự Động Hóa/);

    // Kiểm tra tên thương hiệu trong header
    const brandHeader = page.locator("header[role='banner']").filter({ hasText: "HT TECH" });
    await expect(brandHeader).toBeVisible();

    // Kiểm tra sự hiển thị của các liên kết điều hướng chính
    const navLinks = page.locator("header nav a");
    await expect(navLinks).toHaveCount(5);
    await expect(navLinks.nth(0)).toHaveText("Trang chủ");
    await expect(navLinks.nth(1)).toHaveText("Giới thiệu");
    await expect(navLinks.nth(2)).toHaveText("Sản phẩm");
  });

  test("should scroll to sections on clicking nav links", async ({ page }) => {
    // Click vào 'Giới thiệu' và kiểm tra scroll đến #about
    await page.click("header nav a:has-text('Giới thiệu')");
    await page.waitForTimeout(500); // Đợi scroll
    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeInViewport();

    // Click vào 'Liên hệ' và kiểm tra scroll đến #contact
    await page.click("header nav a:has-text('Liên hệ')");
    await page.waitForTimeout(500); // Đợi scroll
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeInViewport();
  });

  test("should interact with product category filter tabs", async ({ page }) => {
    // Mặc định tab 'Tất cả' được chọn
    const activeTab = page.locator("button[role='tab'][aria-selected='true']");
    await expect(activeTab).toHaveText("Tất cả");

    // Click chọn danh mục 'Biến tần'
    await page.click("button[role='tab']:has-text('Biến tần')");
    
    // Đợi UI lọc sản phẩm
    await page.waitForTimeout(300);
    const newActiveTab = page.locator("button[role='tab'][aria-selected='true']");
    await expect(newActiveTab).toHaveText("Biến tần");

    // Kiểm tra Carousel hiển thị các card sản phẩm biến tần
    const productCards = page.locator("[data-card]");
    await expect(productCards.first()).toBeVisible();
  });

  test("should successfully validate and submit the contact form", async ({ page }) => {
    // Di chuyển tới Contact form
    const form = page.locator("#contact form");
    await expect(form).toBeVisible();

    // Fill thông tin
    await page.fill("#contact input[name='name']", "Kiểm Thử Viên");
    await page.fill("#contact input[name='phone']", "0987654321");
    await page.fill("#contact input[name='email']", "tester@httechvietnam.vn");
    await page.selectOption("#contact select[name='product']", "bien-tan");
    await page.fill("#contact textarea[name='message']", "Đây là tin nhắn tự động từ kịch bản kiểm thử E2E Playwright.");

    // Submit form
    await page.click("#contact button[type='submit']");
    
    // Đợi phản hồi thành công từ API
    await page.waitForTimeout(2000);

    // Xác nhận hiển thị thông điệp thành công
    const successCard = page.locator("#contact");
    await expect(successCard).toContainText("Gửi yêu cầu thành công!");
  });

  test("should successfully open, interact, and close the AI chatbot widget", async ({ page }) => {
    // 1. Kiểm tra nút Floating Chatbot hiển thị trên màn hình
    const chatBtn = page.locator("#aiChatBtn");
    await expect(chatBtn).toBeVisible();

    // 2. Click mở widget chat
    await chatBtn.click();

    // 3. Đợi Widget Chat hiển thị
    const chatWidget = page.locator("#aiChatWidget");
    await expect(chatWidget).toBeVisible();

    // 4. Nhập tin nhắn vào ô chat
    const chatInput = page.locator("#aiChatInput");
    await chatInput.fill("Xin chào Trợ lý ảo HTtech!");

    // 5. Nhấn nút gửi
    const sendBtn = page.locator("#aiSendBtn");
    await sendBtn.click();

    // 6. Kiểm tra xem tin nhắn đã gửi có xuất hiện trong khung chat không
    const chatArea = page.locator("#aiChatArea");
    await expect(chatArea).toContainText("Xin chào Trợ lý ảo HTtech!");

    // 7. Đợi và kiểm tra phản hồi từ Server (Chạy ở chế độ Playwright Test, route.ts sẽ mock trả về phản hồi giả lập)
    await expect(chatArea).toContainText("Đây là phản hồi giả lập từ Trợ lý ảo HTtech");

    // 8. Đóng khung chat
    const closeBtn = page.locator("#aiChatCloseBtn");
    await closeBtn.click();

    // 9. Kiểm tra xem khung chat đã ẩn đi chưa
    await expect(chatWidget).not.toBeVisible();
  });
});

