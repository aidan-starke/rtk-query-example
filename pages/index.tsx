import type { NextPage } from "next";
import { useGetBlocksQuery } from "@/libs/api/generated";
import { useEffect, useMemo, useState } from "react";
import { Block } from "@/libs/components";

import type { AcalaBlock, AcalaBlocks } from "@/libs/types";

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
		<div className="h-screen min-w-fit max-w-4xl p-8 m-auto">
			<h1 className="text-2xl font-mono">Blocks</h1>
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				{isFetched && blocks ? (
					<>
						{(blocks as Array<AcalaBlock>).map(
							({ id, number, timestamp, parentHash }) => (
								<Block
									key={id}
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
	}, [isFetched, isFetching]);

	return isFetched;
};
