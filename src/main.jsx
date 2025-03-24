import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/paper-dashboard.scss?v=1.3.0";
import "./assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css"; // Ensure CSS is imported

import { Provider } from "react-redux";
import store from "./store/store.js";
import { AuthContextProvider } from "./store/auth/auth-context";

import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <StrictMode>
  <Provider store={store}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>
  // </StrictMode>
);
