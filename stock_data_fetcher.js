/**
 * Stock Data Fetcher - Fetches historical stock data from Alpha Vantage API
 */

class StockDataFetcher {
    constructor(apiKey) {
        this.apiKey = apiKey || 'YOUR_API_KEY';
        this.baseURL = 'https://www.alphavantage.co/query';
    }

    async fetchStockData(symbol, outputSize = 'compact') {
        try {
            const url = `${this.baseURL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${this.apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data['Error Message']) {
                throw new Error(`API Error: ${data['Error Message']}`);
            }
            
            if (data['Note']) {
                console.warn('API Limit Note:', data['Note']);
            }
            
            return this.parseStockData(data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
            throw error;
        }
    }

    parseStockData(apiData) {
        const timeSeries = apiData['Time Series (Daily)'];
        if (!timeSeries) {
            throw new Error('No time series data found in API response');
        }

        const parsedData = [];
        
        for (const [date, values] of Object.entries(timeSeries)) {
            parsedData.push({
                date: date,
                open: parseFloat(values['1. open']),
                high: parseFloat(values['2. high']),
                low: parseFloat(values['3. low']),
                close: parseFloat(values['4. close']),
                volume: parseInt(values['5. volume'])
            });
        }

        // Sort by date ascending
        return parsedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Alternative method to load from local JSON file
    async loadFromFile(filePath) {
        try {
            // This would typically be handled by your backend
            const response = await fetch(filePath);
            return await response.json();
        } catch (error) {
            console.error('Error loading stock data from file:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StockDataFetcher;
}