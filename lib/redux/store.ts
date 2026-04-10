import { configureStore} from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import paymentReducer from "./slices/paymentSlice";

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        payment: paymentReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;