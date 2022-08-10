import type { NextPage } from "next";
import { Extrinsic } from "@/libs/components";
import { Layout } from "@/libs/components";
import Decimal from "decimal.js";
import { AcalaBlock } from "@/libs/types";
import { AppState, State, wrapper } from "@/libs/store";
import { api, GetExtrinsicByIdQuery } from "@/libs/api/generated";
import { connect, useSelector } from "react-redux";
import clsx from "clsx";

export const getServerSideProps = wrapper.getServerSideProps(
	(store) => async (context) => {
		const { data } = await store.dispatch(
			api.endpoints.GetBlockByNumber.initiate({
				number: new Decimal(context?.params?.number as string).toJSON(),
			}) as any
		);
		const block = data?.blocks?.nodes[0];

		const extrinsics = await Promise.all(
			(block?.extrinsics?.edges as any)?.map(
				async ({ node }: { node: { id: string } }) =>
					await store.dispatch(
						api.endpoints.GetExtrinsicById.initiate({
							id: node?.id,
						}) as any
					)
			)
		);
		await Promise.all(api.util.getRunningOperationPromises());

		return {
			props: {
				block,
				extrinsics: extrinsics.map((extrinsic) => extrinsic?.data?.extrinsic),
			},
		};
	}
);

interface BlockProps {
	block: AcalaBlock;
	extrinsics: Array<GetExtrinsicByIdQuery["extrinsic"]>;
}

const Block: NextPage<BlockProps> = ({ block, extrinsics }) => {
	const isDarkMode = useSelector((state: AppState) => state.theme === "Dark");

	return (
		<div className="h-screen p-8 m-auto space-y-4 max-h-[89vh]">
			<div>
				<h1 className="text-xl">Extrinsics</h1>
				<p>
					For block{" "}
					<span
						className={clsx(
							"font-mono text-sm text-gray-500",
							isDarkMode && "text-gray-300"
						)}
					>
						{block?.number}
					</span>
				</p>
			</div>
			<div className="border-2 rounded h-full p-2 overflow-y-auto">
				<Layout.TableRow rowClassName="text-lg grid-cols-4">
					<p>Tx Hash</p>
					<p>Method</p>
					<p>Signer</p>
					<p>Age</p>
				</Layout.TableRow>
				{extrinsics?.map((extrinsic) => (
					<Layout.TableRow
						rowClassName="space-y-px grid-cols-4"
						key={extrinsic?.id}
					>
						<Extrinsic extrinsic={extrinsic} />
					</Layout.TableRow>
				))}
			</div>
		</div>
	);
};

export default connect((state: State) => state)(Block);
