import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { health } from './routes/health.js';
import { tasks } from './routes/tasks.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
	'*',
	cors({
		origin: ['http://localhost:3000', 'https://todos.bhanu.fyi'],
		allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);

// Routes
app.route('/health', health);
app.route('/api/tasks', tasks);

// Root route
app.get('/', (c) => {
	return c.json({
		name: 'Vibe Todos API',
		version: '0.1.0',
		endpoints: {
			health: '/health',
			tasks: '/api/tasks',
		},
	});
});

const port = Number(process.env.PORT) || 3001;

console.log(`Server is running on http://localhost:${port}`);

const server = serve({
	fetch: app.fetch,
	port,
});

// Graceful shutdown
const shutdown = () => {
	console.log('Shutting down gracefully...');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
