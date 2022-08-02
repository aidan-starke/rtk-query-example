import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/generated";

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});
