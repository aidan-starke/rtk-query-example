import type { NextPage } from "next";
import { GetBlockByIdQuery, GetExtrinsicByIdQuery } from "@/libs/api/generated";
import { State, wrapper } from "@/libs/store";
import { api } from "@/libs/api/generated";
import { connect } from "react-redux";
import { Extrinsic } from "@/libs/components";
import { FC, ReactNode } from "react";
import clsx from "clsx";

export const getServerSideProps = wrapper.getServerSideProps(
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
	extrinsics: Array<GetExtrinsicByIdQuery["extrinsic"]>;
}

const Block: NextPage<BlockProps> = ({ block, extrinsics }) => {
	return (
		<div className="h-screen p-8 m-auto space-y-4">
			<div>
				<h1 className="text-xl">Extrinsics</h1>
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
				{extrinsics?.map((extrinsic) => (
					<TableRow rowClassName="space-y-px" key={extrinsic?.id}>
						<Extrinsic extrinsic={extrinsic} />
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
