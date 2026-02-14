import { NextResponse } from 'next/server';

import { fetchGithubSnippet } from '@/lib/github';

export async function GET(request: Request) {
	const url = new URL(request.url).searchParams.get('url');
	if (!url) {
		return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
	}

	try {
		const snippet = await fetchGithubSnippet(url);
		return NextResponse.json(snippet);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to fetch snippet.';
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
