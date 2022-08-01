import type { NextPage } from "next";

const Home: NextPage = () => {
	return (
		<div className="h-screen w-2/3 p-8 m-auto">
			<h1 className="text-2xl font-mono">Blocks</h1>
			<div className="border-2 rounded h-full"></div>
		</div>
	);
};

export default Home;
