import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditCoin = () => {
  const nameRef = React.createRef<HTMLInputElement>();
  const symbolRef = React.createRef<HTMLInputElement>();
  const descriptionRef = React.createRef<HTMLTextAreaElement>();
  const params = useParams();
  const [coin, setCoin] = React.useState(null);
  const [status, setStatus] = React.useState("loading");

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

    const response = await fetch("//localhost:3000/api/coins/" + params.id, {
      method: "put",
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
      alert("Coin was updated");
    } else {
      const message = await response.text();
      setErrorMessage(message);
    }
  };

  const fetchCoin = () =>
    fetch("//localhost:3000/api/coins/" + params.id)
      .then((r) => {
        if (r.status === 200) {
          return r.json();
        } else {
          return Promise.reject();
        }
      })
      .catch(console.log);

  React.useEffect(() => {
    setStatus("loading");
    fetchCoin()
      .then((coin) => {
        setCoin(coin);
      })
      .finally(() => {
        setStatus("done");
      });
  }, [params.id]);

  return (
    <>
      {status === "loading" ? (
        "loading"
      ) : coin ? (
        <>
          <form onSubmit={onSubmit}>
            <h1>Edit Coin - {coin.name}</h1>
            <div>
              <label>
                <input
                  ref={nameRef}
                  type="name"
                  name="name"
                  placeholder="Coin Name"
                  defaultValue={coin.name}
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
                  defaultValue={coin.symbol}
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
                  defaultValue={coin.description}
                ></textarea>
              </label>
            </div>
            <button type="submit">Submit</button>
            <div style={{ color: "red" }}>{errorMessage}</div>
          </form>
        </>
      ) : (
        <h1>404</h1>
      )}
    </>
  );
};
