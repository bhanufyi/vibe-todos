import { Compass } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-border/60 bg-card/60 p-8 text-center">
			<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
				<Compass className="h-6 w-6" />
			</div>
			<h1 className="text-2xl font-semibold">Page not found</h1>
			<p className="text-sm text-muted-foreground">
				We could not find that drill. Head back to the library.
			</p>
			<Button asChild variant="outline">
				<Link href="/">Back to library</Link>
			</Button>
		</div>
	);
}
