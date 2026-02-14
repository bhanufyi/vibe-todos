import { zValidator } from '@hono/zod-validator';
import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';

const tasks = new Hono();

const createTaskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['todo', 'in_progress', 'done']).optional().default('todo'),
});

const updateTaskSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().nullable().optional(),
	status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

const moveTaskSchema = z.object({
	status: z.enum(['todo', 'in_progress', 'done']),
	order: z.number().int().min(0),
});

// Get all tasks
tasks.get('/', async (c) => {
	const allTasks = await db.select().from(schema.tasks).orderBy(schema.tasks.order);
	return c.json(allTasks);
});

// Create a task
tasks.post('/', zValidator('json', createTaskSchema), async (c) => {
	const body = c.req.valid('json');

	// Get the max order for the status
	const maxOrderResult = await db
		.select({ maxOrder: sql<number>`COALESCE(MAX(${schema.tasks.order}), -1)` })
		.from(schema.tasks)
		.where(eq(schema.tasks.status, body.status));

	const newOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

	const [newTask] = await db
		.insert(schema.tasks)
		.values({
			title: body.title,
			description: body.description,
			status: body.status,
			order: newOrder,
		})
		.returning();

	return c.json(newTask, 201);
});

// Update a task
tasks.patch('/:id', zValidator('json', updateTaskSchema), async (c) => {
	const id = c.req.param('id');
	const body = c.req.valid('json');

	const [updatedTask] = await db
		.update(schema.tasks)
		.set({
			...body,
			updatedAt: new Date(),
		})
		.where(eq(schema.tasks.id, id))
		.returning();

	if (!updatedTask) {
		return c.json({ message: 'Task not found' }, 404);
	}

	return c.json(updatedTask);
});

// Delete a task
tasks.delete('/:id', async (c) => {
	const id = c.req.param('id');

	const [deletedTask] = await db.delete(schema.tasks).where(eq(schema.tasks.id, id)).returning();

	if (!deletedTask) {
		return c.json({ message: 'Task not found' }, 404);
	}

	return c.json({ success: true });
});

// Move/reorder a task
tasks.patch('/:id/move', zValidator('json', moveTaskSchema), async (c) => {
	const id = c.req.param('id');
	const { status: newStatus, order: newOrder } = c.req.valid('json');

	// Get the current task
	const [currentTask] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));

	if (!currentTask) {
		return c.json({ message: 'Task not found' }, 404);
	}

	const oldStatus = currentTask.status;
	const oldOrder = currentTask.order;

	// If moving within the same column
	if (oldStatus === newStatus) {
		if (newOrder > oldOrder) {
			// Moving down: shift tasks up
			await db
				.update(schema.tasks)
				.set({ order: sql`${schema.tasks.order} - 1` })
				.where(
					and(
						eq(schema.tasks.status, newStatus),
						gt(schema.tasks.order, oldOrder),
						lte(schema.tasks.order, newOrder)
					)
				);
		} else if (newOrder < oldOrder) {
			// Moving up: shift tasks down
			await db
				.update(schema.tasks)
				.set({ order: sql`${schema.tasks.order} + 1` })
				.where(
					and(
						eq(schema.tasks.status, newStatus),
						gte(schema.tasks.order, newOrder),
						lt(schema.tasks.order, oldOrder)
					)
				);
		}
	} else {
		// Moving to a different column
		// Shift tasks up in old column
		await db
			.update(schema.tasks)
			.set({ order: sql`${schema.tasks.order} - 1` })
			.where(and(eq(schema.tasks.status, oldStatus), gt(schema.tasks.order, oldOrder)));

		// Shift tasks down in new column
		await db
			.update(schema.tasks)
			.set({ order: sql`${schema.tasks.order} + 1` })
			.where(and(eq(schema.tasks.status, newStatus), gte(schema.tasks.order, newOrder)));
	}

	// Update the task
	const [updatedTask] = await db
		.update(schema.tasks)
		.set({
			status: newStatus,
			order: newOrder,
			updatedAt: new Date(),
		})
		.where(eq(schema.tasks.id, id))
		.returning();

	return c.json(updatedTask);
});

export { tasks };
