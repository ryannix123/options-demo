const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.static('imgs'));
const port = process.env.PORT || 8080;

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

app.set('view engine', 'ejs');

async function fetchQuote(symbol) {
    try {
        const response = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
        const data = await response.json();
        console.log(`Data for ${symbol}:`, data); // Debug logging
        return data;
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

async function getMarketData() {
    const symbols = {
        futures: [
            { symbol: '/ES', name: 'E-mini S&P 500 Futures' },
            { symbol: '/NQ', name: 'E-mini NASDAQ Futures' },
            { symbol: '/YM', name: 'E-mini Dow Futures' }
        ],
        equities: [
            { symbol: 'SPY', name: 'S&P 500 ETF' },
            { symbol: 'QQQ', name: 'NASDAQ 100 ETF' },
            { symbol: 'DIA', name: 'Dow Jones ETF' }
        ],
        usOptions: [
            { symbol: 'UVXY', name: 'ProShares Ultra VIX' },
            { symbol: 'SVXY', name: 'ProShares Short VIX' },
            { symbol: 'VXX', name: 'iPath Series B S&P 500 VIX' }
        ],
        euOptions: [
            { symbol: 'FEZ', name: 'EURO STOXX 50 ETF' },
            { symbol: 'EWG', name: 'Germany ETF' },
            { symbol: 'EWU', name: 'UK ETF' }
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
                    high: quote?.h,
                    low: quote?.l,
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