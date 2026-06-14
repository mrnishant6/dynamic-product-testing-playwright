import { Page, TestInfo } from "@playwright/test";
import { allure } from "allure-playwright";

/**
 * Helper — shared test utilities with Allure step + attachment support.
 *
 * The `allure` object from allure-playwright is the legacy API.
 * All its methods are async and must be awaited.
 *
 * Usage in spec files:
 *   const h = new helper(page, testInfo);
 *   await h.takeScreenshot('after-login');
 *   await h.step('Navigate to checkout', async () => { ... });
 */
export class helper {
  readonly page: Page;
  readonly testInfo: TestInfo;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  /**
   * Captures a full-page screenshot and attaches it to both:
   *  - Playwright HTML report (via testInfo.attach)
   *  - Allure report (via allure.attachment)
   *
   * allure.attachment signature: (name, content, mimeTypeString)
   */
  async takeScreenshot(name: string): Promise<void> {
    const screenshot = await this.page.screenshot({ fullPage: true });

    // Attach to Playwright HTML report
    await this.testInfo.attach(name, {
      body: screenshot,
      contentType: "image/png",
    });

    // Attach to Allure report — note: 3rd arg is a plain mime-type string
    await allure.attachment(name, screenshot, "image/png");
  }

  /**
   * Wraps a block of test actions into a named Allure step.
   * Steps appear as a collapsible tree in the Allure report.
   *
   * @example
   *   await h.step('Fill login form', async () => {
   *     await page.fill('#email', 'user@test.com');
   *     await page.fill('#password', 'secret');
   *   });
   */
  async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return allure.step(name, fn as () => Promise<void>) as Promise<T>;
  }

  /**
   * Tags the current test with a severity level.
   * Appears as a coloured badge in the Allure report.
   *
   * @param level 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'
   */
  async setSeverity(
    level: "blocker" | "critical" | "normal" | "minor" | "trivial"
  ): Promise<void> {
    await allure.severity(level);
  }

  /**
   * Sets the feature and story labels for the current test.
   * Groups tests in the Allure Behaviors tab.
   *
   * @example await h.setLabel('E-Commerce', 'Checkout Flow');
   */
  async setLabel(feature: string, story: string): Promise<void> {
    await allure.feature(feature);
    await allure.story(story);
  }

  /**
   * Adds a link to the Allure report for the current test.
   * Use type 'issue' for Jira/GitHub issues, 'tms' for test management.
   *
   * allure.link signature: (type, url, name?)
   */
  async addLink(
    url: string,
    name: string,
    type: "issue" | "tms" = "issue"
  ): Promise<void> {
    // Legacy API: link(type, url, name)
    await allure.link(type, url, name);
  }

  /**
   * Attaches any text content (JSON, API responses, logs) to the report.
   *
   * allure.attachment signature: (name, content, mimeTypeString)
   */
  async attachText(
    name: string,
    content: string,
    contentType = "text/plain"
  ): Promise<void> {
    // Attach to Allure — 3rd arg is plain mime-type string
    await allure.attachment(name, content, contentType);

    // Also attach to Playwright HTML report
    await this.testInfo.attach(name, {
      body: Buffer.from(content),
      contentType,
    });
  }
}