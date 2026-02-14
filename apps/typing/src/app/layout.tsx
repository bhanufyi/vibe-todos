import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';

import { AppNav } from '@/components/layout/app-nav';
import { cn } from '@/lib/utils';

import './globals.css';

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space-grotesk',
	display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Typecode',
	description: 'Practice typing real code snippets with instant feedback.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={cn(spaceGrotesk.variable, jetBrainsMono.variable, 'dark')}>
			<body className="app-shell min-h-screen bg-background text-foreground">
				<div className="relative">
					<div className="pointer-events-none absolute inset-0 -z-10">
						<div className="absolute left-[-20%] top-[-30%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,oklch(0.35_0.2_260/0.45),transparent_60%)]" />
						<div className="absolute right-[-25%] top-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.5_0.2_210/0.25),transparent_60%)]" />
						<div className="absolute bottom-[-30%] left-[10%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,oklch(0.4_0.2_320/0.2),transparent_65%)]" />
					</div>
					<AppNav />
					<main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6">{children}</main>
				</div>
			</body>
		</html>
	);
}
