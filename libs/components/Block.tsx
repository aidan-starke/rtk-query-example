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
			<div className="flex flex-1 space-x-2">
				<div className="bg-gray-300 h-12 w-12 flex items-center rounded">
					<p className="text-center w-full">Bk</p>
				</div>
				<div>
					<a
						className="text-blue-600"
						href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
					>
						{height}
					</a>
					<p className="text-sm">{blockAge}</p>
				</div>
			</div>
			<div className="text-sm space-y-px">
				<p>
					Hash: <span className="font-mono text-gray-500">{hash}</span>
				</p>
				<p>
					Parent: <span className="font-mono text-gray-500">{parentHash}</span>
				</p>
			</div>
		</div>
	);
};
