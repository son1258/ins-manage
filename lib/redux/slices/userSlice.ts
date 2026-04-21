import { UserProps } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserProps = {
    username: '',
    role: ''
}

const userSlice = createSlice ({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<{username: string, role: string}>) => {
            state.username = action.payload.username,
            state.role = action.payload.role
        }
    }
})

export const {setUserInfo} = userSlice.actions;
export default userSlice.reducer;