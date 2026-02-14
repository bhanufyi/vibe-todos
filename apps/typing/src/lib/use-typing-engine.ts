'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const IGNORE_KEYS = new Set([
	'Shift',
	'Alt',
	'Meta',
	'Control',
	'CapsLock',
	'ArrowLeft',
	'ArrowRight',
	'ArrowUp',
	'ArrowDown',
	'PageUp',
	'PageDown',
	'Home',
	'End',
]);

export type TypingEngineOptions = {
	stopOnError: boolean;
	onError?: () => void;
	onComplete?: () => void;
};

export function useTypingEngine(text: string, options: TypingEngineOptions) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [errors, setErrors] = useState<Set<number>>(() => new Set());
	const [isStarted, setIsStarted] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [totalKeystrokes, setTotalKeystrokes] = useState(0);
	const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
	const [errorKeystrokes, setErrorKeystrokes] = useState(0);
	const [elapsedMs, setElapsedMs] = useState(0);
	const startTimeRef = useRef<number | null>(null);

	const totalChars = text.length;

	const startTimer = useCallback(() => {
		if (startTimeRef.current) return;
		startTimeRef.current = Date.now();
		setIsStarted(true);
	}, []);

	useEffect(() => {
		if (!isStarted || isComplete || !startTimeRef.current) return;
		const interval = window.setInterval(() => {
			setElapsedMs(Date.now() - (startTimeRef.current ?? 0));
		}, 200);
		return () => window.clearInterval(interval);
	}, [isComplete, isStarted]);

	const reset = useCallback(() => {
		setCurrentIndex(0);
		setErrors(new Set());
		setIsStarted(false);
		setIsComplete(false);
		setTotalKeystrokes(0);
		setCorrectKeystrokes(0);
		setErrorKeystrokes(0);
		setElapsedMs(0);
		startTimeRef.current = null;
	}, []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			if (isComplete) return;
			if (IGNORE_KEYS.has(event.key)) return;
			if (event.metaKey || event.ctrlKey || event.altKey) return;

			if (event.key === 'Backspace') {
				event.preventDefault();
				event.stopPropagation();
				const targetIndex = Math.max(0, currentIndex - 1);
				setCurrentIndex(targetIndex);
				setErrors((prev) => {
					const next = new Set<number>();
					for (const index of prev) {
						if (index < targetIndex) {
							next.add(index);
						}
					}
					return next;
				});
				return;
			}

			const isPrintable = event.key.length === 1;
			const isSpecial = event.key === 'Enter' || event.key === 'Tab';
			if (!isPrintable && !isSpecial) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const expectedChar = text[currentIndex];
			if (expectedChar === undefined) return;

			startTimer();

			const clearErrorsInRange = (startIndex: number, endIndex: number) => {
				setErrors((prev) => {
					const next = new Set(prev);
					for (let i = startIndex; i < endIndex; i += 1) {
						next.delete(i);
					}
					return next;
				});
			};

			const advanceCursor = (amount: number) => {
				setCorrectKeystrokes((prev) => prev + amount);
				clearErrorsInRange(currentIndex, currentIndex + amount);
				setCurrentIndex((prev) => {
					const nextIndex = prev + amount;
					if (nextIndex >= totalChars) {
						setIsComplete(true);
						setElapsedMs(Date.now() - (startTimeRef.current ?? Date.now()));
						options.onComplete?.();
					}
					return nextIndex;
				});
			};

			setTotalKeystrokes((prev) => prev + 1);

			const inputChar = event.key === 'Enter' ? '\n' : event.key === 'Tab' ? '\t' : event.key;
			const isCorrect = inputChar === expectedChar;

			if (isCorrect) {
				advanceCursor(1);
				return;
			}

			setErrorKeystrokes((prev) => prev + 1);
			options.onError?.();
			setErrors((prev) => {
				const next = new Set(prev);
				next.add(currentIndex);
				return next;
			});

			if (!options.stopOnError) {
				setCurrentIndex((prev) => Math.min(totalChars, prev + 1));
			}
		},
		[currentIndex, isComplete, options, startTimer, text, totalChars]
	);

	const accuracy = useMemo(() => {
		if (totalKeystrokes === 0) return 100;
		return Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100));
	}, [correctKeystrokes, totalKeystrokes]);

	const wpm = useMemo(() => {
		if (!isStarted) return 0;
		const minutes = Math.max(1 / 60, elapsedMs / 60000);
		return Math.round(correctKeystrokes / 5 / minutes);
	}, [correctKeystrokes, elapsedMs, isStarted]);

	const progress = useMemo(() => {
		if (totalChars === 0) return 0;
		return Math.min(100, Math.round((currentIndex / totalChars) * 100));
	}, [currentIndex, totalChars]);

	return {
		currentIndex,
		errors,
		isStarted,
		isComplete,
		totalKeystrokes,
		correctKeystrokes,
		errorKeystrokes,
		elapsedMs,
		accuracy,
		wpm,
		progress,
		totalChars,
		handleKeyDown,
		reset,
	};
}
