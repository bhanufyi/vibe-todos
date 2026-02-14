'use client';

import { useMemo, useState } from 'react';

import { SnippetCard } from '@/components/snippets/snippet-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Snippet, getDifficulties, getLanguages } from '@/lib/snippets';
import { cn } from '@/lib/utils';

type SnippetBrowserProps = {
	snippets: Snippet[];
};

export function SnippetBrowser({ snippets }: SnippetBrowserProps) {
	const [search, setSearch] = useState('');
	const [language, setLanguage] = useState('all');
	const [difficulty, setDifficulty] = useState('all');

	const languages = useMemo(() => getLanguages(), []);
	const difficulties = useMemo(() => getDifficulties(), []);

	const filtered = useMemo(() => {
		return snippets.filter((snippet) => {
			const matchesLanguage = language === 'all' || snippet.language === language;
			const matchesDifficulty = difficulty === 'all' || snippet.difficulty === difficulty;
			const matchesSearch = snippet.title.toLowerCase().includes(search.toLowerCase());
			return matchesLanguage && matchesDifficulty && matchesSearch;
		});
	}, [difficulty, language, search, snippets]);

	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">Algorithm library</h2>
					<p className="text-sm text-muted-foreground">
						Curated data structure drills across multiple languages.
					</p>
				</div>
				<div className="w-full max-w-sm">
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search snippets"
						data-testid="snippet-search"
					/>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex flex-wrap items-center gap-2" data-testid="filter-language">
					{languages.map((lang) => (
						<Button
							key={lang}
							variant={language === lang ? 'secondary' : 'ghost'}
							size="sm"
							onClick={() => setLanguage(lang)}
							className={cn('capitalize')}
						>
							{lang}
						</Button>
					))}
				</div>
				<div className="flex flex-wrap items-center gap-2" data-testid="filter-difficulty">
					{difficulties.map((level) => (
						<Button
							key={level}
							variant={difficulty === level ? 'secondary' : 'ghost'}
							size="sm"
							onClick={() => setDifficulty(level)}
							className={cn('capitalize')}
						>
							{level}
						</Button>
					))}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" data-testid="snippet-grid">
				{filtered.map((snippet) => (
					<SnippetCard key={snippet.id} snippet={snippet} />
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
					No snippets match your filters yet.
				</div>
			) : null}
		</section>
	);
}
