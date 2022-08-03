import { formatDistance } from "date-fns";

export const getDistance = (timestamp: string) =>
	formatDistance(new Date(timestamp).getUTCDate(), new Date().getUTCDate(), {
		addSuffix: true,
	});
