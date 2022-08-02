import type { NextPage } from "next";
import { useGetBlocksQuery } from "../api/generated";
import { useEffect, useMemo, useState } from "react";
import { Block } from "../components";

import type { AcalaBlock, AcalaBlocks } from "../types";

const Home: NextPage = () => {
	const { data, isFetching } = useGetBlocksQuery(undefined, {
		pollingInterval: 5000,
	});
	const isFetched = useIsFetched(isFetching);

	const blocks = useMemo<AcalaBlocks | undefined>(
		() => data?.blocks?.nodes,
		[data]
	);

	return (
		<div className="h-screen w-2/3 p-8 m-auto">
			<h1 className="text-2xl font-mono">Blocks</h1>
			<div className="border-2 rounded h-full overflow-y-auto p-4">
				{isFetched ? (
					<>
						{(blocks as Array<AcalaBlock>).map(
							({ id, number, timestamp, parentHash }) => (
								<Block
									hash={id}
									height={number}
									timestamp={timestamp}
									parentHash={parentHash}
								/>
							)
						)}
					</>
				) : (
					<p className="font-mono">Loading...</p>
				)}
			</div>
		</div>
	);
};

export default Home;

const useIsFetched = (isFetching: boolean) => {
	const [isFetched, setIsFetched] = useState<boolean>(false);

	useEffect(() => {
		if (isFetched) return;

		setIsFetched(!isFetching);
	}, [isFetching]);

	return isFetched;
};
