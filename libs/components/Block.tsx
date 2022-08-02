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
		<div className="p-4 flex items-center border-b">
			<div className="flex-1">
				<p className="text-blue-600">{height}</p>
				<p className="text-sm">{blockAge}</p>
			</div>
			<div>
				<p>
					Hash: <span className="font-mono text-sm text-blue-600">{hash}</span>
				</p>
				<p>
					Parent:{" "}
					<span className="font-mono text-sm text-blue-600">{parentHash}</span>
				</p>
			</div>
		</div>
	);
};
