export interface AcalaBlock {
	__typename?: "Block";
	id: string;
	number?: any | null;
	timestamp?: any | null;
	parentHash?: string | null;
}

export type AcalaBlocks = Array<AcalaBlock | null>;
