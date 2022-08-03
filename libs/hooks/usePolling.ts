import { useMemo } from "react";

export const usePolling = <T>(
	initialData: T,
	queryFunction: Function,
	pollingInterval: number = 5000,
	queryParams?: Record<string, unknown>
) => {
	const { data, isFetching } = queryFunction(queryParams, {
		pollingInterval,
	});

	return useMemo<T>(
		() => (data ? data : initialData),
		[data, initialData, isFetching]
	);
};
