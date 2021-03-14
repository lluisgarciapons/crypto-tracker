const fs = require('fs');

const isCoin = (coin) => {
    const data = fs.readFileSync('./utils/coinSymbols.json');
    if (data.indexOf(coin) == -1) {
        return false;
    }
    return true;
};

module.exports = {
    isCoin
};