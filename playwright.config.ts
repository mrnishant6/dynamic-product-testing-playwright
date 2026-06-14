/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration — Multi-Reporter Stack
 *
 * Reporters active per environment:
 *  - LOCAL : list + html + allure-playwright + json
 *  - CI    : github + list + html + allure-playwright + json + junit
 *
 * Allure report is generated post-run via:
 *   npm run allure:generate && npm run allure:open
 *
 * See https://playwright.dev/docs/test-configuration
 */

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  /* Run test files in parallel */
  fullyParallel: true,

  /* Fail the build immediately if test.only was accidentally committed */
  forbidOnly: isCI,

  /* Retry failed tests — 2 retries on CI so Allure can track flakiness */
  retries: isCI ? 2 : 0,

  /* Parallelism: CI uses 1 worker (resource-constrained), local uses all CPUs */
  workers: isCI ? 1 : undefined,

  /* ─────────────────────────────────────────────────────────────
   * REPORTERS
   * ─────────────────────────────────────────────────────────────
   * Stacked reporters — each serves a different audience:
   *
   *  list             → clean terminal output (always)
   *  html             → Playwright's interactive HTML report (always)
   *  allure-playwright→ rich dashboard with trends, timeline, categories
   *  json             → machine-readable output for future dashboards
   *  junit            → XML for Jenkins / Jira X-Ray / Azure DevOps
   *  github           → inline PR annotations (CI only)
   * ───────────────────────────────────────────────────────────── */
  reporter: [
    /* Terminal output — clean and human-readable */
    ['list'],

    /* Playwright's built-in interactive HTML report */
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',                // never auto-open in CI
    }],

    /* Allure — rich report with history, categories, timeline, retry tracking */
    ['allure-playwright', {
      detail: true,                 // include individual test steps in the report
      outputFolder: 'allure-results',
      suiteTitle: true,             // use describe() block names as suite labels
      categories: [
        {
          name: '🔴 Product Defects',
          messageRegex: '.*AssertionError.*',
          matchedStatuses: ['failed'],
        },
        {
          name: '⚠️ Test Defects',
          messageRegex: '.*(TypeError|ReferenceError|timeout).*',
          matchedStatuses: ['broken'],
        },
        {
          name: '⏭️ Skipped Tests',
          matchedStatuses: ['skipped'],
        },
      ],
      environmentInfo: {
        'Node Version': process.version,
        'Browser':      'Chromium',
        'Environment':  isCI ? 'CI (GitHub Actions)' : 'Local',
        'Platform':     process.platform,
        'Base URL':     'https://rahulshettyacademy.com',
      },
    }],

    /* JSON — raw results for custom dashboards or tooling */
    ['json', { outputFile: 'test-results/results.json' }],

    /* JUnit XML — standard format for Jenkins / Jira / Azure DevOps */
    ...(isCI ? [
      ['junit', { outputFile: 'test-results/junit.xml' }] as ['junit', { outputFile: string }],
      /* GitHub Actions — annotates failing tests directly on the PR diff */
      ['github'] as ['github'],
    ] : []),
  ],

  /* ─────────────────────────────────────────────────────────────
   * GLOBAL TEST SETTINGS
   * ───────────────────────────────────────────────────────────── */
  use: {
    /* Base URL — use page.goto('/') instead of full URLs in tests */
    baseURL: 'https://rahulshettyacademy.com',

    /* Screenshots: only capture on failure (saves disk space) */
    screenshot: 'only-on-failure',

    /* Video: record but only keep files for failed tests */
    video: 'retain-on-failure',

    /* Trace: capture on the first retry so flaky tests are diagnosable */
    trace: 'on-first-retry',

    /* Run headed locally for visibility, headless on CI (no display) */
    headless: isCI,

    /* Generous action timeout for slow network on CI */
    actionTimeout: 30_000,

    /* Navigation timeout */
    navigationTimeout: 30_000,
  },

  /* ─────────────────────────────────────────────────────────────
   * BROWSER PROJECTS
   * ───────────────────────────────────────────────────────────── */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Uncomment to enable cross-browser coverage */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Folder where Playwright writes test artifacts (screenshots, videos, traces) */
  outputDir: 'test-results/',
});
