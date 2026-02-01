import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_INTERNAL_URL = process.env.API_INTERNAL_URL || 'http://localhost:3001';

export async function GET() {
	const response = await fetch(`${API_INTERNAL_URL}/api/tasks`, {
		cache: 'no-store',
	});

	const data = await response.json();
	return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	const response = await fetch(`${API_INTERNAL_URL}/api/tasks`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	const data = await response.json();
	return NextResponse.json(data, { status: response.status });
}
