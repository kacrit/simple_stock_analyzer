#!/usr/bin/env python3
"""
Stock Data Analyzer
Calculates Simple Moving Averages (SMA) for stock data
"""

import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
import json
import sys

class StockAnalyzer:
    def __init__(self):
        self.data = None
    
    def fetch_stock_data(self, symbol, period="1y"):
        """
        Fetch stock data from Yahoo Finance
        Args:
            symbol (str): Stock symbol (e.g., 'AAPL', 'GOOGL')
            period (str): Time period ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
        """
        try:
            stock = yf.Ticker(symbol)
            self.data = stock.history(period=period)
            return True
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return False
    
    def calculate_sma(self, window=20):
        """
        Calculate Simple Moving Average
        Args:
            window (int): Number of periods for SMA calculation
        Returns:
            pandas.Series: SMA values
        """
        if self.data is None:
            raise ValueError("No data available. Please fetch stock data first.")
        
        self.data[f'SMA_{window}'] = self.data['Close'].rolling(window=window).mean()
        return self.data[f'SMA_{window}']
    
    def calculate_multiple_smas(self, windows=[20, 50, 200]):
        """
        Calculate multiple SMAs
        Args:
            windows (list): List of window sizes
        Returns:
            dict: Dictionary containing all SMA series
        """
        smas = {}
        for window in windows:
            smas[f'SMA_{window}'] = self.calculate_sma(window)
        return smas
    
    def get_analysis_summary(self):
        """
        Generate analysis summary
        Returns:
            dict: Summary statistics
        """
        if self.data is None:
            return {}
        
        latest_close = self.data['Close'].iloc[-1]
        latest_sma_20 = self.data.get('SMA_20', pd.Series([None])).iloc[-1]
        latest_sma_50 = self.data.get('SMA_50', pd.Series([None])).iloc[-1]
        
        summary = {
            'latest_price': float(latest_close),
            'sma_20': float(latest_sma_20) if pd.notna(latest_sma_20) else None,
            'sma_50': float(latest_sma_50) if pd.notna(latest_sma_50) else None,
            'above_sma_20': latest_close > latest_sma_20 if pd.notna(latest_sma_20) else None,
            'above_sma_50': latest_close > latest_sma_50 if pd.notna(latest_sma_50) else None,
            'data_points': len(self.data)
        }
        
        return summary
    
    def export_to_json(self, filename=None):
        """
        Export data to JSON format
        Args:
            filename (str): Output filename
        """
        if self.data is None:
            print("No data to export")
            return
        
        if filename is None:
            filename = f"stock_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        # Prepare data for JSON serialization
        export_data = {
            'metadata': {
                'export_date': datetime.now().isoformat(),
                'data_points': len(self.data)
            },
            'analysis': self.get_analysis_summary(),
            'stock_data': []
        }
        
        for date, row in self.data.iterrows():
            stock_point = {
                'date': date.strftime('%Y-%m-%d'),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': int(row['Volume'])
            }
            
            # Add SMA columns if they exist
            for col in self.data.columns:
                if col.startswith('SMA_'):
                    stock_point[col.lower()] = float(row[col]) if pd.notna(row[col]) else None
            
            export_data['stock_data'].append(stock_point)
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"Data exported to {filename}")

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python stock_analyzer.py <stock_symbol> [period] [sma_window]")
        print("Example: python stock_analyzer.py AAPL 1y 20")
        sys.exit(1)
    
    symbol = sys.argv[1]
    period = sys.argv[2] if len(sys.argv) > 2 else "1y"
    sma_window = int(sys.argv[3]) if len(sys.argv) > 3 else 20
    
    analyzer = StockAnalyzer()
    
    print(f"Analyzing {symbol} for period {period}...")
    
    if analyzer.fetch_stock_data(symbol, period):
        analyzer.calculate_sma(sma_window)
        summary = analyzer.get_analysis_summary()
        
        print("\n=== ANALYSIS SUMMARY ===")
        print(f"Symbol: {symbol}")
        print(f"Latest Price: ${summary['latest_price']:.2f}")
        print(f"SMA {sma_window}: ${summary.get(f'sma_{sma_window}', 'N/A'):.2f}")
        print(f"Price above SMA {sma_window}: {summary.get(f'above_sma_{sma_window}', 'N/A')}")
        print(f"Data points analyzed: {summary['data_points']}")
        
        # Export to JSON
        analyzer.export_to_json(f"{symbol}_analysis.json")
    else:
        print(f"Failed to fetch data for {symbol}")

if __name__ == "__main__":
    main()