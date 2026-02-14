'use client';

import { TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTypingHistory } from '@/lib/use-typing-history';

function formatDate(value: string) {
	const date = new Date(value);
	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export default function StatsPage() {
	const { history, clearHistory } = useTypingHistory();

	const totalAttempts = history.length;
	const bestWpm = history.reduce((max, attempt) => Math.max(max, attempt.wpm), 0);
	const averageWpm = totalAttempts
		? Math.round(history.reduce((sum, attempt) => sum + attempt.wpm, 0) / totalAttempts)
		: 0;
	const averageAccuracy = totalAttempts
		? Math.round(history.reduce((sum, attempt) => sum + attempt.accuracy, 0) / totalAttempts)
		: 0;
	const totalSeconds = history.reduce((sum, attempt) => sum + attempt.timeSeconds, 0);

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-semibold">Stats</h1>
					<p className="text-sm text-muted-foreground">Track your speed improvements over time.</p>
				</div>
				<Button variant="outline" onClick={clearHistory}>
					Clear history
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardContent className="space-y-2">
						<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sessions</p>
						<p className="text-2xl font-semibold">{totalAttempts}</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-2">
						<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Best WPM</p>
						<p className="text-2xl font-semibold">{bestWpm}</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-2">
						<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Avg WPM</p>
						<p className="text-2xl font-semibold">{averageWpm}</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="space-y-2">
						<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Accuracy</p>
						<p className="text-2xl font-semibold">{averageAccuracy}%</p>
					</CardContent>
				</Card>
			</div>

			<div className="rounded-2xl border border-border/60 bg-card/60 p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">History</h2>
					<span className="flex items-center gap-2 text-xs text-muted-foreground">
						<TrendingUp className="h-3 w-3" />
						{Math.round(totalSeconds / 60)} minutes practiced
					</span>
				</div>
				<div className="mt-4 space-y-3" data-testid="stats-history">
					{history.length === 0 ? (
						<p className="text-sm text-muted-foreground">No runs yet. Start a drill.</p>
					) : null}
					{history.map((attempt) => (
						<div
							key={attempt.id}
							className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
						>
							<div>
								<p className="font-semibold">{attempt.snippetTitle}</p>
								<p className="text-xs text-muted-foreground">
									{attempt.language} · {formatDate(attempt.createdAt)}
								</p>
							</div>
							<div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
								<span>{attempt.wpm} wpm</span>
								<span>{attempt.accuracy}%</span>
								<span>{attempt.timeSeconds}s</span>
								<span>{attempt.errors} errors</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
