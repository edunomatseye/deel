import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("about:blank");
  await page.goto("chrome-error://chromewebdata/");
  await expect(page.locator("#main-content")).toBeVisible();
  await page.locator(".icon").first().click();
  await page.locator("span").click();
  await page.getByText("Try:").click();
  await page.getByText("Checking the network cables,").click();
  await page.getByText("Reconnecting to Wi-Fi").click();
  await page.getByText("DNS_PROBE_FINISHED_NO_INTERNET").click();
  await page.locator(".icon").first().click();
  await expect(page.locator("span")).toBeVisible();
  await expect(page.locator("span")).toContainText("No internet");
  await page.getByText("DNS_PROBE_FINISHED_NO_INTERNET").click();
  await page.getByText("DNS_PROBE_FINISHED_NO_INTERNET").click();
  await expect(page.locator("#main-message")).toContainText("No internet");
  await page.locator(".icon").first().click();
  await page.locator("p").filter({ hasText: "No internet" }).click();
  await expect(page.getByRole("list")).toContainText(
    "Checking the network cables, modem, and router",
  );
  await page.getByText("Checking the network cables,").click();
});
