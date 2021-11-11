const exchangeTable = document.getElementById('exchangeTable');
const refreshTableButton = document.getElementById('refreshTableButton');

const tokenMap = [
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'e.rplanet', symbolName: 'AETHER'},
    },
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'onessusonwax', symbolName: 'VOID'},
    },
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'novarallytok', symbolName: 'SNAKOIL'},
    },
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'e.rplanet', symbolName: 'WECAN'},
    },
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'arenaxptoken', symbolName: 'AEXP'},
    },
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'bludactokens', symbolName: 'BLU'},
    },
    {
        baseToken: {contract: 'eosio.token', symbolName: 'WAX'},
        quoteToken: {contract: 'token.nefty', symbolName: 'NEFTY'},
    },
]

async function populatePage() {

    const url = "https://wax.alcor.exchange/api/markets";
    const response = await fetch(url);
    const data = await response.json();

    // Reset the table
    exchangeTable.innerHTML = '';

    for (const d of data) {
        const baseToken = d.base_token;
        const quoteToken = d.quote_token;

        for (const token of tokenMap) {
            if (baseToken.contract === token.baseToken.contract &&
                baseToken.symbol.name == token.baseToken.symbolName) {
                if (quoteToken.contract == token.quoteToken.contract &&
                    quoteToken.symbol.name == token.quoteToken.symbolName) {
                    const base = baseToken.symbol.name;
                    const quote = quoteToken.symbol.name

                    const output = `<tr><td><a href="https://wax.alcor.exchange/trade/${quote}-${quoteToken.contract}_${token.baseToken.symbolName}-${baseToken.contract}" target="_blank">${quote}</a></td><td style="font-family: 'Courier New', monospace; color: green;">${d.last_price} ${base}</td></tr>`
                    exchangeTable.insertAdjacentHTML('afterbegin', output);
                }
            }
        }
    }

    // await populateWaxPrice();


    const now = new Date();
    document.getElementById('timestamp').innerText = now.toLocaleTimeString();
    // });

    setTimeout(populatePage, refreshInterval)
}

async function populateWaxPrice() {
    const url = 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=WAX-USDT';
    const response = await fetch(url, {
        headers: {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Access-Control-Allow-Origin": "www.other.com",
            "Access-Control-Allow-Methods": " GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "referrer": "http://localhost:63342/",
        "referrerPolicy": "unsafe-url",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    });
    // const response = await fetch(url, {mode: 'no-cors'});

    console.log(response);

    const data = await response.json();

    console.dir(data);

    const output = `<tr><td>WAX</td><td>${data.data.price} USDT</td></tr>`;
    exchangeTable.insertAdjacentHTML('afterbegin', output);

}

const refreshInterval = 5 * 60 * 1000;


(async () => {
    // setTimeout(populatePage, refreshInterval)


    await populatePage();
})();

refreshTableButton.addEventListener('click', populatePage);