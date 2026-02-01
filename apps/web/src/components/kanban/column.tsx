'use client';

import { AddTask } from '@/components/kanban/add-task';
import { KanbanCard } from '@/components/kanban/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Droppable } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '@vibe-todos/shared';
import { TASK_STATUS_LABELS } from '@vibe-todos/shared';

interface KanbanColumnProps {
	status: TaskStatus;
	tasks: Task[];
	onEditTask: (task: Task) => void;
}

const columnColors: Record<TaskStatus, string> = {
	todo: 'bg-slate-100 dark:bg-slate-800',
	in_progress: 'bg-blue-50 dark:bg-blue-950',
	done: 'bg-green-50 dark:bg-green-950',
};

const headerColors: Record<TaskStatus, string> = {
	todo: 'bg-slate-200 dark:bg-slate-700',
	in_progress: 'bg-blue-100 dark:bg-blue-900',
	done: 'bg-green-100 dark:bg-green-900',
};

export function KanbanColumn({ status, tasks, onEditTask }: KanbanColumnProps) {
	return (
		<div className={`flex flex-col rounded-lg ${columnColors[status]} min-w-[300px] w-[300px]`}>
			<div className={`px-3 py-2 rounded-t-lg ${headerColors[status]}`}>
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-sm">{TASK_STATUS_LABELS[status]}</h2>
					<span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
						{tasks.length}
					</span>
				</div>
			</div>
			<Droppable droppableId={status}>
				{(provided, snapshot) => (
					<ScrollArea className="flex-1 h-[calc(100vh-220px)]">
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={`p-2 min-h-[200px] transition-colors ${
								snapshot.isDraggingOver ? 'bg-primary/5' : ''
							}`}
						>
							{tasks.map((task, index) => (
								<KanbanCard key={task.id} task={task} index={index} onEdit={onEditTask} />
							))}
							{provided.placeholder}
						</div>
					</ScrollArea>
				)}
			</Droppable>
			<div className="p-2 border-t border-border/50">
				<AddTask status={status} />
			</div>
		</div>
	);
}
