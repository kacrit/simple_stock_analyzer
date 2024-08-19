/**
 * Stock Data Generator - Simulates stock price data
 * Generates realistic stock price data with random fluctuations
 */

class StockDataGenerator {
    constructor(symbol, initialPrice = 100, volatility = 0.02) {
        this.symbol = symbol;
        this.currentPrice = initialPrice;
        this.volatility = volatility;
        this.history = [];
    }

    /**
     * Generate stock data for a specified number of days
     * @param {number} days - Number of days of data to generate
     * @returns {Array} Array of stock data objects
     */
    generateData(days = 30) {
        const data = [];
        let currentDate = new Date();
        
        for (let i = days; i > 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            
            // Simulate price movement with random walk
            const change = (Math.random() - 0.5) * 2 * this.volatility * this.currentPrice;
            this.currentPrice += change;
            
            // Ensure price doesn't go negative
            this.currentPrice = Math.max(this.currentPrice, 0.01);
            
            const dailyData = {
                date: date.toISOString().split('T')[0],
                open: this.currentPrice + (Math.random() - 0.5) * 5,
                high: this.currentPrice + Math.random() * 10,
                low: Math.max(0.01, this.currentPrice - Math.random() * 8),
                close: this.currentPrice,
                volume: Math.floor(Math.random() * 1000000) + 100000
            };
            
            // Adjust high/low to be realistic relative to open/close
            dailyData.high = Math.max(dailyData.high, dailyData.open, dailyData.close);
            dailyData.low = Math.min(dailyData.low, dailyData.open, dailyData.close);
            
            data.push(dailyData);
        }
        
        this.history = data;
        return data;
    }

    /**
     * Get current stock data
     * @returns {Object} Current stock data
     */
    getCurrentData() {
        return this.history[this.history.length - 1] || null;
    }
}

module.exports = StockDataGenerator;