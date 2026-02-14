'use client';

import { useEffect, useState } from 'react';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type ThemeMode = 'dark' | 'light';

export type Settings = {
	stopOnError: boolean;
	fontSize: FontSize;
	soundEnabled: boolean;
	theme: ThemeMode;
};

const DEFAULT_SETTINGS: Settings = {
	stopOnError: true,
	fontSize: 'md',
	soundEnabled: true,
	theme: 'dark',
};

const STORAGE_KEY = 'typecode-settings';

function loadSettings(): Settings {
	if (typeof window === 'undefined') return DEFAULT_SETTINGS;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_SETTINGS;
		const parsed = JSON.parse(raw) as Partial<Settings>;
		return {
			...DEFAULT_SETTINGS,
			...parsed,
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}

export function useSettings() {
	const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

	useEffect(() => {
		setSettings(loadSettings());
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	}, [settings]);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(settings.theme);
	}, [settings.theme]);

	const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	const resetSettings = () => {
		setSettings(DEFAULT_SETTINGS);
	};

	return {
		settings,
		setSettings,
		updateSetting,
		resetSettings,
	};
}
