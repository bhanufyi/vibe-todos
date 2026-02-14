import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_INTERNAL_URL = process.env.API_INTERNAL_URL || 'http://localhost:3001';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const body = await request.json();
	const response = await fetch(`${API_INTERNAL_URL}/api/tasks/${id}/move`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	const data = await response.json();
	return NextResponse.json(data, { status: response.status });
}
