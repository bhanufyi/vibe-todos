import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString =
	process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/todoapp';

const migrationClient = postgres(connectionString, { max: 1 });

async function runMigrations() {
	console.log('Running migrations...');

	const db = drizzle(migrationClient);
	await migrate(db, { migrationsFolder: './drizzle' });

	console.log('Migrations completed!');
	await migrationClient.end();
	process.exit(0);
}

runMigrations().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
