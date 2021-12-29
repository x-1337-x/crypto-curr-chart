import React from "react";
import { useNavigate } from "react-router";

export const Register = () => {
  const emailRef = React.createRef<HTMLInputElement>();
  const passwordRef = React.createRef<HTMLInputElement>();
  const repeatPasswordRef = React.createRef<HTMLInputElement>();
  const [errorMessage, setErrorMessage] = React.useState("");

  let navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      repeatPassword: repeatPasswordRef.current.value,
    };

    const response = await fetch("//localhost:3000/register", {
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
      navigate("/login");
      alert("Account was created");
    } else {
      const message = await response.text();
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Create new Account</h1>
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
      <div>
        <label>
          <input
            ref={repeatPasswordRef}
            type="password"
            name="repeatPassword"
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
