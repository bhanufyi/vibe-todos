import { ArrowLeft, ArrowUpRight, Code2 } from 'lucide-react';
import Link from 'next/link';

import { CodePreview } from '@/components/common/code-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchGithubSnippet } from '@/lib/github';
import { tokenizeCode } from '@/lib/highlighter';
import { formatSeconds, getSnippetById, getSnippetStats } from '@/lib/snippets';

type PreviewPageProps = {
	searchParams?: Promise<{
		id?: string;
		url?: string;
	}>;
};

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
	const params = searchParams ? await searchParams : {};
	const snippetId = params.id;
	const snippetUrl = params.url;

	let snippet = null as {
		id: string;
		title: string;
		language: string;
		code: string;
		source?: string;
		sourceUrl?: string;
		filename?: string;
	} | null;

	if (snippetId) {
		const item = getSnippetById(snippetId);
		if (item) {
			snippet = {
				id: item.id,
				title: item.title,
				language: item.language,
				code: item.code,
				source: item.source,
				sourceUrl: item.sourceUrl,
			};
		}
	}

	if (!snippet && snippetUrl) {
		try {
			const fetched = await fetchGithubSnippet(snippetUrl);
			snippet = {
				id: 'github',
				title: fetched.filename,
				language: fetched.language,
				code: fetched.code,
				source: 'GitHub',
				sourceUrl: fetched.sourceUrl,
				filename: fetched.filename,
			};
		} catch {
			snippet = null;
		}
	}

	if (!snippet) {
		return (
			<div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-border/60 bg-card/60 p-8 text-center">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/40">
					<Code2 className="h-6 w-6 text-muted-foreground" />
				</div>
				<h1 className="text-2xl font-semibold">Snippet not found</h1>
				<p className="text-sm text-muted-foreground">
					That file could not be loaded. Double-check the URL or pick a curated drill.
				</p>
				<Button asChild variant="outline">
					<Link href="/">Back to library</Link>
				</Button>
			</div>
		);
	}

	const stats = getSnippetStats(snippet.code);
	const tokenLines = await tokenizeCode(snippet.code, snippet.language);
	const practiceUrl = snippetId
		? `/practice?source=library&id=${snippetId}`
		: `/practice?source=github&url=${encodeURIComponent(snippetUrl ?? '')}`;

	return (
		<div className="space-y-8">
			<Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
				<ArrowLeft className="h-4 w-4" />
				Back to library
			</Link>
			<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="space-y-3">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="muted">{snippet.language}</Badge>
						<Badge variant="primary">{stats.lineCount} lines</Badge>
						<Badge variant="muted">{stats.charCount} chars</Badge>
						<Badge variant="accent">{formatSeconds(stats.estimatedSeconds)}</Badge>
					</div>
					<h1 className="text-3xl font-semibold tracking-tight">{snippet.title}</h1>
					<p className="text-sm text-muted-foreground">
						{snippet.source ?? 'Curated drill'}
						{snippet.filename ? ` · ${snippet.filename}` : ''}
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Button asChild size="lg" className="gap-2">
						<Link href={practiceUrl}>
							Start typing
							<ArrowUpRight className="h-4 w-4" />
						</Link>
					</Button>
					{snippet.sourceUrl ? (
						<Button asChild variant="outline" size="lg">
							<Link href={snippet.sourceUrl} target="_blank" rel="noreferrer">
								View source
							</Link>
						</Button>
					) : null}
				</div>
			</div>
			<div className="code-panel overflow-hidden">
				<div className="code-header">Preview</div>
				<div className="preview-code px-6 pb-6 pt-4" data-testid="snippet-preview">
					<CodePreview tokenLines={tokenLines} />
				</div>
			</div>
		</div>
	);
}
