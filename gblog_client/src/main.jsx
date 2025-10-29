// src/index.jsx (FIXED)

import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
// 1. IMPORT THE SETUP FUNCTIONS
import { setupStore, getPersistor } from "./store"; // Assuming the path is correct

import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router";
import { routes } from "./routes/Routes";
import { ToastContainer } from "react-toastify";

// 2. INITIALIZE THE STORE AND PERSISTOR
const store = setupStore();
const persistor = getPersistor(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer />
      <RouterProvider router={routes} />
    </PersistGate>
  </Provider>
);
