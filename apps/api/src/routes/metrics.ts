import { Hono } from 'hono';
import { Registry, collectDefaultMetrics } from 'prom-client';

type MetricsRegistry = Registry & { contentType: string };

const globalForMetrics = globalThis as typeof globalThis & {
	__apiMetricsRegistry?: MetricsRegistry;
};

const registry = globalForMetrics.__apiMetricsRegistry ?? new Registry();

if (!globalForMetrics.__apiMetricsRegistry) {
	collectDefaultMetrics({ register: registry });
	globalForMetrics.__apiMetricsRegistry = registry;
}

const metrics = new Hono();

metrics.get('/', async (c) => {
	c.header('Content-Type', registry.contentType);
	return c.text(await registry.metrics());
});

export { metrics };
