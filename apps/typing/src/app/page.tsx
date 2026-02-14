import { ArrowUpRight, Keyboard } from 'lucide-react';
import Link from 'next/link';

import { GithubLoader } from '@/components/snippets/github-loader';
import { SnippetBrowser } from '@/components/snippets/snippet-browser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SNIPPETS } from '@/data/snippets';
import { formatSeconds, getSnippetStats } from '@/lib/snippets';

export default function HomePage() {
	const featured = SNIPPETS[0];
	const stats = getSnippetStats(featured.code);
	const languages = new Set(SNIPPETS.map((snippet) => snippet.language));

	return (
		<div className="space-y-16">
			<section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="space-y-6">
					<div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
						<Keyboard className="h-4 w-4" />
						<span>practice loop</span>
					</div>
					<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
						Type real algorithms. Build speed you can feel.
					</h1>
					<p className="text-base text-muted-foreground sm:text-lg">
						A typing dojo for engineers. Drill data structures, measure accuracy, and stay in flow
						with instant feedback.
					</p>
					<div className="flex flex-wrap items-center gap-3">
						<Button asChild size="lg" className="gap-2">
							<Link href={`/preview?id=${featured.id}`}>
								Start with {featured.title}
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link href="#library">Browse library</Link>
						</Button>
					</div>
					<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
						<span>{SNIPPETS.length} curated drills</span>
						<span>{languages.size} languages</span>
						<span>Stop-on-error mode</span>
					</div>
				</div>
				<div className="code-panel overflow-hidden">
					<div className="code-header">Featured snippet</div>
					<div className="space-y-4 px-6 pb-6 pt-4">
						<div className="flex items-center gap-3">
							<Badge variant="muted">{featured.language}</Badge>
							<Badge variant="primary">{featured.difficulty}</Badge>
							<span className="text-xs text-muted-foreground">
								{stats.lineCount} lines · {stats.charCount} chars
							</span>
						</div>
						<pre className="font-mono text-sm text-muted-foreground">
							{featured.code.split('\n').slice(0, 6).join('\n')}
						</pre>
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>Ready in {formatSeconds(stats.estimatedSeconds)}</span>
							<Link
								className="flex items-center gap-2 text-primary"
								href={`/preview?id=${featured.id}`}
							>
								Open drill
								<ArrowUpRight className="h-3 w-3" />
							</Link>
						</div>
					</div>
				</div>
			</section>

			<GithubLoader />

			<div id="library">
				<SnippetBrowser snippets={SNIPPETS} />
			</div>
		</div>
	);
}
