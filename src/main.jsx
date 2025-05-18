import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
import { SiteDetailsContextProvider } from "./context/SiteDetailsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
  <React.Fragment>
    <AuthContextProvider>
      <SiteDetailsContextProvider>
        <App />
      </SiteDetailsContextProvider>
    </AuthContextProvider>
  </React.Fragment>
  //</React.StrictMode>
);
