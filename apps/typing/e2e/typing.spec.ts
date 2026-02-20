import { expect, test } from '@playwright/test';

const ADD_SNIPPET = 'function add(a: number, b: number): number {\n  return a + b;\n}\n';

test('typing updates stats', async ({ page }) => {
	await page.goto('/practice?source=library&id=ts-add');
	const area = page.getByTestId('typing-area');
	await area.click();
	await page.keyboard.type('function ');

	const wpmValue = await page.getByTestId('stats-wpm').textContent();
	expect(Number(wpmValue)).toBeGreaterThan(0);
	await expect(page.getByTestId('stats-accuracy')).toContainText('100');
});

test('tab is rejected when spaces are expected', async ({ page }) => {
	await page.goto('/practice?source=library&id=ts-add');
	const area = page.getByTestId('typing-area');
	await area.click();
	await page.keyboard.type('function add(a: number, b: number): number {');
	await page.keyboard.press('Enter');
	const progressBeforeTab = await page.getByTestId('progress-value').textContent();
	await page.keyboard.press('Tab');

	await expect(page.getByTestId('stats-errors')).toHaveText('1');
	await expect(page.getByTestId('progress-value')).toHaveText(progressBeforeTab ?? '0%');
});

test('wrong input counts errors in stop-on-error mode', async ({ page }) => {
	await page.goto('/practice?source=library&id=ts-add');
	const area = page.getByTestId('typing-area');
	await area.click();
	await page.keyboard.type('x');

	await expect(page.getByTestId('stats-errors')).toHaveText('1');
	await expect(page.getByTestId('progress-value')).toHaveText('0%');
	await expect(page.locator('.typing-char.error')).toHaveCount(1);

	await page.keyboard.press('Backspace');
	await expect(page.locator('.typing-char.error')).toHaveCount(0);
});

test('completing a snippet shows results screen', async ({ page }) => {
	await page.goto('/practice?source=library&id=ts-add');
	const area = page.getByTestId('typing-area');
	await area.click();
	await page.keyboard.type(ADD_SNIPPET);

	await expect(page.getByText('Run complete')).toBeVisible();
});
