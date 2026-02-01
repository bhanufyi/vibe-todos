'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { deleteTask } from '@/lib/api';
import { Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@vibe-todos/shared';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

interface KanbanCardProps {
	task: Task;
	index: number;
	onEdit: (task: Task) => void;
}

export function KanbanCard({ task, index, onEdit }: KanbanCardProps) {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
		},
	});

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<Card
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={`mb-2 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}
				>
					<CardHeader className="flex flex-row items-start gap-2 p-3 pb-0">
						<div {...provided.dragHandleProps} className="mt-0.5 cursor-grab text-muted-foreground">
							<GripVertical className="h-4 w-4" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-medium text-sm leading-tight truncate">{task.title}</h3>
						</div>
						<div className="flex gap-1 -mr-1 -mt-1">
							<Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)}>
								<Pencil className="h-3.5 w-3.5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-destructive hover:text-destructive"
								onClick={() => deleteMutation.mutate(task.id)}
								disabled={deleteMutation.isPending}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</Button>
						</div>
					</CardHeader>
					{task.description && (
						<CardContent className="p-3 pt-1 pl-9">
							<p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
						</CardContent>
					)}
				</Card>
			)}
		</Draggable>
	);
}
