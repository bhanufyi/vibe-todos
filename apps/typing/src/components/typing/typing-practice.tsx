'use client';

import { Focus, Keyboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ResultsScreen } from '@/components/typing/results-screen';
import { StatsPanel } from '@/components/typing/stats-panel';
import { TypingDisplay } from '@/components/typing/typing-display';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TokenLine } from '@/lib/highlighter-types';
import { useSettings } from '@/lib/use-settings';
import { useTypingEngine } from '@/lib/use-typing-engine';
import { useTypingHistory } from '@/lib/use-typing-history';

type TypingPracticeProps = {
	snippetId: string;
	snippetTitle: string;
	language: string;
	code: string;
	tokenLines: TokenLine[];
	source: 'library' | 'github';
};

const fontSizeClass: Record<string, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
	xl: 'text-lg',
};

function createId() {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function TypingPractice({
	snippetId,
	snippetTitle,
	language,
	code,
	tokenLines,
	source,
}: TypingPracticeProps) {
	const router = useRouter();
	const { settings } = useSettings();
	const { addAttempt } = useTypingHistory();
	const containerRef = useRef<HTMLTextAreaElement | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const savedAttemptRef = useRef(false);
	const [isFocused, setIsFocused] = useState(false);

	const playErrorSound = useCallback(() => {
		if (!settings.soundEnabled) return;
		if (typeof window === 'undefined') return;
		const AudioContextConstructor =
			window.AudioContext ||
			(window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AudioContextConstructor) return;
		const context = audioContextRef.current ?? new AudioContextConstructor();
		audioContextRef.current = context;
		if (context.state === 'suspended') {
			void context.resume();
		}
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.type = 'sine';
		oscillator.frequency.value = 260;
		gain.gain.value = 0.04;
		oscillator.connect(gain);
		gain.connect(context.destination);
		oscillator.start();
		oscillator.stop(context.currentTime + 0.08);
	}, [settings.soundEnabled]);

	const engine = useTypingEngine(code, {
		stopOnError: settings.stopOnError,
		onError: playErrorSound,
	});

	useEffect(() => {
		containerRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!engine.isComplete || savedAttemptRef.current) return;
		savedAttemptRef.current = true;
		addAttempt({
			id: createId(),
			snippetId,
			snippetTitle,
			language,
			wpm: engine.wpm,
			accuracy: engine.accuracy,
			timeSeconds: Math.round(engine.elapsedMs / 1000),
			errors: engine.errorKeystrokes,
			createdAt: new Date().toISOString(),
		});
	}, [
		addAttempt,
		engine.accuracy,
		engine.elapsedMs,
		engine.errorKeystrokes,
		engine.isComplete,
		engine.wpm,
		language,
		snippetId,
		snippetTitle,
	]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				savedAttemptRef.current = false;
				engine.reset();
				return;
			}
			engine.handleKeyDown(event);
		},
		[engine]
	);

	const infoCopy = useMemo(() => {
		return source === 'github' ? 'GitHub import' : 'Curated drill';
	}, [source]);

	useEffect(() => {
		const handleFocusShortcut = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;
			if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
				return;
			}
			if (document.activeElement === containerRef.current) return;
			if (event.key !== 'Enter') return;
			event.preventDefault();
			containerRef.current?.focus();
		};

		window.addEventListener('keydown', handleFocusShortcut);
		return () => window.removeEventListener('keydown', handleFocusShortcut);
	}, []);

	return (
		<div className="relative grid gap-6 lg:grid-cols-[1fr_320px]">
			<div className="code-panel overflow-hidden">
				<div className="code-header flex items-center justify-between">
					<div className="flex items-center gap-3 text-xs">
						<Badge variant="muted">{language}</Badge>
						<span className="font-semibold text-foreground">{snippetTitle}</span>
						<span className="text-muted-foreground">{infoCopy}</span>
					</div>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Keyboard className="h-3 w-3" />
						Stop on error: {settings.stopOnError ? 'on' : 'off'}
					</div>
				</div>
				<div className="relative max-h-[70vh] overflow-auto px-6 pb-8 pt-6">
					<div className={`relative ${fontSizeClass[settings.fontSize]}`}>
						<textarea
							ref={containerRef}
							className="typing-input absolute inset-0 h-full w-full resize-none bg-transparent text-transparent caret-transparent outline-none"
							spellCheck={false}
							readOnly
							aria-label="Typing practice area"
							data-testid="typing-area"
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
						/>
						<TypingDisplay
							tokenLines={tokenLines}
							currentIndex={engine.currentIndex}
							errorIndices={engine.errors}
						/>
					</div>
					{!isFocused ? (
						<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
							<div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs text-muted-foreground">
								<Focus className="h-4 w-4" />
								Click to focus and start typing
							</div>
						</div>
					) : null}
				</div>
			</div>
			<div className="space-y-6">
				<StatsPanel
					wpm={engine.wpm}
					accuracy={engine.accuracy}
					progress={engine.progress}
					errorCount={engine.errorKeystrokes}
					elapsedMs={engine.elapsedMs}
					currentIndex={engine.currentIndex}
					totalChars={engine.totalChars}
				/>
				<div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-xs text-muted-foreground">
					<p className="font-semibold text-foreground">Shortcut keys</p>
					<p className="mt-2">Esc — restart the drill</p>
					<p>Enter — focus the editor</p>
					<p>Tab — insert indentation</p>
					<p className="mt-2">Keep your hands on home row for maximum flow.</p>
				</div>
				<Button variant="outline" onClick={() => router.push('/')}>
					Exit session
				</Button>
			</div>
			{engine.isComplete ? (
				<ResultsScreen
					wpm={engine.wpm}
					accuracy={engine.accuracy}
					errors={engine.errorKeystrokes}
					timeSeconds={Math.round(engine.elapsedMs / 1000)}
					onRestart={() => {
						savedAttemptRef.current = false;
						engine.reset();
					}}
					onBack={() => router.push('/')}
				/>
			) : null}
		</div>
	);
}
