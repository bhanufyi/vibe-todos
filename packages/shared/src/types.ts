export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
	id: string;
	title: string;
	description: string | null;
	status: TaskStatus;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateTaskInput {
	title: string;
	description?: string;
	status?: TaskStatus;
}

export interface UpdateTaskInput {
	title?: string;
	description?: string | null;
	status?: TaskStatus;
}

export interface MoveTaskInput {
	status: TaskStatus;
	order: number;
}

export interface ApiResponse<T> {
	data: T;
	success: boolean;
}

export interface ApiError {
	message: string;
	code?: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
	todo: 'Todo',
	in_progress: 'In Progress',
	done: 'Done',
};

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];
