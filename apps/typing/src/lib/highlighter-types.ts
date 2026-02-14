export type TokenChar = {
	id: string;
	char: string;
	color: string | null;
};

export type TokenLine = {
	id: string;
	chars: TokenChar[];
};
