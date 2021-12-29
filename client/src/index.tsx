import "./index.css";

import React from "react";
import { render } from "react-dom";
import { AppStateProvider } from "./AppContext";
import { App } from "./App";

render(
  <AppStateProvider>
    <App />
  </AppStateProvider>,
  document.getElementById("app")
);
