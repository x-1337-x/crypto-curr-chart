import React from "react";
import { useAppState } from "../AppContext";
import { CoinsTable } from "./CoinsTable";

export const Watchlist = () => {
  const { state } = useAppState();
  const [coins, setCoins] = React.useState([]);
  const [status, setStatus] = React.useState("loading");

  const fetchCoins = () =>
    fetch("//localhost:3000/api/watchlist", {
      headers: {
        token: state.auth.token,
      },
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          return Promise.reject(r.text());
        }
      })
      .then((coins) => {
        setCoins(coins);
      })
      .catch(console.log)
      .finally(() => {
        setStatus("done");
      });

  const onWatchListChange = React.useCallback(() => {
    fetchCoins();
  }, []);

  React.useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <>
      <div>
        <h2>Watchlist</h2>
        {status === "loading" ? (
          "loading"
        ) : coins.length ? (
          <>
            <CoinsTable coins={coins} onWatchListChange={onWatchListChange} />
          </>
        ) : (
          "List is empty"
        )}
      </div>
    </>
  );
};
