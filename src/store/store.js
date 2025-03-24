import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loaderSlice";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modalSlice";
const store = configureStore({
  reducer: {
    load: loaderReducer,
    user: userReducer,
    modal: modalReducer,
  },
});

export default store;
