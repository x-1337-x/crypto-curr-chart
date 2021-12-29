import React from "react";
import { useAppState } from "../AppContext";
import { CoinsTable } from "./CoinsTable";

export const Home = () => {
  const [coins, setCoins] = React.useState([]);
  const [status, setStatus] = React.useState("loading");
  const [errorMessage, setErrorMessage] = React.useState("");
  const { state, dispatch } = useAppState();

  const fetchCoins = () =>
    fetch("//localhost:3000/api/coins").then((r) => {
      if (r.status === 200) {
        return r.json();
      } else {
        return Promise.reject(r.text());
      }
    });

  const fetchWatchlist = () =>
    fetch("//localhost:3000/api/watchlist", {
      headers: {
        token: state.auth.token,
      },
    }).then((r) => {
      if (r.status === 200) {
        return r.json();
      } else {
        return Promise.reject(r.text());
      }
    });

  React.useEffect(() => {
    Promise.allSettled([fetchCoins(), fetchWatchlist()])
      .then(([coins, watchlist]) => {
        if (coins.status === "fulfilled") {
          setCoins(coins.value);
        }
        if (watchlist.status === "fulfilled") {
          dispatch({
            type: "set_watchlist",
            watchlist: watchlist.value.map((el) => el.coinId),
          });
        }
      })
      .catch(console.log)
      .finally(() => {
        setStatus("done");
      });
  }, []);

  return (
    <>
      <div className="coins-list">
        <h2>Coins</h2>
        {status === "loading" ? (
          "Loading data"
        ) : coins.length ? (
          <CoinsTable coins={coins} />
        ) : (
          "No coins in DB"
        )}
      </div>
    </>
  );
};
