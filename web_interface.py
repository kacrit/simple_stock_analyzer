#!/usr/bin/env python3
"""
Web interface for stock analysis using Flask
"""

from flask import Flask, render_template, request, jsonify
from stock_analyzer import StockAnalyzer
import json

app = Flask(__name__)

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_stock():
    """API endpoint for stock analysis"""
    try:
        symbol = request.json.get('symbol', '').upper()
        period = request.json.get('period', '1y')
        sma_windows = request.json.get('sma_windows', [20, 50])
        
        if not symbol:
            return jsonify({'error': 'Stock symbol is required'}), 400
        
        analyzer = StockAnalyzer()
        
        if analyzer.fetch_stock_data(symbol, period):
            # Calculate multiple SMAs
            for window in sma_windows:
                analyzer.calculate_sma(window)
            
            summary = analyzer.get_analysis_summary()
            
            # Prepare chart data
            chart_data = []
            for date, row in analyzer.data.iterrows():
                point = {
                    'date': date.strftime('%Y-%m-%d'),
                    'close': float(row['Close'])
                }
                
                # Add SMA values
                for window in sma_windows:
                    sma_col = f'SMA_{window}'
                    if sma_col in analyzer.data.columns:
                        point[f'sma_{window}'] = float(row[sma_col]) if pd.notna(row[sma_col]) else None
                
                chart_data.append(point)
            
            return jsonify({
                'success': True,
                'symbol': symbol,
                'summary': summary,
                'chart_data': chart_data
            })
        else:
            return jsonify({'error': f'Could not fetch data for {symbol}'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)