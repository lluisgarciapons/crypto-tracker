import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { API_BASE_URL } from '../../constants/apiConstants';
function Home(props) {
    const [cryptos, setCryptos] = useState([]);
    const [quotes, setQuotes] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("jwt_token"))
            getCrypto(localStorage.getItem("jwt_token"));
    }, []);

    useEffect(() => {
        const getQuotes = async () => {
            const symbols = cryptos.map(item => item.coin).join(",");
            const rawBtcQuotes = axios.get(`https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}&convert=btc`, {
                headers: {
                    "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
                }
            });
            const rawUsdQuotes = axios.get(`https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbols}`, {
                headers: {
                    "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
                }
            });

            const values = await Promise.all([rawBtcQuotes, rawUsdQuotes]);

            const btcQuotes = values[0].data.data;
            for (let key in btcQuotes) {
                setQuotes(oldQuotes => {
                    return {
                        ...oldQuotes,
                        [key]: {
                            btcPrice: btcQuotes[key][0].quote.BTC.price
                        }
                    };

                });
            }


            const usdQuotes = values[1].data.data;
            for (let key in usdQuotes) {
                setQuotes(oldQuotes => {
                    return {
                        ...oldQuotes,
                        [key]: {
                            ...oldQuotes[key],
                            usdPrice: usdQuotes[key][0].quote.USD.price
                        }
                    };
                });
            }
        };
        if (cryptos.length > 0) {
            getQuotes();
        }
    }, [cryptos]);

    const getCrypto = async (token) => {
        const user = await axios.get(`${API_BASE_URL}/user/mycryptos`, {
            headers: {
                Authorization: token
            }
        });
        setCryptos(user.data.crypto);
    };

    const redirectToAddCrypto = () => {
        props.updateTitle('Modify Crypto');
        props.history.push('/ModifyCrypto');
    };

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <div className="mt-2 text-center">
                <span className="loginText" onClick={() => redirectToAddCrypto()}>Modify Crypto</span>
            </div>
            {cryptos.map(item => {
                return <span key={item._id}>{item.coin} - {item.quantity}</span>;
            })}
        </div>
    );
}

export default withRouter(Home);