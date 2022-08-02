import type { NextPage } from "next";
import { api } from "../api/generated";
import JSONPretty from "react-json-pretty";

const Home: NextPage = () => {
	const { data, isFetching } = api.endpoints.GetBlocks.useQuery();

	return (
		<div className="h-screen w-2/3 p-8 m-auto">
			<h1 className="text-2xl font-mono">Blocks</h1>
			<div className="border-2 rounded h-full overflow-y-auto p-4">
				{isFetching ? (
					<p className="font-mono">Loading...</p>
				) : (
					<JSONPretty id="json-blocks" data={data} />
				)}
			</div>
		</div>
	);
};

export default Home;
