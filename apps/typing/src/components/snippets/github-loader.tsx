'use client';

import { ArrowRight, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GithubLoader() {
	const router = useRouter();
	const [url, setUrl] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = () => {
		if (!url) {
			setError('Paste a GitHub file URL to continue.');
			return;
		}
		setError('');
		router.push(`/preview?url=${encodeURIComponent(url)}`);
	};

	return (
		<div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
			<div className="flex items-center gap-3">
				<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
					<Github className="h-5 w-5" />
				</span>
				<div>
					<p className="text-sm font-medium">Bring your own GitHub file</p>
					<p className="text-xs text-muted-foreground">
						Paste a GitHub URL and get an instant typing drill.
					</p>
				</div>
			</div>
			<div className="mt-4 flex flex-col gap-3 sm:flex-row">
				<Input
					value={url}
					onChange={(event) => {
						setUrl(event.target.value);
						if (error) setError('');
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleSubmit();
						}
					}}
					placeholder="https://github.com/.../blob/main/file.ts"
					data-testid="github-url-input"
				/>
				<Button onClick={handleSubmit} className="gap-2" data-testid="github-url-submit">
					Load snippet
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>
			{error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
		</div>
	);
}
