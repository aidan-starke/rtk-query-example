import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
	name: "theme",
	initialState: "Light",
	reducers: {
		toggleTheme: (state) => {
			return (state = state === "Light" ? "Dark" : "Light");
		},
	},
});

export const { toggleTheme } = themeSlice.actions;
