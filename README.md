# playwright_tests
End-to-end web automation test suite using Playwright. Covers dynamic product selection, form validations, dropdown handling, order placement, and order history validations.

# 🧪 Playwright End-to-End Web Automation Suite

This repository contains an end-to-end automation framework built using [Playwright](https://playwright.dev/). The scripts simulate real-world user actions like selecting products dynamically, handling dropdowns, placing orders, and verifying order history on a sample e-commerce web application.

## ✅ Covered Test Scenarios

- ✅ Dynamically find and purchase a product from a list
- ✅ Add assertions and handle sync issues
- ✅ Work with auto-suggestive dropdowns
- ✅ Complete E2E flow of order placement and capture order ID
- ✅ Validate order from OrderHistory using captured data

## 🛠️ Tech Stack

- Playwright
- JavaScript / TypeScript
- Node.js
- Git

## 🏗️ Framework Architecture (Page Object Model)

This project implements a robust, enterprise-grade **Page Object Model (POM)** design pattern, heavily inspired by standard Maven/Java project structures. It intentionally separates concerns to maximize maintainability, scalability, and execution speed.

### Directory Structure & Intentions

*   **`src/main/pages/`**: Contains global and foundational page objects that can be shared across different suites (e.g., `LoginPage.ts`). This is where session establishment and authentication flows live.
*   **`src/test/pages/`**: Contains the test-specific Page Objects (e.g., `CheckoutPage.ts`, `DashboardPage.ts`). These focus strictly on interacting with the UI for specific feature validations.
*   **`src/test/pages/POManager.ts`**: Acts as a centralized Factory/Facade pattern. Instead of instantiating multiple page objects in every test, tests simply initialize the `POManager`, minimizing boilerplate code.
*   **`src/test/data/`**: Externalizes all hardcoded parameters (emails, product names) into JSON files like `testData.json`. This allows non-engineers to add test scenarios without modifying TypeScript code.
*   **`tests/`**: The core execution folder. Contains the actual Playwright spec files (`WebAPI.spec.ts`, `Productest.spec.ts`). These files strictly handle **Assertions (The "What")**, delegating all Playwright locator logic **(The "How")** to the `src` folder.

### Key Features
*   **State Injection vs UI Login**: Demonstrates both standard UI authentication and advanced API token injection (`localStorage`), bypassing UI latency to drastically reduce execution time for downstream tests.
*   **Dynamic Synchronization**: Uses robust `waitFor()` polling for auto-suggestive dropdowns rather than flaky hardcoded `.waitForTimeout()` sleeps.

## 📦 Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/playwright-e2e-automation.git
   ```

## 🚀 CI/CD Pipeline Best Practices (Crucial for Playwright)

When running this framework in a CI/CD pipeline, **do not** delete the `package-lock.json` file or use `npm install` with floating versions (e.g., `^1.53.0`), as this can cause browser binary mismatches or registry 'Not Found' errors in private corporate networks.

**Incorrect Pipeline Steps ❌**
```bash
rm -rf node_modules package-lock.json
npm install
npx playwright install chromium
```

**Correct Pipeline Steps ✅**
Always ensure `package-lock.json` is committed to version control and use `npm ci` (Clean Install).
```bash
# npm ci automatically deletes node_modules and strictly installs the exact versions from package-lock.json
npm ci
npx playwright install chromium
```
This guarantees that the node code and the massive Chromium binaries downloaded by Playwright are perfectly synced, preventing unexpected pipeline crashes when new versions are released globally.
