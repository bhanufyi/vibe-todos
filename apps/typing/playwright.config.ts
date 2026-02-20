import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	outputDir: './test-results',
	snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
	timeout: 30_000,
	reporter: [['list'], ['html', { open: 'never' }]],
	expect: {
		toHaveScreenshot: {
			maxDiffPixels: 150,
		},
	},
	use: {
		baseURL: 'http://localhost:3000',
		viewport: { width: 1280, height: 720 },
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	webServer: {
		command: 'npx next dev --turbopack --port 3000',
		port: 3000,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
