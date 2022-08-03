import type { NextPage } from "next";
import { GetBlocksQuery, GetTransfersQuery } from "@/libs/api/generated";
import { Block, Transfer } from "@/libs/components";
import { wrapper, State } from "@/libs/store";
import { connect } from "react-redux";
import { api } from "@/libs/api/generated";

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
				blocks: blocksData?.blocks,
				transfers: transfersData?.transfers,
			},
		};
	}
);

interface HomeProps {
	blocks: GetBlocksQuery["blocks"];
	transfers: GetTransfersQuery["transfers"];
}

const Home: NextPage<HomeProps> = ({ blocks, transfers }) => {
	return (
		<div className="h-screen p-8 m-auto grid grid-cols-2 gap-4">
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				<h1 className="text-xl font-mono p-4">Latest Blocks</h1>
				{blocks?.nodes ? (
					<>
						{blocks.nodes.map((block) => (
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
				{transfers?.nodes ? (
					<>
						{transfers.nodes.map((transfer) => (
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

export default connect((state: State) => state)(Home);
