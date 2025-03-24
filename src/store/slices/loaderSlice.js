import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    load: false,
    expired: false,
    message: ""
};

const loaderSlice = createSlice({
    name: "load",
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.load = action.payload;
        },
        setSessionExpired: (state, action) => {
            const { condtion, msg } = action.payload
            state.expired = condtion;
            state.message = msg;
        },
    },
});

export const { setLoader, setSessionExpired } = loaderSlice.actions;
export default loaderSlice.reducer;
