import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { API_BASE_URL } from "../../constants/apiConstants";



function MySites(props) {
    const [sites, setSites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/site/mySites`)
            .then(response => {
                setSites(response.data.sites);
                setIsLoading(false);
            });
    }, []);

    const redirectToHome = () => {
        props.updateTitle('Wallet');
        props.history.push('/');
    };


    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            {!isLoading ?
                (
                    <>{sites.map(site => {
                        let src = `//logo.clearbit.com/${site.name.replace(/\s/g, '')}.com?size=48`;
                        return (
                            <Link key={site.id} to={`/Site/${site.id}`}>
                                <div className="crypto-parent">
                                    <div className="crypto-img" ><img src={src} style={{ borderRadius: "50%" }} alt={site.name}></img></div>
                                    <div className="crypto-info">
                                        <p className="crypto-info-title">{site.name}</p>
                                    </div>
                                </div>
                            </Link>
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
export default MySites;