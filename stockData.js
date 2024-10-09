/**
 * Stock Data Generator
 * Generates mock stock price data for analysis
 */

class StockDataGenerator {
    constructor() {
        this.basePrice = 100;
        this.volatility = 5;
    }

    /**
     * Generate mock stock price data
     * @param {number} days - Number of days of data to generate
     * @param {number} basePrice - Starting price
     * @returns {Array} Array of price objects
     */
    generateData(days = 30, basePrice = 100) {
        const data = [];
        let currentPrice = basePrice;
        
        for (let i = 0; i < days; i++) {
            // Simulate price movement with some randomness
            const change = (Math.random() - 0.5) * this.volatility;
            currentPrice = Math.max(10, currentPrice + change); // Ensure price doesn't go below 10
            
            data.push({
                date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
                price: parseFloat(currentPrice.toFixed(2)),
                volume: Math.floor(Math.random() * 1000000) + 100000
            });
        }
        
        return data;
    }

    /**
     * Generate data for multiple stocks
     * @param {Array} symbols - Array of stock symbols
     * @param {number} days - Number of days of data
     * @returns {Object} Object with stock data by symbol
     */
    generateMultipleStocks(symbols = ['AAPL', 'GOOGL', 'MSFT'], days = 30) {
        const stocks = {};
        symbols.forEach(symbol => {
            stocks[symbol] = this.generateData(days, 100 + Math.random() * 50);
        });
        return stocks;
    }
}

module.exports = StockDataGenerator;