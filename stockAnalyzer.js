/**
 * Main Stock Analyzer
 * Combines data generation and analysis
 */

const StockDataGenerator = require('./stockData.js');
const MovingAverageCalculator = require('./movingAverage.js');

class StockAnalyzer {
    constructor() {
        this.dataGenerator = new StockDataGenerator();
        this.maCalculator = new MovingAverageCalculator();
    }

    /**
     * Analyze a single stock
     * @param {string} symbol - Stock symbol
     * @param {number} days - Number of days to analyze
     * @param {Array} periods - SMA periods to calculate
     * @returns {Object} Analysis results
     */
    analyzeStock(symbol = 'AAPL', days = 30, periods = [5, 10, 20]) {
        console.log(`\n=== Analyzing ${symbol} for ${days} days ===`);
        
        // Generate mock data
        const stockData = this.dataGenerator.generateData(days);
        
        // Calculate moving averages
        const smaResults = this.maCalculator.calculateMultipleSMAs(stockData, periods);
        
        // Analyze crossovers if we have at least two periods
        let crossoverSignals = [];
        if (periods.length >= 2) {
            const shortPeriod = Math.min(...periods);
            const longPeriod = Math.max(...periods);
            crossoverSignals = this.maCalculator.analyzeCrossovers(
                smaResults[`sma_${shortPeriod}`],
                smaResults[`sma_${longPeriod}`]
            );
        }
        
        // Prepare results
        const results = {
            symbol: symbol,
            analysisPeriod: days,
            currentPrice: stockData[stockData.length - 1].price,
            movingAverages: smaResults,
            crossoverSignals: crossoverSignals,
            recentData: stockData.slice(-10) // Last 10 days of data
        };
        
        return results;
    }

    /**
     * Analyze multiple stocks
     * @param {Array} symbols - Array of stock symbols
     * @param {number} days - Number of days to analyze
     * @returns {Object} Analysis results for all stocks
     */
    analyzeMultipleStocks(symbols = ['AAPL', 'GOOGL', 'MSFT'], days = 30) {
        const results = {};
        
        symbols.forEach(symbol => {
            results[symbol] = this.analyzeStock(symbol, days);
        });
        
        return results;
    }

    /**
     * Print analysis results in readable format
     * @param {Object} results - Analysis results
     */
    printResults(results) {
        console.log(`\nStock: ${results.symbol}`);
        console.log(`Current Price: $${results.currentPrice}`);
        console.log(`Analysis Period: ${results.analysisPeriod} days`);
        
        // Print moving averages
        console.log('\nMoving Averages:');
        Object.keys(results.movingAverages).forEach(key => {
            const smaData = results.movingAverages[key];
            const latestSMA = smaData[smaData.length - 1];
            console.log(`  ${key.toUpperCase()}: $${latestSMA.sma}`);
        });
        
        // Print crossover signals
        if (results.crossoverSignals.length > 0) {
            console.log('\nCrossover Signals:');
            results.crossoverSignals.forEach(signal => {
                console.log(`  ${signal.date.toDateString()}: ${signal.signal} - Price: $${signal.price}`);
            });
        } else {
            console.log('\nNo significant crossover signals detected.');
        }
        
        console.log('\nRecent Prices (last 10 days):');
        results.recentData.forEach(day => {
            console.log(`  ${day.date.toDateString()}: $${day.price}`);
        });
    }
}

module.exports = StockAnalyzer;