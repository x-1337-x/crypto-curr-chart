import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { Page } from "./components/Page";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { Watchlist } from "./components/Watchlist";
import { SubmitCoin } from "./components/SubmitCoin";
import { CoinPage } from "./components/CoinPage";
import { EditCoin } from "./components/EditCoin";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/submit" element={<SubmitCoin />} />
          <Route path="/coin/:id" element={<CoinPage />} />
          <Route path="/coin/:id/edit" element={<EditCoin />} />
          <Route
            path="*"
            element={
              <main>
                <h1>404</h1>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
