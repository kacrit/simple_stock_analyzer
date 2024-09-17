/**
 * Analysis Controller - Main controller that coordinates between JS and Python
 */

const { spawn } = require('child_process');
const path = require('path');

class AnalysisController {
    constructor() {
        this.pythonScriptPath = path.join(__dirname, 'python_bridge.py');
    }

    async runPythonAnalysis(command, stockData) {
        return new Promise((resolve, reject) => {
            const jsonData = JSON.stringify(stockData);
            const pythonProcess = spawn('python', [this.pythonScriptPath, command, jsonData]);

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python process exited with code ${code}: ${stderr}`));
                    return;
                }

                try {
                    const result = JSON.parse(stdout);
                    if (result.error) {
                        reject(new Error(result.error));
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse Python output: ${error.message}`));
                }
            });
        });
    }

    async analyzeStock(stockData, analysisType = 'all') {
        try {
            console.log(`Running ${analysisType} analysis on ${stockData.length} data points...`);
            
            const result = await this.runPythonAnalysis(analysisType, stockData);
            
            console.log('Analysis completed successfully');
            return {
                success: true,
                data: result,
                metadata: {
                    dataPoints: stockData.length,
                    analysisType: analysisType,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Analysis failed:', error);
            return {
                success: false,
                error: error.message,
                metadata: {
                    dataPoints: stockData.length,
                    analysisType: analysisType,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    // Convenience methods for specific analyses
    async calculateMovingAverages(stockData) {
        return this.analyzeStock(stockData, 'sma');
    }

    async calculateTechnicalIndicators(stockData) {
        return this.analyzeStock(stockData, 'all');
    }

    async getStatistics(stockData) {
        return this.analyzeStock(stockData, 'stats');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalysisController;
}