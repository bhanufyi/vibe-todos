import { SNIPPETS, type Snippet } from '@/data/snippets';

export { SNIPPETS, type Snippet };

export function getSnippetById(id: string | null | undefined) {
	if (!id) return null;
	return SNIPPETS.find((snippet) => snippet.id === id) ?? null;
}

export function normalizeCode(code: string) {
	return code.replace(/\r\n/g, '\n');
}

export function getSnippetStats(code: string) {
	const normalized = normalizeCode(code);
	const lines = normalized.split('\n');
	const lineCount = Math.max(1, lines[lines.length - 1] === '' ? lines.length - 1 : lines.length);
	const charCount = normalized.replace(/\n/g, '').length;
	const wordCount = Math.max(1, Math.ceil(charCount / 5));
	const estimatedSeconds = Math.max(10, Math.round((wordCount / 40) * 60));

	return {
		lineCount,
		charCount,
		wordCount,
		estimatedSeconds,
	};
}

export function getLanguages() {
	const languages = new Set(SNIPPETS.map((snippet) => snippet.language));
	return ['all', ...Array.from(languages).sort()];
}

export function getDifficulties() {
	return ['all', 'easy', 'medium', 'hard'] as const;
}

export function formatSeconds(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const remainder = seconds % 60;
	if (minutes === 0) return `${remainder}s`;
	return `${minutes}m ${remainder}s`;
}
