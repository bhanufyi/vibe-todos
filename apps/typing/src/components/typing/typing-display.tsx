'use client';

import { useEffect, useRef } from 'react';

import type { TokenLine } from '@/lib/highlighter-types';
import { cn } from '@/lib/utils';

type TypingDisplayProps = {
	tokenLines: TokenLine[];
	currentIndex: number;
	errorIndices: Set<number>;
};

export function TypingDisplay({ tokenLines, currentIndex, errorIndices }: TypingDisplayProps) {
	const currentCharRef = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		if (currentIndex < 0) return;
		currentCharRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' });
	}, [currentIndex]);

	let globalIndex = 0;

	return (
		<div className="space-y-1 font-mono">
			{tokenLines.map((line) => (
				<div key={line.id} className="typing-line">
					{line.chars.map((char) => {
						const index = globalIndex;
						globalIndex += 1;
						const isTyped = index < currentIndex;
						const isCurrent = index === currentIndex;
						const isError = errorIndices.has(index);
						const isTab = char.char === '\t';
						const isNewline = char.char === '\n';
						const displayChar = isNewline ? '' : isTab ? ' ' : char.char;

						const style = isError ? undefined : { color: char.color ?? undefined };

						return (
							<span
								key={char.id}
								ref={isCurrent ? currentCharRef : null}
								className={cn(
									'typing-char',
									isTyped && 'typed',
									isError && 'error',
									isCurrent && 'cursor',
									isTab && 'tab-char',
									isNewline && 'newline-char'
								)}
								style={style}
							>
								{displayChar}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
}
