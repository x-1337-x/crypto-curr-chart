import React from "react";
import produce from "immer";
import { readToken } from "./utils/auth";

type AppState = {
  auth: {
    token: string | null;
  };
  watchlist: number[];
};

const initialState = (): AppState => ({
  auth: {
    token: readToken(),
  },
  watchlist: [],
});

const AppStateContext = React.createContext(null);

const stateReducer = produce((draft, action) => {
  switch (action.type) {
    case "set_auth_token":
      draft.auth.token = action.token;
      break;
    case "set_watchlist":
      draft.watchlist = action.watchlist;
      break;
    default:
      break;
  }
});

export function AppStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(stateReducer, initialState());

  const value = { state, dispatch };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
}
