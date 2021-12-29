import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../AppContext";
import { saveToken } from "../utils/auth";

export const Login = () => {
  const emailRef = React.createRef<HTMLInputElement>();
  const passwordRef = React.createRef<HTMLInputElement>();
  const [errorMessage, setErrorMessage] = React.useState("");
  const { dispatch } = useAppState();

  let navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const response = await fetch("//localhost:3000/login", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(console.log);

    if (!response) {
      setErrorMessage("Something went wrong");
      return;
    }

    if (response.status === 200) {
      const data = await response.json();
      if (data.token) {
        saveToken(data.token);
        dispatch({
          type: "set_auth_token",
          token: data.token,
        });
        navigate("/");
      } else {
        setErrorMessage("Something went wrong");
      }
    } else {
      const message = await response.text();
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div>
        <label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            placeholder="email"
            required
          />
        </label>
      </div>
      <div>
        <label>
          <input
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="password"
            required
          />
        </label>
      </div>
      <button type="submit">Submit</button>
      <div style={{ color: "red" }}>{errorMessage}</div>
    </form>
  );
};
