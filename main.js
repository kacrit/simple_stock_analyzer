/**
 * Main execution file - Stock Analysis Demo
 * Demonstrates the stock analysis system
 */

const StockAnalyzer = require('./stockAnalyzer.js');

function main() {
    console.log('🚀 Stock Analysis System - JavaScript Version');
    console.log('=============================================\n');
    
    try {
        // Analyze Apple stock
        const appleAnalyzer = new StockAnalyzer('AAPL');
        appleAnalyzer.initialize(150); // Generate 150 days of data
        
        const analysis = appleAnalyzer.analyze([5, 10, 20, 50]);
        
        // Display statistics
        const stats = appleAnalyzer.getStatistics();
        console.log('\n=== Stock Statistics ===');
        console.log(`Symbol: ${stats.symbol}`);
        console.log(`Current Price: $${stats.currentPrice}`);
        console.log(`Period High: $${stats.high}`);
        console.log(`Period Low: $${stats.low}`);
        console.log(`Total Change: ${stats.change}%`);
        
        // Sample recent data
        console.log('\n=== Sample Recent Data (Last 5 days) ===');
        const recentData = analysis.stockData.slice(-5);
        recentData.forEach(day => {
            console.log(`${day.date}: O:$${day.open.toFixed(2)} H:$${day.high.toFixed(2)} L:$${day.low.toFixed(2)} C:$${day.close.toFixed(2)}`);
        });
        
    } catch (error) {
        console.error('Error in stock analysis:', error.message);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = main;