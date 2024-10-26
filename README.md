## Stock Analysis JavaScript System

A simple JavaScript library for analyzing stock data and calculating moving averages with crossover signals.

## Installation

1. Save all files in the same directory
2. No additional dependencies required (uses native JavaScript)

## Usage

### Basic Usage

Run the main analysis:
```bash
node main.js
```

### Programmatic Usage

```javascript
const StockAnalyzer = require('./stockAnalyzer.js');

// Create analyzer instance
const analyzer = new StockAnalyzer();

// Analyze single stock
const results = analyzer.analyzeStock('AAPL', 50, [5, 10, 20]);
console.log(results);

// Analyze multiple stocks
const multiResults = analyzer.analyzeMultipleStocks(['AAPL', 'GOOGL', 'MSFT'], 40);
```

### Individual Components

You can also use individual components:

```javascript
const StockDataGenerator = require('./stockData.js');
const MovingAverageCalculator = require('./movingAverage.js');

// Generate mock data
const generator = new StockDataGenerator();
const stockData = generator.generateData(30, 100);

// Calculate moving averages
const calculator = new MovingAverageCalculator();
const sma5 = calculator.calculateSMA(stockData, 5);
const sma20 = calculator.calculateSMA(stockData, 20);

// Analyze crossovers
const signals = calculator.analyzeCrossovers(sma5, sma20);
```

## Features

- **Mock Data Generation**: Generates realistic stock price data
- **Simple Moving Average (SMA)**: Calculates SMAs for any period
- **Multiple Period Support**: Calculate multiple SMAs simultaneously
- **Crossover Analysis**: Detects golden cross and death cross signals
- **Multi-stock Analysis**: Analyze multiple stocks in batch

## Output

The system provides:
- Current stock price
- Moving average values
- Crossover buy/sell signals
- Recent price history
- Printable formatted results

## Customization

- Modify `volatility` in `stockData.js` for more/less price variation
- Add different periods in the `analyzeStock` method
- Extend with additional technical indicators

## Note

This uses mock data for demonstration. For real-world usage, replace the data generator with actual stock data API integration.