import React from "react";
import { useNavigate } from "react-router-dom";

export const SubmitCoin = () => {
  const nameRef = React.createRef<HTMLInputElement>();
  const symbolRef = React.createRef<HTMLInputElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();

  const [errorMessage, setErrorMessage] = React.useState("");

  let navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const payload = {
      name: nameRef.current.value,
      symbol: symbolRef.current.value,
      description: descriptionRef.current.value,
    };

    const response = await fetch("//localhost:3000/api/coins", {
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
      alert("Coin was created");
    } else {
      const message = await response.text();
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Add new Coin</h1>
      <div>
        <label>
          <input
            ref={nameRef}
            type="name"
            name="name"
            placeholder="Coin Name"
            required
          />
        </label>
      </div>
      <div>
        <label>
          <input
            ref={symbolRef}
            type="text"
            name="symbol"
            placeholder="Coin Symbol"
            required
          />
        </label>
      </div>
      <div>
        <label>
          <textarea
            ref={descriptionRef}
            name="description"
            placeholder="Coin Description"
          ></textarea>
        </label>
      </div>
      <button type="submit">Submit</button>
      <div style={{ color: "red" }}>{errorMessage}</div>
    </form>
  );
};
