import { normalizeCode } from '@/lib/snippets';

const GITHUB_HOST = 'github.com';
const RAW_HOST = 'raw.githubusercontent.com';

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
	ts: 'typescript',
	tsx: 'tsx',
	js: 'javascript',
	jsx: 'jsx',
	py: 'python',
	go: 'go',
	rs: 'rust',
	java: 'java',
	c: 'c',
	cpp: 'cpp',
	h: 'c',
	cs: 'csharp',
	json: 'json',
	md: 'markdown',
	yaml: 'yaml',
	yml: 'yaml',
};

export type GithubSnippet = {
	code: string;
	language: string;
	filename: string;
	rawUrl: string;
	sourceUrl: string;
};

export function getLanguageFromFilename(filename: string) {
	const parts = filename.split('.');
	const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
	return LANGUAGE_BY_EXTENSION[ext] ?? 'text';
}

export function normalizeGithubUrl(input: string) {
	let url: URL;
	try {
		url = new URL(input);
	} catch {
		return null;
	}

	if (url.hostname === RAW_HOST) {
		const segments = url.pathname.split('/').filter(Boolean);
		if (segments.length < 4) return null;
		const filename = segments[segments.length - 1];
		return { rawUrl: url.toString(), filename };
	}

	if (url.hostname !== GITHUB_HOST) return null;
	const segments = url.pathname.split('/').filter(Boolean);
	if (segments.length < 5) return null;
	const [owner, repo] = segments;
	const blobIndex = segments.indexOf('blob');
	if (blobIndex === -1 || segments.length <= blobIndex + 2) return null;
	const branch = segments[blobIndex + 1];
	const filePath = segments.slice(blobIndex + 2).join('/');
	if (!filePath) return null;
	const filename = filePath.split('/').pop() ?? 'snippet';
	const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
	return { rawUrl, filename };
}

export async function fetchGithubSnippet(sourceUrl: string): Promise<GithubSnippet> {
	const normalized = normalizeGithubUrl(sourceUrl);
	if (!normalized) {
		throw new Error('Invalid GitHub file URL.');
	}

	const response = await fetch(normalized.rawUrl, { cache: 'no-store' });
	if (!response.ok) {
		throw new Error('Unable to fetch file from GitHub.');
	}

	const text = await response.text();
	const code = normalizeCode(text);

	return {
		code,
		language: getLanguageFromFilename(normalized.filename),
		filename: normalized.filename,
		rawUrl: normalized.rawUrl,
		sourceUrl,
	};
}
