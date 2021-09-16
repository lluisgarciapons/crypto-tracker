import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link, useParams, withRouter } from "react-router-dom";
import "./Site.css";

function Site(props) {
    const [site, setSite] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const { siteId } = useParams();

    const getSiteInfo = useCallback(async () => {
        const response = await axios.get(`/api/site/find/${siteId}`);
        console.log(response.data);
        props.updateTitle(response.data.site.name);
        setSite(response.data.site);
        setSuccessMessage(null);
        setIsLoading(false);
    }, [siteId, props]);

    useEffect(() => {
        getSiteInfo();
    }, [getSiteInfo]);

    const modifyCoin = i => e => {
        let newCrypto = [...site.crypto];
        newCrypto[i].quantity = parseFloat(e.target.value);
        setSite({ ...site, "site.crypto": newCrypto });
    };

    const cancelModify = async () => {
        await getSiteInfo();
        setEdit(false);
    };

    const saveModification = async () => {
        const response = await axios.put(`/api/site/modifySite/${siteId}`, site);
        console.log(response.data);
        setSite(response.data.modifiedSite);
        setEdit(false);
    };

    const deleteCoin = async (coin) => {
        if (window.confirm(`Do you really want to delete ${coin.name} from ${site.name}?`)) {
            const response = await axios.delete(`/api/site/deleteCoin/${siteId}?q=${coin.coinId}`);
            console.log(response.data);
            setSite(response.data.site);
            setSuccessMessage(response.data.message);
        }
    };

    const redirectToHome = () => {
        props.updateTitle('Wallet');
        props.history.push('/');
    };

    const redirectToMySites = () => {
        props.updateTitle('My Sites');
        props.history.push('/MySites');
    };

    const redirectToAddCrypto = () => {
        props.updateTitle('Add Crypto');
        props.history.push('/addCrypto');
    };



    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            {!isLoading ?
                site?.crypto.length === 0 ?
                    <div className="alert alert-warning mt-2" role="alert">
                        Start adding some crypto to this site <span className="loginText" onClick={redirectToAddCrypto}>here</span>
                    </div> :
                    <>

                        <div className="mt-2 d-flex justify-content-center" >
                            <button type="button" className="btn btn-success" style={{ visibility: edit ? 'visible' : 'hidden' }} onClick={saveModification}>Save</button>
                            <button type="button" className="btn btn-success" style={{ visibility: !edit ? 'visible' : 'hidden' }} onClick={() => setEdit(true)}>Modify</button>
                            <button type="button" className="btn btn-primary" style={{ visibility: edit ? 'visible' : 'hidden' }} onClick={() => cancelModify()}>Cancel</button>
                        </div>
                        {site?.crypto.map((coin, i) => {
                            let src = `https://s2.coinmarketcap.com/static/img/coins/32x32/${coin.coinId}.png`;
                            return (
                                <div className="crypto-parent-site" key={coin._id}>
                                    <div className="crypto-name">
                                        <div className="crypto-img" ><img src={src} style={{ borderRadius: "50%" }} alt={coin.symbol}></img></div>
                                        <div className="crypto-info">
                                            <p className="crypto-info-title" style={{ display: "inline-block" }}>{coin.symbol}</p>
                                            <button type="button" className="close" aria-label="Close" style={{ visibility: edit ? 'visible' : 'hidden' }} onClick={() => deleteCoin(coin)}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        {/* {coin ? <div className="input-group-prepend">
                                        <span className="input-group-text bg-transparent  border-0" id="basic-addon1">
                                            <img src={src} alt="crypto logo" />
                                        </span>
                                    </div> : ""} */}

                                        <input
                                            id="crypto"
                                            type="number"
                                            className="form-control"
                                            placeholder="quantity"
                                            aria-label="Cryptocurrency"
                                            aria-describedby="basic-addon2"
                                            value={coin.quantity}
                                            disabled={!edit}
                                            onChange={modifyCoin(i)}
                                        />
                                    </div>
                                </div>
                            );
                        })
                        }</>
                : "Loading..."}
            <div className="alert alert-success mt-2" style={{ display: successMessage ? 'block' : 'none' }} role="alert">
                {successMessage}
            </div>
            <div className="mt-2 d-flex justify-content-around">
                <button type="button" className="btn btn-primary" onClick={() => redirectToHome()}>Home</button>
                <button type="button" className="btn btn-primary" onClick={() => redirectToMySites()}>My sites</button>
            </div>
        </div>
    );
}

export default withRouter(Site);