import { KanbanBoard } from '@/components/kanban/board';

export default function Home() {
	return (
		<main className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<header className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Vibe Todos</h1>
					<p className="text-muted-foreground mt-1">
						Organize your tasks with a simple kanban board
					</p>
				</header>
				<KanbanBoard />
			</div>
		</main>
	);
}
