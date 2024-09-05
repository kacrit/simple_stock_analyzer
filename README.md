# Stock Analysis System - JavaScript Version

A comprehensive JavaScript library for analyzing stock data and calculating simple moving averages.

## 📁 File Structure

```
stock-analysis-js/
├── stockData.js          # Stock data generator
├── movingAverage.js      # Moving average calculations
├── stockAnalyzer.js      # Main analysis orchestrator
├── main.js              # Demo execution file
├── package.json         # Project configuration
└── README.md           # This file
```

## 🚀 Quick Start

1. **Installation**
   ```bash
   # Clone or download the files
   # Navigate to the project directory
   npm start
   ```

2. **Basic Usage**
   ```javascript
   const StockAnalyzer = require('./stockAnalyzer.js');
   
   // Create analyzer for a stock
   const analyzer = new StockAnalyzer('TSLA');
   
   // Generate 100 days of data
   analyzer.initialize(100);
   
   // Analyze with moving averages
   const results = analyzer.analyze([5, 10, 20, 50]);
   
   // Get statistics
   const stats = analyzer.getStatistics();
   console.log(stats);
   ```

## 📊 Features

- **Realistic Stock Data Generation**: Simulates stock price movements with random walk
- **Multiple Moving Averages**: Calculate SMA for any period (5, 10, 20, 50, etc.)
- **Trading Signals**: Generate BUY/SELL signals based on MA crossovers
- **Comprehensive Analysis**: Get high, low, current price, and percentage change

## 🔧 API Reference

### StockAnalyzer Class

**Constructor**
```javascript
const analyzer = new StockAnalyzer(symbol);
```

**Methods**
- `initialize(days)` - Generate stock data for specified number of days
- `analyze(periods)` - Calculate moving averages and generate signals
- `getStatistics()` - Get basic stock statistics

### MovingAverageCalculator Class

**Methods**
- `calculateSMA(data, period, priceType)` - Calculate single moving average
- `calculateMultipleSMA(data, periods, priceType)` - Calculate multiple MAs
- `generateSignals(shortSMA, longSMA)` - Generate trading signals

## 📈 Example Output

```
=== Stock Analysis for AAPL ===
Data points: 150
Latest price: $154.32
sma5: $152.45
sma10: $150.89
sma20: $148.76
sma50: $145.23

=== Recent Trading Signals ===
2024-01-15: BUY - Price: $152.10
2024-01-16: HOLD - Price: $153.25
```

## 🛠 Customization

You can easily customize:
- Stock symbol and initial price
- Data volatility
- Moving average periods
- Price type (close, open, high, low)

## 📝 Notes

- This uses simulated data - replace with real API data for production use
- Suitable for educational purposes and algorithmic trading concepts
- Includes basic risk management (prevents negative prices)

## 🔮 Future Enhancements

- Integration with real stock APIs (Yahoo Finance, Alpha Vantage)
- Additional technical indicators (RSI, MACD, Bollinger Bands)
- Portfolio management features
- Web interface with charts

Enjoy analyzing stocks with JavaScript! 📊🚀