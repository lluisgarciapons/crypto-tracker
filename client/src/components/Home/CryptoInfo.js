import React, { memo, useEffect, useState } from "react";
import "./CryptoInfo.css";


const CryptoInfo = (props) => {
    const [totalBtc, setTotalBtc] = useState(0);
    const [totalUsd, setTotalUsd] = useState(0);

    useEffect(() => {
        console.log("calculating total");
        const totalBtc = () => {
            setTotalBtc(props.data.reduce((sum, current) => {
                return sum + (current.quantity * current.btcPrice);
            }, 0));
        };

        const totalUsd = () => {
            setTotalUsd(props.data.reduce((sum, current) => {
                return sum + (current.quantity * current.usdPrice);
            }, 0));
        };
        totalBtc();
        totalUsd();
    }, []);

    const pct = (data) => {
        return (((data.quantity * data.btcPrice) / totalBtc) * 100).toFixed(2);
    };

    return (
        <>
            <div className="total-prices">
                <span>{(totalBtc).toFixed(8)} BTC</span>
                <span>$ {(totalUsd).toFixed(2)}</span>
            </div>
            {props.data.map(coin => {
                let src = `https://s2.coinmarketcap.com/static/img/coins/32x32/${coin.coinId}.png`;
                return (
                    <div className="crypto-parent" key={coin._id}>
                        <div className="crypto-img"><img src={src} alt="crypto logo"></img></div>
                        <div className="crypto-info">
                            <p className="crypto-info-title">{coin.quantity} {coin.symbol}</p>
                            <p className="crypto-info-prices">{(coin.quantity * coin.btcPrice).toFixed(8)} BTC</p>
                            <p className="crypto-info-prices">{(coin.quantity * coin.usdPrice).toFixed(4)} USD</p>
                        </div>
                        <div className="crypto-pct">{pct(coin)}%</div>
                    </div>
                );
            })}
        </>
    );

};

export default memo(CryptoInfo, (prevProps, nextProps) => {
    return prevProps.data !== nextProps.data;
});