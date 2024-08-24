/**
 * Moving Average Calculator
 * Calculates simple moving averages for stock data
 */

class MovingAverageCalculator {
    /**
     * Calculate simple moving average for a given period
     * @param {Array} data - Array of stock data objects
     * @param {number} period - Number of periods for the moving average
     * @param {string} priceType - Type of price to use ('close', 'open', 'high', 'low')
     * @returns {Array} Array of moving average values
     */
    calculateSMA(data, period = 20, priceType = 'close') {
        if (!data || data.length < period) {
            throw new Error(`Insufficient data. Need at least ${period} data points.`);
        }

        const smaValues = [];
        
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = i - period + 1; j <= i; j++) {
                sum += data[j][priceType];
            }
            const average = sum / period;
            smaValues.push({
                date: data[i].date,
                sma: parseFloat(average.toFixed(2)),
                price: data[i][priceType]
            });
        }
        
        return smaValues;
    }

    /**
     * Calculate multiple moving averages
     * @param {Array} data - Array of stock data objects
     * @param {Array} periods - Array of periods for moving averages
     * @param {string} priceType - Type of price to use
     * @returns {Object} Object containing multiple SMA arrays
     */
    calculateMultipleSMA(data, periods = [5, 10, 20], priceType = 'close') {
        const result = {};
        
        periods.forEach(period => {
            try {
                result[`sma${period}`] = this.calculateSMA(data, period, priceType);
            } catch (error) {
                console.warn(`Could not calculate SMA${period}: ${error.message}`);
                result[`sma${period}`] = [];
            }
        });
        
        return result;
    }

    /**
     * Generate trading signals based on moving average crossovers
     * @param {Array} shortSMA - Shorter period SMA data
     * @param {Array} longSMA - Longer period SMA data
     * @returns {Array} Array of signal objects
     */
    generateSignals(shortSMA, longSMA) {
        const signals = [];
        const minLength = Math.min(shortSMA.length, longSMA.length);
        
        for (let i = 1; i < minLength; i++) {
            const shortPrev = shortSMA[i-1].sma;
            const longPrev = longSMA[i-1].sma;
            const shortCurrent = shortSMA[i].sma;
            const longCurrent = longSMA[i].sma;
            
            let signal = 'HOLD';
            
            // Golden cross: short MA crosses above long MA
            if (shortPrev <= longPrev && shortCurrent > longCurrent) {
                signal = 'BUY';
            }
            // Death cross: short MA crosses below long MA
            else if (shortPrev >= longPrev && shortCurrent < longCurrent) {
                signal = 'SELL';
            }
            
            signals.push({
                date: shortSMA[i].date,
                signal: signal,
                shortSMA: shortCurrent,
                longSMA: longCurrent,
                price: shortSMA[i].price
            });
        }
        
        return signals;
    }
}

module.exports = MovingAverageCalculator;