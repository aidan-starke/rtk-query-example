import { combineReducers, AnyAction } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/libs/api/generated";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

export interface State {}

const ssrReducer = (state: State = {}, action: AnyAction) => {
	switch (action.type) {
		case HYDRATE:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	ssrReducer,
});

const makeStore = () =>
	configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(api.middleware),
	});

export const store = makeStore();

export const wrapper = createWrapper(makeStore, { debug: true });
