import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userSignup } from "../../services/userService";

export const userSignUpFun = createAsyncThunk("user/signup", async (arg) => {
  try {
    const data_payload = arg.data;
    let response = await userSignup({ data: data_payload });
    // console.log(response)
    return response;
  } catch (err) {
    // toast.error('something went wrong');
  }
});

const initialState = {
  signUpData: {},
  loading: false,
  error: false,
};

const userReducer = createSlice({
  name: "userServices",
  initialState,
  reducers: {
    // setLoading: (state, action) => {
    //     state.loading = action.payload
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userSignUpFun.pending, (state) => {
        state.loading = true;
      })
      .addCase(userSignUpFun.fulfilled, (state, action) => {
        state.loading = false;
        state.signUpData = action.payload;
      })
      .addCase(userSignUpFun.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// eslint-disable-next-line no-empty-pattern
export const {} = userReducer.actions;

export default userReducer.reducer;
