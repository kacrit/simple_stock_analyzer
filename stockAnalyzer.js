/**
 * Main Stock Analyzer Class
 * Orchestrates stock data generation and moving average analysis
 */

const StockDataGenerator = require('./stockData.js');
const MovingAverageCalculator = require('./movingAverage.js');

class StockAnalyzer {
    constructor(symbol = 'AAPL') {
        this.symbol = symbol;
        this.dataGenerator = new StockDataGenerator(symbol);
        this.maCalculator = new MovingAverageCalculator();
        this.stockData = [];
    }

    /**
     * Initialize analyzer with stock data
     * @param {number} days - Number of days of data to generate
     */
    initialize(days = 100) {
        console.log(`Generating ${days} days of stock data for ${this.symbol}...`);
        this.stockData = this.dataGenerator.generateData(days);
        console.log(`Generated ${this.stockData.length} days of data.`);
        return this.stockData;
    }

    /**
     * Analyze stock with moving averages
     * @param {Array} periods - Moving average periods to calculate
     */
    analyze(periods = [5, 10, 20, 50]) {
        if (this.stockData.length === 0) {
            throw new Error('No stock data available. Call initialize() first.');
        }

        console.log(`\n=== Stock Analysis for ${this.symbol} ===`);
        console.log(`Data points: ${this.stockData.length}`);
        console.log(`Latest price: $${this.stockData[this.stockData.length - 1].close.toFixed(2)}`);
        
        // Calculate moving averages
        const movingAverages = this.maCalculator.calculateMultipleSMA(this.stockData, periods);
        
        // Display results
        Object.keys(movingAverages).forEach(key => {
            if (movingAverages[key].length > 0) {
                const latest = movingAverages[key][movingAverages[key].length - 1];
                console.log(`${key}: $${latest.sma.toFixed(2)}`);
            }
        });

        // Generate trading signals
        if (movingAverages.sma5 && movingAverages.sma20) {
            const signals = this.maCalculator.generateSignals(movingAverages.sma5, movingAverages.sma20);
            const recentSignals = signals.slice(-5); // Last 5 signals
            
            console.log('\n=== Recent Trading Signals (5-day vs 20-day MA) ===');
            recentSignals.forEach(signal => {
                console.log(`${signal.date}: ${signal.signal} - Price: $${signal.price.toFixed(2)}`);
            });
        }

        return {
            stockData: this.stockData,
            movingAverages: movingAverages,
            symbol: this.symbol
        };
    }

    /**
     * Get basic statistics
     */
    getStatistics() {
        if (this.stockData.length === 0) {
            throw new Error('No stock data available.');
        }

        const prices = this.stockData.map(d => d.close);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const currentPrice = prices[prices.length - 1];
        
        return {
            symbol: this.symbol,
            dataPoints: this.stockData.length,
            currentPrice: parseFloat(currentPrice.toFixed(2)),
            high: parseFloat(maxPrice.toFixed(2)),
            low: parseFloat(minPrice.toFixed(2)),
            change: parseFloat(((currentPrice - prices[0]) / prices[0] * 100).toFixed(2))
        };
    }
}

module.exports = StockAnalyzer;