import { Registry, collectDefaultMetrics } from 'prom-client';

type MetricsRegistry = Registry & { contentType: string };

const globalForMetrics = globalThis as typeof globalThis & {
	__typingMetricsRegistry?: MetricsRegistry;
};

const registry = globalForMetrics.__typingMetricsRegistry ?? new Registry();

if (!globalForMetrics.__typingMetricsRegistry) {
	collectDefaultMetrics({ register: registry });
	globalForMetrics.__typingMetricsRegistry = registry;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
	const body = await registry.metrics();
	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': registry.contentType,
		},
	});
}
