import type * as React from 'react';

import { cn } from '@/lib/utils';

type SwitchProps = React.ComponentProps<'button'> & {
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
};

function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			data-state={checked ? 'checked' : 'unchecked'}
			className={cn(
				'relative inline-flex h-6 w-11 items-center rounded-full border border-border/60 bg-muted/40 transition',
				checked && 'bg-primary/25',
				className
			)}
			onClick={() => onCheckedChange(!checked)}
			{...props}
		>
			<span
				className={cn(
					'inline-block h-4 w-4 translate-x-1 rounded-full bg-foreground transition',
					checked && 'translate-x-6 bg-primary'
				)}
			/>
		</button>
	);
}

export { Switch };
