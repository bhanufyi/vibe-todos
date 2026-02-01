import type { CreateTaskInput, MoveTaskInput, Task, UpdateTaskInput } from '@vibe-todos/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}${endpoint}`, {
		headers: {
			'Content-Type': 'application/json',
			...options?.headers,
		},
		...options,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: 'An error occurred' }));
		throw new Error(error.message || 'An error occurred');
	}

	return response.json();
}

export async function getTasks(): Promise<Task[]> {
	return fetchApi<Task[]>('/api/tasks');
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
	return fetchApi<Task>('/api/tasks', {
		method: 'POST',
		body: JSON.stringify(input),
	});
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
	return fetchApi<Task>(`/api/tasks/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(input),
	});
}

export async function deleteTask(id: string): Promise<void> {
	await fetchApi(`/api/tasks/${id}`, {
		method: 'DELETE',
	});
}

export async function moveTask(id: string, input: MoveTaskInput): Promise<Task> {
	return fetchApi<Task>(`/api/tasks/${id}/move`, {
		method: 'PATCH',
		body: JSON.stringify(input),
	});
}
