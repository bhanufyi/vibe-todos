import { expect, test } from '@playwright/test';

test('preview from library opens', async ({ page }) => {
	await page.goto('/');
	const card = page.locator('[data-snippet-id="ts-add"]');
	await card.getByRole('link', { name: 'Preview' }).click();
	await expect(page.getByTestId('snippet-preview')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Start typing' })).toBeVisible();
});

test('invalid GitHub URL shows error', async ({ page }) => {
	await page.goto('/preview?url=https://example.com/not-a-github-url');
	await expect(page.getByText('Snippet not found')).toBeVisible();
});

test('fetch-snippet API rejects non-GitHub URL', async ({ request }) => {
	const response = await request.get('/api/fetch-snippet?url=https://example.com/file.ts');
	expect(response.status()).toBe(400);
});
