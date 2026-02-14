import 'server-only';

import { type Highlighter, type ThemedToken, getHighlighter } from 'shiki';

import type { TokenChar, TokenLine } from '@/lib/highlighter-types';
import { normalizeCode } from '@/lib/snippets';

const THEME = 'github-dark';
const LANGUAGES = [
	'typescript',
	'javascript',
	'tsx',
	'jsx',
	'python',
	'go',
	'rust',
	'java',
	'c',
	'cpp',
	'json',
	'markdown',
	'yaml',
	'text',
];

let highlighterPromise: Promise<Highlighter> | null = null;

type HighlighterLang = NonNullable<Parameters<Highlighter['codeToTokensBase']>[1]['lang']>;

async function getShikiHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = getHighlighter({ themes: [THEME], langs: LANGUAGES });
	}

	return highlighterPromise;
}

function resolveLanguage(language: string, highlighter: Highlighter) {
	const loaded =
		'getLoadedLanguages' in highlighter
			? (highlighter as { getLoadedLanguages: () => string[] }).getLoadedLanguages()
			: LANGUAGES;
	return loaded.includes(language) ? language : 'text';
}

export async function highlightToHtml(code: string, language: string) {
	const highlighter = await getShikiHighlighter();
	const normalized = normalizeCode(code);
	const lang = resolveLanguage(language, highlighter) as HighlighterLang;
	return highlighter.codeToHtml(normalized, { lang, theme: THEME });
}

export async function tokenizeCode(code: string, language: string): Promise<TokenLine[]> {
	const highlighter = await getShikiHighlighter();
	const normalized = normalizeCode(code);
	const lang = resolveLanguage(language, highlighter) as HighlighterLang;
	const tokens = await highlighter.codeToTokensBase(normalized, { lang, theme: THEME });
	const lines = normalized.split('\n');
	return tokens.map((line, lineIndex) => {
		const chars = expandTokens(line, lineIndex);
		if (lineIndex < lines.length - 1) {
			chars.push({
				id: `line-${lineIndex}-newline`,
				char: '\n',
				color: null,
			});
		}
		return {
			id: `line-${lineIndex}`,
			chars,
		};
	});
}

function expandTokens(tokens: ThemedToken[], lineIndex: number) {
	const chars: TokenChar[] = [];
	let charIndex = 0;
	for (const token of tokens) {
		for (const char of token.content) {
			chars.push({
				id: `line-${lineIndex}-char-${charIndex}`,
				char,
				color: token.color ?? null,
			});
			charIndex += 1;
		}
	}
	return chars;
}
