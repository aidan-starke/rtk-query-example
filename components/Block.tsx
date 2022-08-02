import { FC, useMemo } from "react";
import moment from "moment";

interface BlockProps {
	hash: string;
	height: number | null | undefined;
	timestamp: string | null | undefined;
	parentHash: string | null | undefined;
}

export const Block: FC<BlockProps> = ({
	hash,
	height,
	timestamp,
	parentHash,
}) => {
	const blockAge = useMemo<string | undefined>(
		() => moment(timestamp).fromNow(),
		[timestamp]
	);

	return (
		<div className="p-4 flex items-center">
			<div className="flex-1">
				<p>{height}</p>
				<p>{blockAge}</p>
			</div>
			<div className="font-mono">
				<p>Hash: {hash}</p>
				<p>Parent: {parentHash}</p>
			</div>
		</div>
	);
};
