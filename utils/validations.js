const fs = require('fs');
const { default: fetch } = require('node-fetch');

const isCoin = async (coin) => {
    // const data = fs.readFileSync('./utils/coinSymbols.json');
    // if (data.indexOf(coin) == -1) {
    //     return false;
    // }
    // return true;

    let result = {
        isValid: null,
        error: null
    };

    try {


        let response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${coin}`, {
            headers: {
                "X-CMC_PRO_API_KEY": "e805b285-aca8-4d11-835b-0927388a6a0f"
            }
        });
        let data = await response.json();
        if (data.status.error_code == 400) {
            throw data.status.error_message;
        }


        result.isValid = true;
        return result;
    }
    catch (err) {
        result.isValid = false;
        result.error = err;
        return result;
    };
};

module.exports = {
    isCoin
};