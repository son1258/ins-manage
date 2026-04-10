import { MenuItemProp } from "@/types/menuType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MenuItemProp = {
    activeTitle: ''
}

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setActiveTitle: (state, action: PayloadAction<string>) => {
            state.activeTitle = action.payload;
        }
    }
})

export const {setActiveTitle} = menuSlice.actions;
export default menuSlice.reducer;