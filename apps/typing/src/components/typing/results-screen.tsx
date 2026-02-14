import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ResultsScreenProps = {
	wpm: number;
	accuracy: number;
	errors: number;
	timeSeconds: number;
	onRestart: () => void;
	onBack: () => void;
};

export function ResultsScreen({
	wpm,
	accuracy,
	errors,
	timeSeconds,
	onRestart,
	onBack,
}: ResultsScreenProps) {
	return (
		<div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-6 backdrop-blur">
			<div className="w-full max-w-lg space-y-6 rounded-2xl border border-border/60 bg-card/70 p-8 text-center">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
					<Trophy className="h-6 w-6" />
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-semibold">Run complete</h2>
					<p className="text-sm text-muted-foreground">
						Review your stats and jump into the next drill.
					</p>
				</div>
				<div className="grid gap-4 rounded-xl border border-border/60 bg-background/40 p-4 text-left text-sm">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">WPM</span>
						<span className="text-lg font-semibold">{wpm}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Accuracy</span>
						<span>{accuracy}%</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Errors</span>
						<span>{errors}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Time</span>
						<span>{timeSeconds}s</span>
					</div>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button onClick={onRestart} className="gap-2">
						<RefreshCw className="h-4 w-4" />
						Try again
					</Button>
					<Button variant="outline" onClick={onBack} className="gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to snippets
					</Button>
				</div>
			</div>
		</div>
	);
}
