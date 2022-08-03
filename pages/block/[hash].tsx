import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useGetBlockByIdQuery } from "@/libs/api/generated";
import { useEffect, useMemo, useState } from "react";

export const getStaticPaths: GetStaticPaths = async (context) => {
	return {
		paths: [
			{
				params: {
					hash: "0xeb1a827a727fc2900784c358b3fa8458396bb29abd198fd9a7b9ae0e049f83fd",
				},
			},
		],
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	return {
		props: {
			hash: context?.params?.hash,
		},
	};
};

const Block: NextPage<{ hash: string }> = ({ hash }) => {
	console.log(hash);
	const { data } = useGetBlockByIdQuery({ id: hash });

	useEffect(() => {
		console.log({ data });
	}, [data]);

	return (
		<div className="h-screen p-8 m-auto">
			<div className="border-2 rounded h-full overflow-y-auto p-2">
				<h1 className="text-xl font-mono p-4">Latest Blocks</h1>
				{data ? <></> : <p className="font-mono p-4">Loading...</p>}
			</div>
		</div>
	);
};

export default Block;
