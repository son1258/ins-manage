import { PaymentProps } from "@/types/paymentType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PaymentProps = {
    selectedIds: [],
    totalAmount: 0
}

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setSelectedIds: (state, action: PayloadAction<string[]>) => {
            state.selectedIds = action.payload
        },

        toggleSelectedId: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.selectedIds.includes(id)) {
                state.selectedIds = state.selectedIds.filter(item => item !== id);
            } else {
                state.selectedIds.push(id);
            }
        },

        setTotalAmount: (state, action: PayloadAction<number>) => {
            state.totalAmount = action.payload
        },

        resetPayment: (state) => {
            state.selectedIds = [];
            state.totalAmount = 0;
        }
    }
})

export const {setSelectedIds, toggleSelectedId, setTotalAmount, resetPayment} = paymentSlice.actions;
export default paymentSlice.reducer;