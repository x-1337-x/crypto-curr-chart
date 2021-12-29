import React from "react";

import { useNavigate } from "react-router";
import { Outlet, Link } from "react-router-dom";
import { useAppState } from "../AppContext";
import { clearToken } from "../utils/auth";

export const Page = () => {
  const { state, dispatch } = useAppState();
  const [loaded, setLoaded] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!state.auth.token) {
      setLoaded(true);
      return;
    }

    fetch("//localhost:3000/validateToken", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        token: state.auth.token,
      }),
    })
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          return Promise.reject();
        }
      })
      .then((data) => {
        dispatch({
          type: "set_auth_token",
          token: data.token,
        });
      })
      .catch(() => {
        dispatch({
          type: "set_auth_token",
          token: null,
        });
        clearToken();
        navigate("/");
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [state.auth.token]);

  if (!loaded) {
    return <>loading</>;
  }

  return (
    <div className="page">
      <div className="header">
        <div className="logo">
          <Link to="/">Coin Sniper clone</Link>
        </div>
        <nav className="nav">
          <Link to="/submit">+ Submit Coin</Link> |{" "}
          {state.auth.token ? (
            <>
              <Link to="/watchlist">Watch list</Link> |{" "}
              <Link
                to="/logout"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({
                    type: "set_auth_token",
                    token: null,
                  });
                  clearToken();
                  navigate("/");
                }}
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">Sin In</Link> |{" "}
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
