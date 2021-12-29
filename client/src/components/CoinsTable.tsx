import { CoinRow } from "./CoinRow";

export const CoinsTable = (props) => {
  const { coins, onWatchListChange = () => {} } = props;

  return (
    <table>
      <thead>
        <tr>
          <td>Name</td>
          <td>Symbol</td>
          <td>Description</td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <CoinRow
            key={coin.symbol}
            coin={coin}
            onWatchListChange={onWatchListChange}
          />
        ))}
      </tbody>
    </table>
  );
};
