import type { NextPage } from "next";
import {
	useGetBlockByIdQuery,
	useGetBlocksQuery,
	useGetTransfersQuery,
} from "@/libs/api/generated";
import { useEffect, useMemo, useState } from "react";
import { Block, Transfer } from "@/libs/components";

const Home: NextPage = () => {
	const { data: blockData, isFetching: blocksFetching } = useGetBlocksQuery(
		undefined,
		{
			pollingInterval: 5000,
		}
	);
	const blocksFetched = useIsFetched(blocksFetching);

	const { data: transferData, isFetching: transfersFetching } =
		useGetTransfersQuery(undefined, {
			pollingInterval: 5000,
		});
	const transfersFetched = useIsFetched(transfersFetching);

	const blocks = useMemo(() => blockData?.blocks?.nodes, [blockData]);

	const { data } = useGetBlockByIdQuery({
		id: "0xb405fa0c81a7b5810e27f9d503849a4fd827cc21c678d41d759eb2e3ec57b992",
	});

	useEffect(() => {
		if (!data) return;

		console.log({ data });
	}, [data]);

	const transfers = useMemo(
		() => transferData?.transfers?.nodes,
		[transferData]
	);

	return (
		<div className="h-screen p-8 m-auto grid grid-cols-2 gap-4">
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				<h1 className="text-xl font-mono p-4">Latest Blocks</h1>
				{blocksFetched && blocks ? (
					<>
						{blocks.map((block) => (
							<Block
								key={block?.id}
								hash={block?.id}
								height={block?.number}
								timestamp={block?.timestamp}
								parentHash={block?.parentHash}
								extrinsics={block?.extrinsics?.edges
									?.map(({ node }) => node?.id)
									.filter((e) => e?.length)}
							/>
						))}
					</>
				) : (
					<p className="font-mono p-4">Loading...</p>
				)}
			</div>
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				<h1 className="text-xl font-mono p-4">Latest Transactions</h1>
				{transfersFetched && transfers ? (
					<>
						{transfers.map((transfer) => (
							<Transfer
								key={transfer?.id}
								timestamp={transfer?.timestamp}
								from={transfer?.fromId}
								to={transfer?.toId}
								amount={transfer?.amount}
								token={transfer?.tokenId}
							/>
						))}
					</>
				) : (
					<p className="font-mono p-4">Loading...</p>
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
