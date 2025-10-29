// src/store/store.js

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/redux/user/user.slice"; // Adjust path as necessary
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// Configuration for redux-persist
const persistConfig = {
  key: "user",
  storage,
  // Since 'user' is the only slice, you don't strictly need 'whitelist',
  // but it's good practice.
  // whitelist: ["user"],
};

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // Use the persisted reducer
  reducer: persistedReducer,
  // Disable serializableCheck for redux-persist actions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.MODE !== "production",
});

// Export the persistor
export const persistor = persistStore(store);
