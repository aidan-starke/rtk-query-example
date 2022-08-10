import { FC } from "react";
import { ToggleSwitch } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, toggleTheme } from "@/libs/store";

export const ThemeSwitch: FC = () => {
	const dispatch = useDispatch();
	const currentTheme = useSelector((state: AppState) => state.theme);

	return (
		<div className="flex flex-col absolute top-6 right-8 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5">
			<ToggleSwitch
				checked={currentTheme === "Dark"}
				label={`${currentTheme} mode`}
				onChange={() => dispatch(toggleTheme())}
			/>
		</div>
	);
};
