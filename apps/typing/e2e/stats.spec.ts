import { expect, test } from '@playwright/test';

const HISTORY = [
	{
		id: 'attempt-1',
		snippetId: 'ts-add',
		snippetTitle: 'Add Two Numbers',
		language: 'typescript',
		wpm: 72,
		accuracy: 98,
		timeSeconds: 22,
		errors: 1,
		createdAt: new Date('2024-01-01T12:00:00Z').toISOString(),
	},
];

test('stats page renders history', async ({ page }) => {
	await page.addInitScript((value) => {
		window.localStorage.setItem('typecode-history', JSON.stringify(value));
	}, HISTORY);

	await page.goto('/stats');
	await expect(page.getByTestId('stats-history')).toContainText('Add Two Numbers');
});
