import { combineReducers, AnyAction } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/libs/api/generated";
import { Context, createWrapper, HYDRATE } from "next-redux-wrapper";
import { themeSlice } from "@/libs/store/theme";
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	Persistor,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface State {}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;

type ConfiguredStore = ReturnType<typeof configureStore>;
export interface PersistedStore extends ConfiguredStore {
	__persistor: Persistor;
}

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
	ssr: ssrReducer,
	[themeSlice.name]: themeSlice.reducer,
});

const makeStore = (context: Context) => {
	if ((context as any)?.isServer)
		return configureStore({
			reducer: rootReducer,
			middleware: (getDefaultMiddleware) =>
				getDefaultMiddleware().concat(api.middleware),
		});

	const store = configureStore({
		reducer: persistReducer(
			{ key: "root", whitelist: ["theme"], storage },
			rootReducer
		),
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}),
	});

	(store as PersistedStore).__persistor = persistStore(store);

	return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });

export * from "./theme";
