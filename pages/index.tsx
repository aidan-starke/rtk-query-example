import type { NextPage } from "next";
import {
	GetBlocksQuery,
	GetTransfersQuery,
	useGetBlocksQuery,
	useGetTransfersQuery,
} from "@/libs/api/generated";
import { Block, Transfer } from "@/libs/components";
import { wrapper, State, AppState } from "@/libs/store";
import { connect, useSelector } from "react-redux";
import { api } from "@/libs/api/generated";
import { usePolling } from "@/libs/hooks";
import clsx from "clsx";
import { useEffect } from "react";

export const getServerSideProps = wrapper.getServerSideProps(
	(store) => async () => {
		const { data: blocksData } = await store.dispatch(
			api.endpoints.GetBlocks.initiate()
		);
		const { data: transfersData } = await store.dispatch(
			api.endpoints.GetTransfers.initiate()
		);
		await Promise.all(api.util.getRunningOperationPromises());

		return {
			props: {
				initialBlocks: blocksData,
				transfers: transfersData,
			},
		};
	}
);

interface HomeProps {
	initialBlocks: GetBlocksQuery;
	initialTransfers: GetTransfersQuery;
}

const Home: NextPage<HomeProps> = ({ initialBlocks, initialTransfers }) => {
	const { blocks } = usePolling<GetBlocksQuery>(
		initialBlocks,
		useGetBlocksQuery
	);
	const { transfers } = usePolling<GetTransfersQuery>(
		initialTransfers,
		useGetTransfersQuery
	);

	const isDarkMode = useSelector((state: AppState) => state.theme === "Dark");

	return (
		<div
			className={clsx(
				"h-screen p-8 m-auto grid grid-cols-2 gap-4 max-h-[95vh]",
				isDarkMode && "bg-gray-600"
			)}
		>
			<div
				className="border-2 rounded h-full overflow-y-auto p-2"
				suppressHydrationWarning
			>
				<h1 className="text-xl font-mono p-4">Latest Blocks</h1>
				{blocks?.nodes?.map((block) => (
					<Block
						key={block?.id}
						hash={block?.id}
						height={block?.number}
						timestamp={block?.timestamp}
						parentHash={block?.parentHash}
						number={block?.number}
						extrinsics={block?.extrinsics?.edges
							?.map(({ node }) => node?.id)
							.filter((e) => e?.length)}
					/>
				))}
			</div>
			<div
				className="border-2 rounded h-full overflow-y-auto p-2"
				suppressHydrationWarning
			>
				<h1 className="text-xl font-mono p-4">Latest Transfers</h1>
				{transfers?.nodes?.map((transfer) => (
					<Transfer
						key={transfer?.id}
						timestamp={transfer?.timestamp}
						from={transfer?.fromId}
						to={transfer?.toId}
						amount={transfer?.amount}
						token={transfer?.tokenId}
					/>
				))}
			</div>
		</div>
	);
};

export default connect((state: State) => state)(Home);
