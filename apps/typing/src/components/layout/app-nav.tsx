'use client';

import { Code2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const navItems = [
	{ href: '/', label: 'Library' },
	{ href: '/stats', label: 'Stats' },
	{ href: '/settings', label: 'Settings' },
];

export function AppNav() {
	const pathname = usePathname();

	return (
		<header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
			<Link href="/" className="flex items-center gap-3 text-lg font-semibold">
				<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
					<Code2 className="h-5 w-5" />
				</span>
				<span className="tracking-tight">Typecode</span>
			</Link>
			<nav className="flex items-center gap-4 text-sm">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'rounded-full px-4 py-2 transition',
								isActive
									? 'bg-primary/15 text-primary'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							{item.label}
						</Link>
					);
				})}
			</nav>
		</header>
	);
}
