import { Item, PaymentProps } from "@/types/paymentType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PaymentProps = {
    batchPayments: {},
    selectedItems:[],
    excludedItems: [],
    totalAmount: 0,
    isPaymentAllDate: false
}

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setBatchPayments: (state, action: PayloadAction<any>) => {
            state.batchPayments = action.payload;
        },

        setIsPaymentDate: (state, action: PayloadAction<boolean>) => {
            state.isPaymentAllDate = action.payload;
        },

        setSelectedItems: (state, action: PayloadAction<Item[]>) => {
            state.selectedItems = action.payload;
        },

        setExcludedItems: (state, action: PayloadAction<Item[]>) => {
            state.excludedItems = action.payload;
        },

        setTotalAmount: (state, action: PayloadAction<number>) => {
            state.totalAmount = action.payload
        },

        resetPayment: (state) => {
            state.selectedItems = [];
            state.totalAmount = 0;
        }
    }
})

export const {
    setBatchPayments,
    setIsPaymentDate,
    setSelectedItems, 
    setExcludedItems, 
    setTotalAmount, 
    resetPayment
} = paymentSlice.actions;
export default paymentSlice.reducer;