import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./features/messages/messagesSlice.js";
import usersReducer from "./features/users/usersSlice.js";

export default configureStore({
  reducer: {
    messages: messagesReducer,
    users: usersReducer,
  },
});
