import { configureStore} from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import paymentReducer from "./slices/paymentSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        payment: paymentReducer,
        user: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;