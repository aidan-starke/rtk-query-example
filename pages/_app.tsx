import "@/libs/globals.css";
import type { AppProps } from "next/app";
import { AppState, PersistedStore, wrapper } from "@/libs/store";
import clsx from "clsx";
import { useSelector, useStore } from "react-redux";
import { ThemeSwitch } from "@/libs/components";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";

function MyApp({ Component, pageProps }: AppProps) {
	const store = useStore();
	const isDarkMode = useSelector((state: AppState) => state.theme === "Dark");

	return (
		<PersistGate persistor={(store as PersistedStore).__persistor}>
			<div
				className={clsx(
					"h-screen w-screen",
					isDarkMode && "bg-gray-600 text-gray-100"
				)}
			>
				<h1 className="font-mono text-center text-2xl pt-6">
					<a
						href="/"
						className={clsx(
							"p-2 border-blue-600 hover:border-b-2 duration-100",
							isDarkMode && "border-blue-200"
						)}
					>
						Acala Explorer
					</a>
				</h1>
				<ThemeSwitch />
				<Head>
					<title>Acala Explorer</title>
				</Head>
				<Component {...pageProps} />
			</div>
		</PersistGate>
	);
}

export default wrapper.withRedux(MyApp);
