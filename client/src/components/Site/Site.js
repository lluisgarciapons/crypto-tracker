import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import "./Site.css";

function Site(props) {
    const [site, setSite] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [edit, setEdit] = useState(false);

    const { siteId } = useParams();

    useEffect(() => {
        const getSiteInfo = async () => {
            const response = await axios.get(`/api/site/find/${siteId}`);
            console.log(response.data);
            props.updateTitle(response.data.site.name);
            setSite(response.data.site);
            setIsLoading(false);
        };
        getSiteInfo();
    }, []);

    const redirectToHome = () => {
        props.updateTitle('Wallet');
        props.history.push('/');
    };

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            {!isLoading ?
                (
                    <>{site?.crypto.map(coin => {
                        let src = `https://s2.coinmarketcap.com/static/img/coins/32x32/${coin.coinId}.png`;
                        return (
                            <div className="crypto-parent-site" key={coin.id}>
                                <div className="crypto-name">
                                    <div className="crypto-img" ><img src={src} style={{ borderRadius: "50%" }} alt={coin.symbol}></img></div>
                                    <div className="crypto-info">
                                        <p className="crypto-info-title">{coin.symbol}</p>
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
                                        type="text"
                                        className="form-control"
                                        placeholder="Symbol"
                                        aria-label="Cryptocurrency"
                                        aria-describedby="basic-addon2"
                                        value={coin.quantity}
                                        disabled={!edit}
                                    // onChange={(e) => setCoin(e.target.value)}
                                    />
                                </div>
                            </div>
                        );
                    })
                    }</>)
                : "Loading..."}
            <div className="mt-2">
                <span className="loginText" onClick={() => redirectToHome()}>Back to Home</span>
            </div>
        </div>
    );
}

export default withRouter(Site);