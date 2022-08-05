import "@/libs/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "@/libs/store";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<h1 className="font-mono text-center text-2xl pt-6">
				<a
					href="/"
					className="p-2 border-blue-600 hover:border-b-2 duration-100"
				>
					Acala Explorer
				</a>
			</h1>
			<Component {...pageProps} />
		</>
	);
}

export default wrapper.withRedux(MyApp);
