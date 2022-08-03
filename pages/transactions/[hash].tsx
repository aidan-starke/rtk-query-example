import type { NextPage } from "next";
import { GetBlockByIdQuery } from "@/libs/api/generated";
import { State, store, wrapper } from "@/libs/store";
import { api } from "@/libs/api/generated";
import { connect } from "react-redux";
import JSONPretty from "react-json-pretty";

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
		const { data } = await store.dispatch(
			api.endpoints.GetBlockById.initiate({
				id: context?.params?.hash as string,
			})
		);
		await Promise.all(api.util.getRunningOperationPromises());

		return {
			props: {
				block: data?.block,
			},
		};
	}
);

const Block: NextPage<{ block: GetBlockByIdQuery["block"] }> = ({ block }) => {
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
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				<JSONPretty data={block} className="p-4" />
			</div>
		</div>
	);
};

export default connect((state: State) => state)(Block);
