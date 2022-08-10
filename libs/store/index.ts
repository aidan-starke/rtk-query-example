import { combineReducers, AnyAction } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/libs/api/generated";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { themeSlice } from "@/libs/store/theme";

export interface State {}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;

const ssrReducer = (state: State = {}, action: AnyAction) => {
	switch (action.type) {
		case HYDRATE:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};

const makeStore = () =>
	configureStore({
		reducer: combineReducers({
			[api.reducerPath]: api.reducer,
			ssr: ssrReducer,
			[themeSlice.name]: themeSlice.reducer,
		}),
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(api.middleware),
	});

export const store = makeStore();

export const wrapper = createWrapper(makeStore, { debug: true });

export * from "./theme";
