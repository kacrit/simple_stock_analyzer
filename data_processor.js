/**
 * Data Processor - Processes and prepares stock data for analysis
 */

class DataProcessor {
    static validateStockData(stockData) {
        if (!Array.isArray(stockData)) {
            throw new Error('Stock data must be an array');
        }

        if (stockData.length === 0) {
            throw new Error('Stock data array is empty');
        }

        const requiredFields = ['date', 'open', 'high', 'low', 'close', 'volume'];
        
        stockData.forEach((entry, index) => {
            requiredFields.forEach(field => {
                if (!(field in entry)) {
                    throw new Error(`Missing field '${field}' in entry ${index}`);
                }
            });

            // Validate numeric fields
            if (isNaN(entry.close) || entry.close <= 0) {
                throw new Error(`Invalid close price in entry ${index}`);
            }
        });

        return true;
    }

    static calculateReturns(stockData) {
        this.validateStockData(stockData);
        
        const processedData = [...stockData];
        
        for (let i = 1; i < processedData.length; i++) {
            const currentClose = processedData[i].close;
            const previousClose = processedData[i - 1].close;
            const dailyReturn = ((currentClose - previousClose) / previousClose) * 100;
            
            processedData[i] = {
                ...processedData[i],
                dailyReturn: parseFloat(dailyReturn.toFixed(4))
            };
        }

        return processedData;
    }

    static filterByDateRange(stockData, startDate, endDate) {
        this.validateStockData(stockData);
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return stockData.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= start && entryDate <= end;
        });
    }

    static getClosingPrices(stockData) {
        this.validateStockData(stockData);
        return stockData.map(entry => entry.close);
    }

    static getTradingVolume(stockData) {
        this.validateStockData(stockData);
        return stockData.map(entry => entry.volume);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataProcessor;
}