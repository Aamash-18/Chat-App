import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice.js";
import messageReducer from "./messageSlice.js";
import socketReducer from "./socketSlice.js";
import groupReducer from "./groupSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// 1️⃣ combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  messages: messageReducer,
  socket: socketReducer,
  group: groupReducer,
});

// 2️⃣ persistence configuration (persist EVERYTHING)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "messages","group"],
  blacklist: ["socket"], // ✅ ADD THIS
};

// 3️⃣ wrap reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 5️⃣ create persistor
export const persistor = persistStore(store);

export default store;
