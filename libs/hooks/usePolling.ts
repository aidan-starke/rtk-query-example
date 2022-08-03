import { useMemo } from "react";

export const usePolling = <T>(
	initialData: T,
	queryFunction: Function,
	queryParams?: Record<string, unknown>,
	pollingInterval: number = 5000
) => {
	const { data, isFetching } = queryFunction(queryParams, {
		pollingInterval,
	});

	return useMemo<T>(
		() => (data ? data : initialData),
		[data, initialData, isFetching]
	);
};
