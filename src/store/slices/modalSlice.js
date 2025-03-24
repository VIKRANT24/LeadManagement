import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modal: false,
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModal: (state, action) => {
            state.modal = action.payload;
        },
    },
});

export const { setModal } = modalSlice.actions;
export default modalSlice.reducer;
