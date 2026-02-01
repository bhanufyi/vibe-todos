'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateTask } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@vibe-todos/shared';
import { useEffect, useState } from 'react';

interface EditTaskProps {
	task: Task | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTask({ task, open, onOpenChange }: EditTaskProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const queryClient = useQueryClient();

	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description || '');
		}
	}, [task]);

	const mutation = useMutation({
		mutationFn: (data: { title: string; description: string | null }) => updateTask(task!.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tasks'] });
			onOpenChange(false);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !task) return;

		mutation.mutate({
			title: title.trim(),
			description: description.trim() || null,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Edit task</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<label htmlFor="edit-title" className="text-sm font-medium">
								Title
							</label>
							<Input
								id="edit-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter task title..."
								autoFocus
							/>
						</div>
						<div className="grid gap-2">
							<label htmlFor="edit-description" className="text-sm font-medium">
								Description (optional)
							</label>
							<Textarea
								id="edit-description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter task description..."
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={!title.trim() || mutation.isPending}>
							{mutation.isPending ? 'Saving...' : 'Save changes'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
