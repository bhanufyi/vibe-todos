'use client';

import { useEffect, useState } from 'react';

export type TypingAttempt = {
	id: string;
	snippetId: string;
	snippetTitle: string;
	language: string;
	wpm: number;
	accuracy: number;
	timeSeconds: number;
	errors: number;
	createdAt: string;
};

const STORAGE_KEY = 'typecode-history';

function loadHistory(): TypingAttempt[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as TypingAttempt[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function useTypingHistory() {
	const [history, setHistory] = useState<TypingAttempt[]>([]);

	useEffect(() => {
		setHistory(loadHistory());
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	}, [history]);

	const addAttempt = (attempt: TypingAttempt) => {
		setHistory((prev) => [attempt, ...prev].slice(0, 200));
	};

	const clearHistory = () => {
		setHistory([]);
	};

	return {
		history,
		addAttempt,
		clearHistory,
	};
}
