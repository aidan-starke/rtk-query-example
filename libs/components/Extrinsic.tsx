import { GetExtrinsicByIdQuery } from "@/libs/api/generated";
import { getDistance } from "@/utils";
import { FC, useEffect, useState } from "react";
import { Layout } from "@/libs/components";

interface ExtrinsicProps {
	extrinsic: GetExtrinsicByIdQuery["extrinsic"];
}

export const Extrinsic: FC<ExtrinsicProps> = ({ extrinsic }) => {
	const distance = useDistance(extrinsic?.timestamp as string);

	return (
		<Layout.TableRow rowClassName="space-y-px">
			<p className="truncate text-sm font-mono text-gray-500">
				{extrinsic?.id}
			</p>
			<p>
				{extrinsic?.section}.{extrinsic?.method}
			</p>
			<p className="text-sm font-mono text-gray-500 truncate">
				{extrinsic?.signerId}
			</p>
			<p>{distance}</p>
		</Layout.TableRow>
	);
};

const useDistance = (timestamp: string) => {
	const [distance, setDistance] = useState<string>(getDistance(timestamp));

	useEffect(() => {
		const interval = setInterval(() => {
			setDistance(getDistance(timestamp));
		}, 10000);

		return () => {
			clearInterval(interval);
		};
	}, [timestamp]);

	return distance;
};
