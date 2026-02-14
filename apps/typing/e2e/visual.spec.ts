import { type Page, expect, test } from '@playwright/test';

async function disableAnimations(page: Page) {
	await page.addStyleTag({
		content: '*{animation:none !important;transition:none !important;}',
	});
}

test('home visual snapshot', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('snippet-grid')).toBeVisible();
	await disableAnimations(page);
	await expect(page).toHaveScreenshot('home.png');
});

test('preview visual snapshot', async ({ page }) => {
	await page.goto('/preview?id=ts-add');
	await expect(page.getByTestId('snippet-preview')).toBeVisible();
	await disableAnimations(page);
	await expect(page).toHaveScreenshot('preview.png');
});

test('practice visual snapshot', async ({ page }) => {
	await page.goto('/practice?source=library&id=ts-add');
	await expect(page.getByTestId('typing-area')).toBeVisible();
	await disableAnimations(page);
	await expect(page).toHaveScreenshot('practice.png');
});
