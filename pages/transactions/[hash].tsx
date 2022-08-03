import type { NextPage } from "next";
import { GetBlockByIdQuery, GetExtrinsicByIdQuery } from "@/libs/api/generated";
import { State, store, wrapper } from "@/libs/store";
import { api } from "@/libs/api/generated";
import { connect } from "react-redux";
import { Layout, Extrinsic } from "@/libs/components";

export const getStaticPaths = async () => {
	const { data } = await store.dispatch(api.endpoints.GetBlocks.initiate());
	await Promise.all(api.util.getRunningOperationPromises());

	return {
		paths: data?.blocks?.nodes.map((block) => ({
			params: { hash: block?.id },
		})),
		fallback: false,
	};
};

export const getStaticProps = wrapper.getStaticProps(
	(store) => async (context) => {
		const { data: blockData } = await store.dispatch(
			api.endpoints.GetBlockById.initiate({
				id: context?.params?.hash as string,
			})
		);

		const extrinsics = await Promise.all(
			(blockData?.block?.extrinsics?.edges as any)?.map(
				async ({ node }: { node: { id: string } }) =>
					await store.dispatch(
						api.endpoints.GetExtrinsicById.initiate({
							id: node?.id,
						})
					)
			)
		);

		await Promise.all(api.util.getRunningOperationPromises());

		return {
			props: {
				block: blockData?.block,
				extrinsics: extrinsics.map((extrinsic) => extrinsic?.data?.extrinsic),
			},
		};
	}
);

interface BlockProps {
	block: GetBlockByIdQuery["block"];
	extrinsics: GetExtrinsicByIdQuery["extrinsic"][];
}

const Block: NextPage<BlockProps> = ({ block, extrinsics }) => {
	return (
		<div className="h-screen p-8 m-auto space-y-4">
			<div>
				<h1 className="text-xl">Transactions</h1>
				<p>
					For block{" "}
					<span className="font-mono text-sm text-gray-500">
						{block?.number}
					</span>
				</p>
			</div>
			<div className="border-2 rounded h-full p-2 overflow-y-auto">
				<Layout.TableRow rowClassName="text-lg">
					<p>Tx Hash</p>
					<p>Method</p>
					<p>Signer</p>
					<p>Age</p>
				</Layout.TableRow>
				{extrinsics.map((extrinsic) => (
					<Extrinsic extrinsic={extrinsic} key={extrinsic?.id} />
				))}
			</div>
		</div>
	);
};

export default connect((state: State) => state)(Block);
