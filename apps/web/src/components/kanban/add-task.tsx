'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createTask } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TaskStatus } from '@vibe-todos/shared';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface AddTaskProps {
	status: TaskStatus;
}

export function AddTask({ status }: AddTaskProps) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			setOpen(false);
			setTitle('');
			setDescription('');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		mutation.mutate({
			title: title.trim(),
			description: description.trim() || undefined,
			status,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2 text-muted-foreground"
				>
					<Plus className="h-4 w-4" />
					Add task
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add new task</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<label htmlFor="title" className="text-sm font-medium">
								Title
							</label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter task title..."
								autoFocus
							/>
						</div>
						<div className="grid gap-2">
							<label htmlFor="description" className="text-sm font-medium">
								Description (optional)
							</label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter task description..."
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!title.trim() || mutation.isPending}>
							{mutation.isPending ? 'Adding...' : 'Add task'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
