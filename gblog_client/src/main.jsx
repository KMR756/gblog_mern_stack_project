import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./store";

import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router";
import { routes } from "./routes/Routes";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./helper/AuthProvider";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
        <ToastContainer />
        <RouterProvider router={routes} />
      </AuthProvider>
    </PersistGate>
  </Provider>
);
