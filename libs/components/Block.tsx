import { FC, useEffect, useMemo } from "react";
import moment from "moment";

interface BlockProps {
	hash: string;
	height: number | null | undefined;
	timestamp: string | null | undefined;
	parentHash: string | null | undefined;
	extrinsics: (string | undefined)[];
}

export const Block: FC<BlockProps> = ({
	hash,
	height,
	timestamp,
	parentHash,
	extrinsics,
}) => {
	const blockAge = useMemo<string | undefined>(
		() => moment(timestamp).fromNow(),
		[timestamp]
	);

	return (
		<div className="p-4 grid grid-cols-3 items-center border-b">
			<div className="flex space-x-2">
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

			<div className="text-sm flex">
				<p>
					<span className="font-mono text-gray-500">
						{extrinsics?.length ?? 0}
					</span>{" "}
					{extrinsics?.length === 1 ? "transaction" : "transactions"}
				</p>
			</div>

			<div className="text-sm space-y-px">
				<p className="flex">
					Hash:&nbsp;
					<span className="font-mono text-gray-500 truncate">{hash}</span>
				</p>
				<p className="flex">
					Parent:&nbsp;
					<span className="font-mono text-gray-500 truncate">{parentHash}</span>
				</p>
			</div>
		</div>
	);
};
