import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]',
	{
		variants: {
			variant: {
				default: 'border-border/60 text-muted-foreground',
				primary: 'border-primary/40 text-primary',
				accent: 'border-accent/40 text-accent-foreground bg-accent/20',
				muted: 'border-border/40 text-muted-foreground bg-muted/20',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
