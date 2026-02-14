import { Gauge, Timer } from 'lucide-react';

import { Progress } from '@/components/ui/progress';

type StatsPanelProps = {
	wpm: number;
	accuracy: number;
	progress: number;
	errorCount: number;
	elapsedMs: number;
	currentIndex: number;
	totalChars: number;
};

export function StatsPanel({
	wpm,
	accuracy,
	progress,
	errorCount,
	elapsedMs,
	currentIndex,
	totalChars,
}: StatsPanelProps) {
	const elapsedSeconds = Math.round(elapsedMs / 1000);

	return (
		<div className="space-y-5 rounded-2xl border border-border/60 bg-card/60 p-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Speed</p>
					<p className="text-3xl font-semibold" data-testid="stats-wpm">
						{wpm}
					</p>
					<p className="text-xs text-muted-foreground">Words per minute</p>
				</div>
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
					<Gauge className="h-5 w-5 text-muted-foreground" />
				</div>
			</div>

			<div className="grid gap-4 text-sm">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Accuracy</span>
					<span data-testid="stats-accuracy">{accuracy}%</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Errors</span>
					<span data-testid="stats-errors">{errorCount}</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Progress</span>
					<span data-testid="stats-progress">
						{currentIndex}/{totalChars}
					</span>
				</div>
			</div>

			<div className="space-y-2">
				<Progress value={progress} data-testid="progress-bar" />
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span data-testid="progress-value">{progress}%</span>
					<span className="flex items-center gap-1" data-testid="elapsed-time">
						<Timer className="h-3 w-3" />
						{elapsedSeconds}s
					</span>
				</div>
			</div>
		</div>
	);
}
