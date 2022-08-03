import type { NextPage } from "next";
import { GetBlockByIdQuery, GetExtrinsicByIdQuery } from "@/libs/api/generated";
import { State, store, wrapper } from "@/libs/store";
import { api } from "@/libs/api/generated";
import { connect } from "react-redux";
import moment from "moment";
import { FC, ReactNode } from "react";
import clsx from "clsx";

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
				<TableRow rowClassName="text-lg">
					<p>Tx Hash</p>
					<p>Method</p>
					<p>Signer</p>
					<p>Age</p>
				</TableRow>
				{extrinsics.map((ext) => (
					<TableRow key={ext?.id} rowClassName="space-y-px">
						<p className="truncate text-sm font-mono text-gray-500">
							{ext?.id}
						</p>
						<p>
							{ext?.section}.{ext?.method}
						</p>
						<p className="text-sm font-mono text-gray-500">{ext?.signerId}</p>
						<p>{moment(ext?.timestamp).fromNow()}</p>
					</TableRow>
				))}
			</div>
		</div>
	);
};

export default connect((state: State) => state)(Block);

interface TableRowProps {
	children: ReactNode;
	rowClassName?: string;
}

const TableRow: FC<TableRowProps> = ({ children, rowClassName }) => (
	<div
		className={clsx(
			rowClassName,
			"grid grid-cols-4 gap-4 border-b items-center p-4 space-x-4"
		)}
	>
		{children}
	</div>
);
