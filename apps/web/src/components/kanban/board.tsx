'use client';

import { KanbanColumn } from '@/components/kanban/column';
import { EditTask } from '@/components/kanban/edit-task';
import { getTasks, moveTask } from '@/lib/api';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskStatus } from '@vibe-todos/shared';
import { TASK_STATUSES } from '@vibe-todos/shared';
import { useState } from 'react';

export function KanbanBoard() {
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const queryClient = useQueryClient();

	const {
		data: tasks = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: getTasks,
	});

	const moveMutation = useMutation({
		mutationFn: ({ id, status, order }: { id: string; status: TaskStatus; order: number }) =>
			moveTask(id, { status, order }),
		onMutate: async ({ id, status, order }) => {
			await queryClient.cancelQueries({ queryKey: ['tasks'] });
			const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

			queryClient.setQueryData<Task[]>(['tasks'], (old) => {
				if (!old) return old;
				return old.map((task) => (task.id === id ? { ...task, status, order } : task));
			});

			return { previousTasks };
		},
		onError: (_err, _variables, context) => {
			if (context?.previousTasks) {
				queryClient.setQueryData(['tasks'], context.previousTasks);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
	});

	const handleDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;

		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		const newStatus = destination.droppableId as TaskStatus;
		moveMutation.mutate({
			id: draggableId,
			status: newStatus,
			order: destination.index,
		});
	};

	const getTasksByStatus = (status: TaskStatus): Task[] => {
		return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<div className="text-muted-foreground">Loading tasks...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-[50vh]">
				<div className="text-destructive">Failed to load tasks. Make sure the API is running.</div>
			</div>
		);
	}

	return (
		<>
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="flex gap-4 overflow-x-auto pb-4">
					{TASK_STATUSES.map((status) => (
						<KanbanColumn
							key={status}
							status={status}
							tasks={getTasksByStatus(status)}
							onEditTask={setEditingTask}
						/>
					))}
				</div>
			</DragDropContext>
			<EditTask
				task={editingTask}
				open={!!editingTask}
				onOpenChange={(open) => !open && setEditingTask(null)}
			/>
		</>
	);
}
