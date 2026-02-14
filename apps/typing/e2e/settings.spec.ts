import { expect, test } from '@playwright/test';

test('settings persist to localStorage', async ({ page }) => {
	await page.goto('/settings');

	const stopSwitch = page.getByRole('switch', { name: 'Stop on error' });
	await stopSwitch.click();

	await page.getByTestId('settings-fontsize').selectOption('lg');
	await page.waitForFunction(() => {
		const raw = window.localStorage.getItem('typecode-settings');
		if (!raw) return false;
		const parsed = JSON.parse(raw);
		return parsed.fontSize === 'lg' && parsed.stopOnError === false;
	});

	const settings = await page.evaluate(() => {
		const raw = window.localStorage.getItem('typecode-settings');
		return raw ? JSON.parse(raw) : {};
	});

	expect(settings.stopOnError).toBe(false);
	expect(settings.fontSize).toBe('lg');
});
