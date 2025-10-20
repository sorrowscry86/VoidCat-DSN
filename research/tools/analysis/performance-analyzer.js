/**
 * Performance Analyzer - Statistical analysis of collected performance data
 * Processes JSONL files from performance monitor and generates insights
 * 
 * Usage:
 *   node performance-analyzer.js [--input-dir ../data/performance] [--output report.json]
 * 
 * Generates:
 * - Statistical summaries (mean, median, stddev)
 * - Percentile analysis (p50, p95, p99, p99.9)
 * - Trend detection
 * - Anomaly identification
 * - Clone comparison reports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const args = process.argv.slice(2);
const inputDir = args[args.indexOf('--input-dir') + 1] 
  || path.join(__dirname, '../data/performance');
const outputFile = args[args.indexOf('--output') + 1] || 'performance-analysis.json';

/**
 * Calculate statistics from array of numbers
 */
function calculateStats(values) {
  if (values.length === 0) return null;
  
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stddev = Math.sqrt(variance);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: mean.toFixed(2),
    median: sorted[Math.floor(sorted.length / 2)],
    stddev: stddev.toFixed(2),
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
    p999: sorted[Math.floor(sorted.length * 0.999)],
    count: values.length
  };
}

/**
 * Read and parse performance log files
 */
function readPerformanceLogs(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith('performance-') && f.endsWith('.jsonl'))
    .sort();
  
  const allData = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n').filter(l => l);
    
    for (const line of lines) {
      try {
        allData.push(JSON.parse(line));
      } catch (e) {
        // Skip malformed lines
      }
    }
  }
  
  return allData;
}

/**
 * Analyze performance data
 */
function analyzePerformance(data) {
  if (data.length === 0) {
    return { error: 'No performance data found' };
  }
  
  const analysis = {
    totalSamples: data.length,
    dateRange: {
      start: data[0].timestamp,
      end: data[data.length - 1].timestamp
    },
    byClone: {},
    trends: {}
  };
  
  // Group by clone
  const clones = new Set();
  const cloneData = {};
  
  for (const entry of data) {
    for (const [clone, metrics] of Object.entries(entry.metrics)) {
      clones.add(clone);
      
      if (!cloneData[clone]) {
        cloneData[clone] = {
          responseTimes: [],
          successRates: [],
          requestCounts: [],
          errorCounts: [],
          samples: 0
        };
      }
      
      if (metrics.responseTimeAvg) {
        cloneData[clone].responseTimes.push(parseFloat(metrics.responseTimeAvg));
      }
      if (metrics.successRate !== null) {
        cloneData[clone].successRates.push(metrics.successRate * 100);
      }
      cloneData[clone].requestCounts.push(metrics.totalRequests || 0);
      cloneData[clone].errorCounts.push(metrics.totalErrors || 0);
      cloneData[clone].samples++;
    }
  }
  
  // Calculate statistics per clone
  for (const [clone, metrics] of Object.entries(cloneData)) {
    analysis.byClone[clone] = {
      samples: metrics.samples,
      responseTime: calculateStats(metrics.responseTimes),
      successRate: calculateStats(metrics.successRates),
      totalRequests: metrics.requestCounts.reduce((a, b) => a + b, 0),
      totalErrors: metrics.errorCounts.reduce((a, b) => a + b, 0)
    };
  }
  
  // Identify trends
  const recentData = data.slice(Math.max(0, data.length - 20));
  const olderData = data.slice(0, Math.min(20, data.length));
  
  for (const clone of clones) {
    const recentAvg = recentData
      .filter(d => d.metrics[clone] && d.metrics[clone].responseTimeAvg)
      .map(d => parseFloat(d.metrics[clone].responseTimeAvg))
      .reduce((a, b) => a + b, 0) / recentData.length || 0;
    
    const olderAvg = olderData
      .filter(d => d.metrics[clone] && d.metrics[clone].responseTimeAvg)
      .map(d => parseFloat(d.metrics[clone].responseTimeAvg))
      .reduce((a, b) => a + b, 0) / olderData.length || 0;
    
    const change = olderAvg > 0 ? (((recentAvg - olderAvg) / olderAvg) * 100).toFixed(2) : 0;
    
    analysis.trends[clone] = {
      recentAvgResponseTime: recentAvg.toFixed(2),
      olderAvgResponseTime: olderAvg.toFixed(2),
      changePercent: parseFloat(change),
      trend: change > 5 ? 'degrading' : change < -5 ? 'improving' : 'stable'
    };
  }
  
  return analysis;
}

/**
 * Generate human-readable report
 */
function generateReport(analysis) {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║        Performance Analysis Report - Statistical Summary      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  if (analysis.error) {
    console.log('⚠️  ' + analysis.error);
    return;
  }
  
  console.log(`📊 Analysis Overview`);
  console.log('─'.repeat(50));
  console.log(`Total Samples: ${analysis.totalSamples}`);
  console.log(`Date Range: ${analysis.dateRange.start} to ${analysis.dateRange.end}`);
  
  console.log('\n📈 Response Time Statistics (ms)');
  console.log('─'.repeat(50));
  console.log('Clone          Min    Mean    Median   P95    P99    Count');
  console.log('─'.repeat(50));
  
  for (const [clone, stats] of Object.entries(analysis.byClone)) {
    const rt = stats.responseTime;
    if (rt) {
      console.log(
        `${clone.padEnd(14)} ${rt.min.toString().padEnd(6)} ` +
        `${rt.mean.toString().padEnd(7)} ${rt.median.toString().padEnd(8)} ` +
        `${rt.p95.toString().padEnd(6)} ${rt.p99.toString().padEnd(6)} ${rt.count}`
      );
    }
  }
  
  console.log('\n✅ Success Rates (%)');
  console.log('─'.repeat(50));
  console.log('Clone          Min    Mean    Max     StdDev');
  console.log('─'.repeat(50));
  
  for (const [clone, stats] of Object.entries(analysis.byClone)) {
    const sr = stats.successRate;
    if (sr) {
      console.log(
        `${clone.padEnd(14)} ${sr.min.toString().padEnd(6)} ` +
        `${sr.mean.toString().padEnd(7)} ${sr.max.toString().padEnd(7)} ${sr.stddev}`
      );
    }
  }
  
  console.log('\n📊 Trends Analysis');
  console.log('─'.repeat(50));
  
  for (const [clone, trend] of Object.entries(analysis.trends)) {
    const trendIcon = trend.trend === 'degrading' ? '📉' : trend.trend === 'improving' ? '📈' : '➡️';
    console.log(
      `${clone.padEnd(10)} ${trendIcon} ${trend.trend.padEnd(10)} ` +
      `(${trend.changePercent > 0 ? '+' : ''}${trend.changePercent}%)`
    );
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');
}

/**
 * Main analysis
 */
async function performAnalysis() {
  console.log('Reading performance logs from:', inputDir);
  
  const data = readPerformanceLogs(inputDir);
  console.log(`Found ${data.length} samples`);
  
  const analysis = analyzePerformance(data);
  
  // Save analysis
  fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
  console.log(`\nAnalysis saved to: ${outputFile}`);
  
  // Display report
  generateReport(analysis);
}

performAnalysis().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
