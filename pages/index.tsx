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

	const extrinsics = useMemo(
		() =>
			blocks?.map((block) =>
				block?.extrinsics?.edges?.map(({ node }) => node?.id)
			),
		[blocks]
	);

	return (
		<div className="h-screen p-8 m-auto">
			<div className="border-2 rounded h-full overflow-y-auto p-2 max-w-4xl m-auto">
				<h1 className="text-xl font-mono p-4">Latest Blocks</h1>
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
									extrinsics={extrinsics}
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
