import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export const CoinPage = () => {
    const params = useParams();
    const [coin, setCoin] = React.useState(null);
    const [status, setStatus] = React.useState('loading');

    const fetchCoin = () =>
        fetch('//localhost:3000/api/coins/' + params.id)
            .then((r) => {
                if (r.status === 200) {
                    return r.json();
                } else {
                    return Promise.reject();
                }
            })
            .catch(console.log);

    React.useEffect(() => {
        setStatus('loading');
        fetchCoin()
            .then((coin) => {
                setCoin(coin);
            })
            .finally(() => {
                setStatus('done');
            });
    }, [params.id]);

    return (
        <>
            {status === 'loading' ? (
                'loading'
            ) : coin ? (
                <>
                    <h2>{coin.name}</h2>
                    <p>{coin.symbol}</p>
                    <p>{coin.description}</p>
                    <Link to={`/coin/${coin.coin_id}/edit`}>Edit Coin</Link>
                </>
            ) : (
                <h1>404</h1>
            )}
        </>
    );
};
