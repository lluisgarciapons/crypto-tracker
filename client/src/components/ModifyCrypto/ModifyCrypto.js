import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";

function AddCrypto(props) {
    const [coin, setCoin] = useState("");
    const [selectedCrypto, setSelectedCrypto] = useState({
        id: null,
        symbol: null,
        logo: null
    });
    const [amount, setAmount] = useState({
        amount1: "",
        amount2: "",
        amount3: "",
        amount4: ""
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const sum = (obj) => {
        return Object.keys(obj).reduce((sum, key) => sum + parseFloat(obj[key] || 0), 0);
    };

    const handleSubmitClick = async (e, action) => {
        e.preventDefault();
        setSuccessMessage(null);

        let actionEndpoint;
        if (action === "add") actionEndpoint = "addCrypto";
        if (action === "subst") actionEndpoint = "subsCrypto";

        let totalAmount = sum(amount);

        props.showError(null);
        const payload = {
            coinId: selectedCrypto.id,
            symbol: selectedCrypto.symbol,
            quantity: totalAmount
        };
        try {
            const response = await axios.put(`${API_BASE_URL}/user/${actionEndpoint}`, payload);
            console.log(response);
            if (!response.data.success) {
                return props.showError(response.data.message);
            }
            setSuccessMessage(response.data.message);
            props.showError(null);
        }

        catch (err) {
            console.log(err);
            props.showError(err.response.data.message);
        }

    };

    const handleReset = (e) => {
        e.preventDefault();
        props.showError(null);
        setSuccessMessage(null);
        setCoin("");
        setSelectedCrypto({
            id: null,
            symbol: null,
            logo: null
        });
        setAmount({
            amount1: "",
            amount2: "",
            amount3: "",
            amount4: ""
        });
    };

    const findCrypto = async () => {
        setLoading(true);
        try {
            // const cryptoInfo = await axios.get(`http://localhost:8080/https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${coin}`, {
            //     headers: {
            //         "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
            //     }
            // });

            const cryptoInfo = await axios.post(`${API_BASE_URL}/getData`, {
                url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${coin}`, headers: {
                    "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
                }
            });

            const info = Object.values(cryptoInfo.data.data).map(item => {
                return {
                    id: item.id,
                    symbol: item.symbol,
                    logo: `https://s2.coinmarketcap.com/static/img/coins/32x32/${item.id}.png`
                };
            })[0];
            setLoading(false);
            setSelectedCrypto(info);
            setCoin(info.symbol);
        }
        catch (err) {
            setLoading(false);
            console.log(err.response);
            props.showError(err.response.statusText || err.response.data.status.error_message);
        }
    };

    const redirectToHome = () => {
        props.updateTitle('Crypto-tracker');
        props.history.push('/');
    };

    const amountInputs = () => {
        return (
            <>
                <div className="form-group text-left">
                    <label htmlFor="site1">Amount</label>
                    <input type="text"
                        className="form-control"
                        id="site1"
                        value={amount.amount1}
                        placeholder="Site 1 amount"
                        onChange={(e) => setAmount(prevAmount => ({
                            ...prevAmount,
                            amount1: e.target.value
                        }))}
                    />
                </div>
                {amount.amount1 ? <div className="form-group text-left">
                    <input type="text"
                        className="form-control"
                        id="site2"
                        placeholder="Site 2 amount"
                        value={amount.amount2}
                        onChange={(e) => setAmount(prevAmount => ({
                            ...prevAmount,
                            amount2: e.target.value
                        }))}
                    />
                </div> : ""}
                {amount.amount2 ? <div className="form-group text-left">
                    <input type="text"
                        className="form-control"
                        id="site3"
                        placeholder="Site 3 amount"
                        value={amount.amount3}
                        onChange={(e) => setAmount(prevAmount => ({
                            ...prevAmount,
                            amount3: e.target.value
                        }))}
                    />
                </div> : ""}
                {amount.amount3 ? <div className="form-group text-left">
                    <input type="text"
                        className="form-control"
                        id="site4"
                        placeholder="Site 4 amount"
                        value={amount.amount4}
                        onChange={(e) => setAmount(prevAmount => ({
                            ...prevAmount,
                            amount4: e.target.value
                        }))}
                    />
                </div> : ""}

            </>
        );
    };

    const buttons = () => {
        return (
            <>
                <button
                    type="submit"
                    className="btn btn-primary mr-3"
                    onClick={(e) => handleSubmitClick(e, "add")}
                >Add</button>
                <button
                    type="submit"
                    className="btn btn-danger mr-3"
                    onClick={(e) => handleSubmitClick(e, "subst")}
                >Subst.</button>
                <button
                    type="reset"
                    className="btn btn-light mr-3"
                    onClick={handleReset}
                >Reset</button>
            </>
        );
    };

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="crypto">Coin</label>
                    {loading ?
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> : ""}
                    <div className="input-group">
                        {selectedCrypto.logo && !loading ? <div className="input-group-prepend">
                            <span className="input-group-text bg-transparent  border-0" id="basic-addon1">
                                <img src={selectedCrypto.logo} alt="crypto logo" />
                            </span>
                        </div> : ""}
                        <input
                            id="crypto"
                            type="text"
                            className="form-control"
                            placeholder="Symbol"
                            aria-label="Cryptocurrency"
                            aria-describedby="basic-addon2"
                            value={coin}
                            onChange={(e) => setCoin(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" onClick={findCrypto} type="button">
                                Search</button>
                        </div>
                    </div>
                </div>

                {selectedCrypto.symbol ? amountInputs() : ""}

                <div className="form-check">
                </div>
                {selectedCrypto.symbol ? buttons() : ""}
            </form>
            <div className="alert alert-success mt-2" style={{ display: successMessage ? 'block' : 'none' }} role="alert">
                {successMessage}
            </div>
            <div className="mt-2">
                <span className="loginText" onClick={() => redirectToHome()}>Back to Home</span>
            </div>
        </div>
    );
}

export default withRouter(AddCrypto);