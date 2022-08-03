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
		const hash = context?.params?.hash as string;
		const { data } = await store.dispatch(
			api.endpoints.GetBlockById.initiate({ id: hash })
		);
		await Promise.all(api.util.getRunningOperationPromises());

		return {
			props: {
				hash,
				block: data?.block,
			},
		};
	}
);

const Block: NextPage<{ hash: string; block: GetBlockByIdQuery["block"] }> = ({
	hash,
	block,
}) => {
	return (
		<div className="h-screen p-8 m-auto">
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				<h1 className="text-lg p-4">
					Hash:{" "}
					<span className="font-mono text-base text-gray-500">{hash}</span>
				</h1>
				<JSONPretty data={block} className="p-4" />
			</div>
		</div>
	);
};

export default connect((state: State) => state)(Block);
