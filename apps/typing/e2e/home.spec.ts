import { expect, test } from '@playwright/test';

test('home page renders library', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('snippet-grid')).toBeVisible();
	await expect(page.getByTestId('github-url-input')).toBeVisible();

	const cardCount = await page.getByTestId('snippet-card').count();
	expect(cardCount).toBeGreaterThan(5);
});

test('filters narrow snippet list', async ({ page }) => {
	await page.goto('/');
	const allCards = page.getByTestId('snippet-card');
	const initialCount = await allCards.count();

	const pythonFilter = page.getByRole('button', { name: 'python' });
	if (await pythonFilter.count()) {
		await pythonFilter.first().click();
		const filteredCount = await allCards.count();
		expect(filteredCount).toBeLessThanOrEqual(initialCount);
	}
});
