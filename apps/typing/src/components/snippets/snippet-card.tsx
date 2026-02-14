import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type Snippet, getSnippetStats } from '@/lib/snippets';

type SnippetCardProps = {
	snippet: Snippet;
};

const difficultyVariant: Record<string, string> = {
	easy: 'primary',
	medium: 'muted',
	hard: 'accent',
};

export function SnippetCard({ snippet }: SnippetCardProps) {
	const stats = getSnippetStats(snippet.code);

	return (
		<Card
			className="group border-border/60 bg-card/70 backdrop-blur transition hover:-translate-y-1 hover:border-primary/40"
			data-testid="snippet-card"
			data-snippet-id={snippet.id}
		>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<Badge variant="muted">{snippet.language}</Badge>
					<Badge variant={difficultyVariant[snippet.difficulty] as 'primary' | 'accent' | 'muted'}>
						{snippet.difficulty}
					</Badge>
				</div>
				<div>
					<h3 className="text-lg font-semibold tracking-tight">{snippet.title}</h3>
					<p className="text-sm text-muted-foreground">{snippet.category}</p>
				</div>
				<div className="text-xs text-muted-foreground">
					<span>{stats.lineCount} lines</span>
					<span className="px-2">•</span>
					<span>{stats.charCount} chars</span>
				</div>
			</CardContent>
			<CardFooter className="justify-between">
				<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
					{snippet.source ?? 'Community'}
				</span>
				<Button asChild size="sm">
					<Link href={`/preview?id=${snippet.id}`}>Preview</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
