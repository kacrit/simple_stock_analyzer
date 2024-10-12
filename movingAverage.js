/**
 * Moving Average Calculator
 * Calculates simple moving averages for stock data
 */

class MovingAverageCalculator {
    /**
     * Calculate simple moving average
     * @param {Array} prices - Array of price objects
     * @param {number} period - Moving average period (e.g., 5, 10, 20)
     * @returns {Array} Array of moving average values
     */
    calculateSMA(prices, period) {
        if (!Array.isArray(prices) || prices.length < period) {
            throw new Error(`Insufficient data for ${period}-day SMA. Need at least ${period} data points.`);
        }

        const sma = [];
        
        for (let i = period - 1; i < prices.length; i++) {
            let sum = 0;
            for (let j = i - period + 1; j <= i; j++) {
                sum += prices[j].price;
            }
            const average = sum / period;
            sma.push({
                date: prices[i].date,
                sma: parseFloat(average.toFixed(2)),
                price: prices[i].price,
                period: period
            });
        }
        
        return sma;
    }

    /**
     * Calculate multiple moving averages
     * @param {Array} prices - Array of price objects
     * @param {Array} periods - Array of periods to calculate
     * @returns {Object} Object containing SMAs for each period
     */
    calculateMultipleSMAs(prices, periods = [5, 10, 20]) {
        const results = {};
        
        periods.forEach(period => {
            results[`sma_${period}`] = this.calculateSMA(prices, period);
        });
        
        return results;
    }

    /**
     * Analyze crossover signals
     * @param {Array} shortSMA - Shorter period SMA
     * @param {Array} longSMA - Longer period SMA
     * @returns {Array} Array of crossover signals
     */
    analyzeCrossovers(shortSMA, longSMA) {
        const signals = [];
        const minLength = Math.min(shortSMA.length, longSMA.length);
        
        for (let i = 1; i < minLength; i++) {
            const prevShort = shortSMA[i-1].sma;
            const prevLong = longSMA[i-1].sma;
            const currShort = shortSMA[i].sma;
            const currLong = longSMA[i].sma;
            
            let signal = 'HOLD';
            
            // Golden cross: short crosses above long
            if (prevShort <= prevLong && currShort > currLong) {
                signal = 'BUY';
            }
            // Death cross: short crosses below long
            else if (prevShort >= prevLong && currShort < currLong) {
                signal = 'SELL';
            }
            
            if (signal !== 'HOLD') {
                signals.push({
                    date: shortSMA[i].date,
                    signal: signal,
                    shortSMA: currShort,
                    longSMA: currLong,
                    price: shortSMA[i].price
                });
            }
        }
        
        return signals;
    }
}

module.exports = MovingAverageCalculator;