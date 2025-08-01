import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedSlice from "./feedSlice"
import requestReducer from "./requestSlice";
import connectionReducer from "./connectionSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedSlice,
    requests: requestReducer,
    connections: connectionReducer,
  },
});

export default appStore;
