/**
 * Main execution file
 * Demonstrates usage of the stock analysis system
 */

const StockAnalyzer = require('./stockAnalyzer.js');

function main() {
    const analyzer = new StockAnalyzer();
    
    console.log('=== Stock Analysis System ===');
    console.log('Generating mock data and calculating moving averages...\n');
    
    try {
        // Analyze single stock
        const singleResult = analyzer.analyzeStock('AAPL', 50, [5, 10, 20]);
        analyzer.printResults(singleResult);
        
        // Analyze multiple stocks
        console.log('\n' + '='.repeat(50));
        console.log('ANALYZING MULTIPLE STOCKS');
        console.log('='.repeat(50));
        
        const multiResults = analyzer.analyzeMultipleStocks(['AAPL', 'GOOGL', 'MSFT'], 40);
        
        Object.keys(multiResults).forEach(symbol => {
            analyzer.printResults(multiResults[symbol]);
        });
        
    } catch (error) {
        console.error('Error during analysis:', error.message);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}

module.exports = { main };