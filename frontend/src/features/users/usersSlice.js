import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wallet, contractId } from "../../wallet.js";

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async function (id) {
    return {
      id,
      info: await wallet.viewMethod({
        contractId: contractId,
        method: "get_user_info",
        args: { user_id: id },
      }),
    };
  }
);

export const loadUser = createAsyncThunk(
  "users/loadUser",
  async function (info) {
    await wallet.callMethod({
      contractId: contractId,
      method: "add_user_info",
      args: info,
    });
    return info;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data[action.payload.id] = action.payload.info;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.data[wallet.accountId] = action.payload;
      });
  },
});

export default usersSlice.reducer;
