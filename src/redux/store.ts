import { configureStore } from "@reduxjs/toolkit";
import trabajadoresReducer from "./features/trabajadores/trabajadoresSlice";

export const store = configureStore({
    reducer: {
        trabajadores: trabajadoresReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;