import type { TokenLine } from '@/lib/highlighter-types';

type CodePreviewProps = {
	tokenLines: TokenLine[];
};

export function CodePreview({ tokenLines }: CodePreviewProps) {
	return (
		<div className="space-y-1 font-mono text-sm">
			{tokenLines.map((line) => (
				<div key={line.id} className="typing-line text-muted-foreground">
					{line.chars.map((char) => {
						if (char.char === '\n') return null;
						const isTab = char.char === '\t';
						const displayChar = isTab ? ' ' : char.char;
						return (
							<span
								key={char.id}
								style={{ color: char.color ?? undefined }}
								className={isTab ? 'tab-char' : undefined}
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
