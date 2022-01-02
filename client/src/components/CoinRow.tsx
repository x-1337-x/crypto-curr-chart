import { Link } from 'react-router-dom';
import { useAppState } from '../AppContext';

export const CoinRow = (props) => {
    const { state, dispatch } = useAppState();
    const { coin, onWatchListChange } = props;

    const fetchWatchlist = () =>
        fetch('//localhost:3000/api/watchlist', {
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
            .then((watchlist) => {
                dispatch({
                    type: 'set_watchlist',
                    watchlist: watchlist.map((el) => el.coin_id),
                });
            });

    const addToWatchList = async function () {
        fetch('//localhost:3000/api/watchlist/' + coin.coin_id, {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                token: state.auth.token,
            },
        })
            .then((r) => {
                if (r.status !== 200) {
                    return Promise.reject();
                }
            })
            .then(() => {
                fetchWatchlist();
                onWatchListChange();
            })
            .catch(console.log);
    };

    const removeFromWatchList = async function () {
        fetch('//localhost:3000/api/watchlist/' + coin.coin_id, {
            method: 'delete',
            headers: {
                'content-type': 'application/json',
                token: state.auth.token,
            },
        })
            .then((r) => {
                if (r.status !== 200) {
                    return Promise.reject();
                }
            })
            .then(() => {
                fetchWatchlist();
                onWatchListChange();
            })
            .catch(console.log);
    };

    const isInWatchList = state.watchlist.includes(coin.coin_id);

    return (
        <tr>
            <td>
                <Link to={'/coin/' + coin.coin_id}>{coin.name}</Link>
            </td>
            <td>{coin.symbol}</td>
            <td>{coin.description}</td>
            <td>
                {state.auth.token &&
                    (isInWatchList ? (
                        <button onClick={removeFromWatchList}>
                            Remove from Watchlist
                        </button>
                    ) : (
                        <button onClick={addToWatchList}>
                            Add to Watchlist
                        </button>
                    ))}
            </td>
            <td>{state.auth.token ? <button>Vote</button> : null}</td>
        </tr>
    );
};
