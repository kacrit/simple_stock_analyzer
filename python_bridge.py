#!/usr/bin/env python3
"""
Python Bridge - Handles stock analysis calculations and moving averages
"""

import sys
import json
import pandas as pd
import numpy as np
from typing import List, Dict, Any

class StockAnalyzer:
    def __init__(self):
        self.data = None
    
    def load_data(self, data: List[Dict]) -> None:
        """Load stock data from JSON"""
        self.data = pd.DataFrame(data)
        if 'date' in self.data.columns:
            self.data['date'] = pd.to_datetime(self.data['date'])
            self.data.set_index('date', inplace=True)
    
    def calculate_sma(self, window: int = 20) -> List[float]:
        """Calculate Simple Moving Average"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("No data loaded")
        
        if window > len(self.data):
            raise ValueError(f"Window size {window} exceeds data length {len(self.data)}")
        
        sma = self.data['close'].rolling(window=window).mean()
        return sma.fillna(0).tolist()
    
    def calculate_ema(self, window: int = 20) -> List[float]:
        """Calculate Exponential Moving Average"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("No data loaded")
        
        ema = self.data['close'].ewm(span=window, adjust=False).mean()
        return ema.fillna(0).tolist()
    
    def calculate_rsi(self, window: int = 14) -> List[float]:
        """Calculate Relative Strength Index"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("No data loaded")
        
        delta = self.data['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi.fillna(50).tolist()  # Default to 50 for initial periods
    
    def calculate_bollinger_bands(self, window: int = 20, num_std: int = 2) -> Dict[str, List[float]]:
        """Calculate Bollinger Bands"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("No data loaded")
        
        sma = self.data['close'].rolling(window=window).mean()
        std = self.data['close'].rolling(window=window).std()
        
        upper_band = sma + (std * num_std)
        lower_band = sma - (std * num_std)
        
        return {
            'sma': sma.fillna(0).tolist(),
            'upper_band': upper_band.fillna(0).tolist(),
            'lower_band': lower_band.fillna(0).tolist()
        }
    
    def get_basic_statistics(self) -> Dict[str, float]:
        """Calculate basic statistics for the stock data"""
        if self.data is None or len(self.data) == 0:
            raise ValueError("No data loaded")
        
        returns = self.data['close'].pct_change().dropna()
        
        return {
            'mean_return': float(returns.mean()),
            'volatility': float(returns.std()),
            'sharpe_ratio': float(returns.mean() / returns.std() if returns.std() != 0 else 0),
            'total_return': float((self.data['close'].iloc[-1] / self.data['close'].iloc[0] - 1) * 100),
            'max_drawdown': float((self.data['close'] / self.data['close'].cummax() - 1).min() * 100)
        }

def main():
    """Main function to handle command line execution"""
    if len(sys.argv) != 3:
        print("Usage: python python_bridge.py <command> <json_data>")
        sys.exit(1)
    
    command = sys.argv[1]
    json_data = sys.argv[2]
    
    try:
        data = json.loads(json_data)
        analyzer = StockAnalyzer()
        analyzer.load_data(data)
        
        result = {}
        
        if command == 'sma':
            result['sma_20'] = analyzer.calculate_sma(20)
            result['sma_50'] = analyzer.calculate_sma(50)
        elif command == 'ema':
            result['ema_20'] = analyzer.calculate_ema(20)
            result['ema_50'] = analyzer.calculate_ema(50)
        elif command == 'rsi':
            result['rsi'] = analyzer.calculate_rsi(14)
        elif command == 'bollinger':
            result['bollinger_bands'] = analyzer.calculate_bollinger_bands()
        elif command == 'stats':
            result['statistics'] = analyzer.get_basic_statistics()
        elif command == 'all':
            result['sma_20'] = analyzer.calculate_sma(20)
            result['sma_50'] = analyzer.calculate_sma(50)
            result['ema_20'] = analyzer.calculate_ema(20)
            result['rsi'] = analyzer.calculate_rsi(14)
            result['bollinger_bands'] = analyzer.calculate_bollinger_bands()
            result['statistics'] = analyzer.get_basic_statistics()
        else:
            raise ValueError(f"Unknown command: {command}")
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()