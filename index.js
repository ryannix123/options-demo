// index.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const FINNHUB_KEY = 'cstm8fpr01qj0ou20gc0cstm8fpr01qj0ou20gcg';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

app.set('view engine', 'ejs');

async function fetchQuote(symbol) {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

async function getMarketData() {
    const symbols = {
        futures: [
            { symbol: 'ES=F', name: 'E-mini S&P 500' },
            { symbol: 'NQ=F', name: 'E-mini NASDAQ' },
            { symbol: 'YM=F', name: 'E-mini Dow' }
        ],
        equities: [
            { symbol: 'SPY', name: 'S&P 500 Index' },
            { symbol: 'QQQ', name: 'NASDAQ Composite' },
            { symbol: 'DIA', name: 'Dow Jones Industrial' }
        ],
        usOptions: [
            { symbol: 'VIX', name: 'VIX Index' },
            { symbol: 'RUT', name: 'Russell 2000' },
            { symbol: 'OEX', name: 'S&P 100' }
        ],
        euOptions: [
            { symbol: 'STOXX', name: 'EURO STOXX 50' },
            { symbol: 'DAX', name: 'DAX Index' },
            { symbol: 'FTSE', name: 'FTSE 100' }
        ]
    };

    const data = {};
    
    for (const [category, instruments] of Object.entries(symbols)) {
        data[category] = await Promise.all(
            instruments.map(async ({ symbol, name }) => {
                const quote = await fetchQuote(symbol);
                return {
                    name,
                    symbol,
                    price: quote?.c,
                    change: quote?.d,
                    changePercent: quote?.dp,
                    volume: quote?.v
                };
            })
        );
    }
    
    return data;
}

app.get('/', async (req, res) => {
    try {
        const marketData = await getMarketData();
        res.render('index', { marketData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});