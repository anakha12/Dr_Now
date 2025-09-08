import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { NotificationProvider } from "./context/NotificationContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
    </Provider>
  </React.StrictMode>
);
