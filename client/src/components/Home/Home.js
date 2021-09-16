import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { API_BASE_URL } from '../../constants/apiConstants';
import DoughnutChart from '../Charts/Doughnut';
import CryptoInfo from "./CryptoInfo";
function Home(props) {
    const [cryptos, setCryptos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCrypto = async (token) => {
            const user = await axios.get(`${API_BASE_URL}/user/mycryptos`, {
                headers: {
                    Authorization: token
                }
            });
            setCryptos(user.data.crypto);
        };
        if (localStorage.getItem("jwt_token")) {
            getCrypto(localStorage.getItem("jwt_token"));
        }
    }, []);

    useEffect(() => {
        const getQuotes = async () => {
            const symbols = cryptos.map(item => item.symbol).join(",");
            // const rawBtcQuotes = axios.get(`https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=btc`, {

            const rawBtcQuotes = axios.post(`${API_BASE_URL}/getData`, {
                url: `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=btc`, headers: {
                    "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
                }
            });

            // const rawBtcQuotes = axios.get(`http://localhost:8080/https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=btc`, {
            //     headers: {
            //         "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
            //     }
            // });

            // const rawUsdQuotes = axios.get(`https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=usd`, {

            const rawUsdQuotes = axios.post(`${API_BASE_URL}/getData`, {
                url: `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=usd`, headers: {
                    "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
                }
            });

            // const rawUsdQuotes = axios.get(`http://localhost:8080/https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=usd`, {
            //     headers: {
            //         "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
            //     }
            // });

            const values = await Promise.all([rawBtcQuotes, rawUsdQuotes]);

            const btcQuotes = values[0].data.data;
            for (let key in btcQuotes) {
                let index = cryptos.findIndex(coin => coin.symbol === key);
                let copy = { ...cryptos[index] };
                copy.btcPrice = btcQuotes[key][0].quote.BTC.price;
                cryptos[index] = copy;
                // setCryptos(cryptos);
            }

            const usdQuotes = values[1].data.data;
            for (let key in usdQuotes) {
                let index = cryptos.findIndex(coin => coin.symbol === key);
                let copy = { ...cryptos[index] };
                copy.usdPrice = usdQuotes[key][0].quote.USD.price;
                cryptos[index] = copy;
            }
            setCryptos(cryptos);

            const orderCryptos = () => {
                let orderedCryptos = [...cryptos];
                orderedCryptos = orderedCryptos.sort((a, b) => {
                    return (b.quantity * b.btcPrice) - (a.quantity * a.btcPrice);
                });
                setCryptos(orderedCryptos);
            };
            orderCryptos();
            setIsLoading(false);
        };
        if (cryptos) {
            if (cryptos.length > 0 && !cryptos[0].btcPrice) {
                getQuotes();
            } else {
                setIsLoading(false);
            }
        }
        // if (cryptos && cryptos.length > 0 && !cryptos[0].btcPrice) {
        //     getQuotes();
        // }
    }, [cryptos]);

    const redirectToAddCrypto = () => {
        props.updateTitle('Add Crypto');
        props.history.push('/addCrypto');
    };

    const redirectToMySites = () => {
        props.updateTitle('My Sites');
        props.history.push('/MySites');
    };

    const content = (
        <>
            <DoughnutChart info={cryptos} />
            <CryptoInfo data={cryptos} />
        </>
    );

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <div className="mt-2 d-flex justify-content-around">
                <button type="button" className="btn btn-primary" onClick={() => redirectToAddCrypto()}>Add Crypto</button>
                <button type="button" className="btn btn-primary" onClick={() => redirectToMySites()}>My sites</button>
            </div>
            {!isLoading ? cryptos.length === 0 ?
                <div className="alert alert-warning mt-2" role="alert">
                    Start adding some crypto <span className="loginText" onClick={redirectToAddCrypto}>here</span>
                </div> : content : "Loading..."}
        </div>
    );
}

export default withRouter(Home);