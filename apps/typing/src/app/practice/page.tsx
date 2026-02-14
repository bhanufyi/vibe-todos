import { notFound } from 'next/navigation';

import { TypingPractice } from '@/components/typing/typing-practice';
import { fetchGithubSnippet } from '@/lib/github';
import { tokenizeCode } from '@/lib/highlighter';
import { getSnippetById } from '@/lib/snippets';

type PracticePageProps = {
	searchParams?: Promise<{
		source?: 'library' | 'github';
		id?: string;
		url?: string;
	}>;
};

export default async function PracticePage({ searchParams }: PracticePageProps) {
	const params = searchParams ? await searchParams : {};
	const source = params.source ?? 'library';
	const snippetId = params.id;
	const snippetUrl = params.url;

	if (source === 'library') {
		const snippet = getSnippetById(snippetId);
		if (!snippet) return notFound();
		const tokenLines = await tokenizeCode(snippet.code, snippet.language);

		return (
			<TypingPractice
				snippetId={snippet.id}
				snippetTitle={snippet.title}
				language={snippet.language}
				code={snippet.code}
				tokenLines={tokenLines}
				source="library"
			/>
		);
	}

	if (source === 'github' && snippetUrl) {
		try {
			const fetched = await fetchGithubSnippet(snippetUrl);
			const tokenLines = await tokenizeCode(fetched.code, fetched.language);
			return (
				<TypingPractice
					snippetId="github"
					snippetTitle={fetched.filename}
					language={fetched.language}
					code={fetched.code}
					tokenLines={tokenLines}
					source="github"
				/>
			);
		} catch {
			return notFound();
		}
	}

	return notFound();
}
