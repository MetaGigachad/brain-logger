import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wallet, contractId } from "../../wallet.js";
import { MESSAGES_BLOCK_SIZE } from "../../config.js";

export const fetchLatestBlock = createAsyncThunk(
  "messages/fetchLatestBlock",
  async function () {
      return await wallet.viewMethod({
        contractId: contractId,
        method: "get_latest_block",
        args: { length: MESSAGES_BLOCK_SIZE },
      });
  }
);

export const fetchNextBlock = createAsyncThunk(
  "messages/fetchNextBlock",
  async function (_arg, { getState }) {
    const state = getState().messages;
    if (state.start_id == Infinity) {
      throw Error("Invalid start_id");
    }
    let response = await wallet.viewMethod({
      contractId: contractId,
      method: "get_block",
      args: {
        start_id: state.start_id + state.data.length,
        length: MESSAGES_BLOCK_SIZE,
      },
    });
    return response.block.filter(
      (message) => message.sender !== wallet.accountId
    );
  }
);

export const fetchPrevBlock = createAsyncThunk(
  "messages/fetchPrevBlock",
  async function (_arg, { getState }) {
    const state = getState().messages;
    return await wallet.viewMethod({
      contractId: contractId,
      method: "get_block",
      args: {
        start_id: Math.max(0, state.start_id - MESSAGES_BLOCK_SIZE),
        length: Math.min(MESSAGES_BLOCK_SIZE, state.start_id),
      },
    });
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    data: [],
    start_id: Infinity,
    loaded: false,
  },
  reducers: {
    addMessage(state, action) {
      state.data.push(action.payload);
    },
    addFrontMessages(state, action) {
      state.data.unshift(...action.payload.block);
      state.start_id = Math.min(state.start_id, action.payload.start_id);
    },
    confirmMessage(state, action) {
      state.data.find((x) => x.id == action.payload.id).sending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestBlock.fulfilled, (state, action) => {
        console.log("I am here too");
        state.data.push(...action.payload.block);
        if (action.payload.start_id < state.start_id) {
          state.start_id = action.payload.start_id;
        }
        state.loaded = true;
      })
      .addCase(fetchLatestBlock.rejected, (state, action) => {
        console.log("I am here sad");
      })
      .addCase(fetchNextBlock.fulfilled, (state, action) => {
        state.data.push(...action.payload);
      })
      .addCase(fetchPrevBlock.fulfilled, (state, action) => {
        state.data.unshift(...action.payload.block);
        if (action.payload.start_id < state.start_id) {
          state.start_id = action.payload.start_id;
        }
      });
  },
});

export const { addMessages, addFrontMessages, addMessage, confirmMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
