const exchangeTable = document.getElementById('exchangeTable');
const dingerAccount = 'ghkek.wam';
const skipTokens = ['NEFTY', 'WAX', 'TLM', 'DMT'];

async function populatePage() {
    setTimeout(populatePage, refreshInterval)

    const account = getAccount();
    const waxPrice = await getWAXPrice();

    const now = new Date();
    document.getElementById('timestamp').innerText = now.toLocaleTimeString();
    document.getElementById('refreshMinutes').innerText = (refreshInterval / 1000 / 60).toLocaleString();
    document.getElementById('waxPrice').innerText = waxPrice.toLocaleString();
    document.getElementById('pageHeader').innerText = account;
    document.getElementById('accountInput').value = account;

    if (account === dingerAccount) {
        document.getElementById('pageHeader').style.display = 'block';
        document.getElementById('pageHeader').innerText = 'AtomiKings Dinger Wallet'
    } else {
        document.getElementById('pageHeader').style.display = 'none';
    }

    // Reset the table
    exchangeTable.innerHTML = '';

    const tokenValues = await getTokenValues();
    const balances = await getAllTokenBalances(account);

    for (const token in balances) {
        if (skipTokens.includes(token)) {
            continue;
        }

        const amount = Number(balances[token].amount);

        if (amount < 0.5) {
            continue;
        }

        const value = tokenValues[token];
        if (!value) {
            console.log('oops', token, value);
            continue;
        }

        const lastPrice = value.last_price;
        const baseToken = value.base_token;
        const quoteToken = value.quote_token;
        const lastPriceText = lastPrice ? lastPrice.toFixed(8) : 'N/A'

        const output = `
<tr>
<td><a href="https://wax.alcor.exchange/trade/${quoteToken.symbol.name}-${quoteToken.contract}_${baseToken.symbol.name}-${baseToken.contract}" target="_blank">${token}</a></td>
<td style="font-family: 'Courier New', monospace; color: green;">${lastPriceText}</td>
<td>${Number(amount).toLocaleString()}</td>
<td><span class="price-wax-value">${(amount * lastPrice).toFixed(4)}</span> WAX</td>
<td>$${(amount * lastPrice * waxPrice).toFixed(2)}</td>
</tr>`
        exchangeTable.insertAdjacentHTML('afterbegin', output);
    }
}

/**
 * Get latest USD value of WAXP
 */
async function getWAXPrice() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=WAX&vs_currencies=USD';
    const response = await fetch(url);
    const data = await response.json();
    return Number(data.wax.usd);
}

async function getAllTokenBalances(account) {
    const dict = {};
    const response = await fetch(`https://lightapi.eosamsterdam.net/api/balances/wax/${account}`);
    const data = await response.json();

    for (const balance of data.balances) {
        const token = balance.currency;
        dict[token] = {
            contract: balance.contract,
            amount: Number.parseFloat(balance.amount),
            decimals: Number.parseInt(balance.decimals),
            currency: balance.currency
        }
    }

    return dict;
}

async function getTokenValues() {
    const data = await fetchTokenValues();
    const values = {}
    for (const d of data) {
        if (d.base_token.symbol.name.toUpperCase() === 'WAX') {
            values[d.quote_token.symbol.name.toUpperCase()] = d;
        } else if (d.quote_token.symbol.name.toUpperCase() === 'WAX') {
            console.log('revert', d);
            values[d.base_token.symbol.name.toUpperCase()] = d;
        }
    }

    return values;
}

async function fetchTokenValues() {
    const e = `https://wax.alcor.exchange/api/markets/`;
    return await (await fetch(e)).json()
}

const refreshInterval = 5 * 60 * 1000;

function getAccount() {
    return document.getElementById('accountInput').value;
}

async function handleAccountInputSubmit() {
    await populatePage();
}

(async () => {
    document.getElementById('accountInput').value = 'mo.xy';
    //document.getElementById('accountInput').value = 'ghkek.wam';
    document.getElementById('accountInputSubmit').addEventListener('click', handleAccountInputSubmit);
    await populatePage();
})();
