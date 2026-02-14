import type * as React from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = React.ComponentProps<'div'> & {
	value: number;
};

function Progress({ className, value, ...props }: ProgressProps) {
	return (
		<div
			data-slot="progress"
			className={cn('h-2 w-full overflow-hidden rounded-full bg-muted/40', className)}
			{...props}
		>
			<div
				data-slot="progress-indicator"
				className="h-full rounded-full bg-primary transition-all"
				style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
			/>
		</div>
	);
}

export { Progress };
