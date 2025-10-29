// src/store/store.js

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/redux/user/user.slice"; // Adjust path as necessary
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";

// --- GLOBAL STORE INSTANCE REFERENCE ---
// 1. Variable to hold the store instance after creation.
let storeInstance;
// ---------------------------------------

// Configuration for redux-persist
const persistConfig = {
  key: "root", // Contains the combined reducer
  storage,
  whitelist: ["user"], // Whitelist the 'user' slice for persistence
};

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- 2. STORE CREATION FUNCTION ---
// Export a function to create and return the store
export const setupStore = () => {
  const store = configureStore({
    // Use the persisted reducer
    reducer: persistedReducer,
    // Disable serializableCheck for redux-persist actions
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    devTools: import.meta.env.MODE !== "production",
  });

  // Save the instance for external access
  storeInstance = store;
  return store;
};

// --- 3. EXPORTS FOR AXIOS INTERCEPTOR ---
// Export a function to retrieve the store instance
export const getStore = () => storeInstance;

// Export a function to retrieve the dispatch function
export const getDispatch = () => storeInstance?.dispatch;
// ------------------------------------------

// Export the persistor
let persistorInstance;
export const getPersistor = (store) => {
  if (!persistorInstance && store) {
    persistorInstance = persistStore(store);
  }
  return persistorInstance;
};

// NOTE: Ensure your entry file (index.jsx) is updated to call setupStore()
// before trying to use getStore() or getDispatch().
