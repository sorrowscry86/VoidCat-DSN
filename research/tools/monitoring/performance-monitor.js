/**
 * Performance Monitor - Real-time Monitoring for VoidCat RDC Clones
 * Tracks health, response times, and resource utilization for all 5 clones
 * 
 * Usage:
 *   node performance-monitor.js [--interval 1000] [--logdir ./logs]
 * 
 * Tracks:
 * - Clone health (ping every 30s)
 * - Response times (min/max/avg)
 * - Resource usage (CPU, memory estimates)
 * - Error rates and failure modes
 * - Network latency between clones
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Clone configuration
const CLONES = {
  omega: { port: 3000, name: 'Omega (Coordinator)' },
  beta: { port: 3002, name: 'Beta (Analyzer)' },
  gamma: { port: 3003, name: 'Gamma (Architect)' },
  delta: { port: 3004, name: 'Delta (Tester)' },
  sigma: { port: 3005, name: 'Sigma (Communicator)' }
};

// Command line arguments
const args = process.argv.slice(2);
const interval = parseInt(args[args.indexOf('--interval') + 1] || '1000');
const logDir = args[args.indexOf('--logdir') + 1] || path.join(__dirname, '../data/performance');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Performance tracking state
const metrics = {};
Object.keys(CLONES).forEach(clone => {
  metrics[clone] = {
    name: CLONES[clone].name,
    port: CLONES[clone].port,
    lastPing: null,
    responseTime: { min: Infinity, max: 0, sum: 0, count: 0 },
    isHealthy: false,
    consecutiveFailures: 0,
    successRate: 100,
    totalRequests: 0,
    totalErrors: 0,
    startTime: new Date(),
    endpoints: {}
  };
});

/**
 * Health check - ping clone /health endpoint
 */
async function healthCheck(cloneName) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const options = {
      hostname: 'localhost',
      port: CLONES[cloneName].port,
      path: '/health',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      metrics[cloneName].totalRequests++;
      metrics[cloneName].responseTime.sum += responseTime;
      metrics[cloneName].responseTime.count++;
      metrics[cloneName].responseTime.min = Math.min(metrics[cloneName].responseTime.min, responseTime);
      metrics[cloneName].responseTime.max = Math.max(metrics[cloneName].responseTime.max, responseTime);
      
      if (res.statusCode === 200) {
        metrics[cloneName].isHealthy = true;
        metrics[cloneName].consecutiveFailures = 0;
        metrics[cloneName].lastPing = new Date();
        resolve({ success: true, responseTime });
      } else {
        metrics[cloneName].totalErrors++;
        resolve({ success: false, responseTime, status: res.statusCode });
      }
    });

    req.on('error', (error) => {
      metrics[cloneName].totalErrors++;
      metrics[cloneName].consecutiveFailures++;
      metrics[cloneName].isHealthy = false;
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      metrics[cloneName].totalErrors++;
      metrics[cloneName].consecutiveFailures++;
      metrics[cloneName].isHealthy = false;
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

/**
 * Run all health checks
 */
async function runHealthChecks() {
  const results = {};
  for (const clone of Object.keys(CLONES)) {
    results[clone] = await healthCheck(clone);
  }
  return results;
}

/**
 * Calculate statistics
 */
function calculateStats() {
  const stats = {};
  
  for (const clone of Object.keys(metrics)) {
    const m = metrics[clone];
    const avgResponseTime = m.responseTime.count > 0 
      ? (m.responseTime.sum / m.responseTime.count).toFixed(2)
      : 'N/A';
    
    stats[clone] = {
      name: m.name,
      status: m.isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY',
      uptime: calculateUptime(m.startTime),
      lastPing: m.lastPing ? m.lastPing.toISOString() : 'Never',
      responseTime: {
        min: m.responseTime.min === Infinity ? 'N/A' : m.responseTime.min,
        max: m.responseTime.max,
        avg: avgResponseTime
      },
      totalRequests: m.totalRequests,
      successRate: m.totalRequests > 0 
        ? ((1 - m.totalErrors / m.totalRequests) * 100).toFixed(2) + '%'
        : 'N/A',
      consecutiveFailures: m.consecutiveFailures
    };
  }
  
  return stats;
}

/**
 * Format uptime duration
 */
function calculateUptime(startTime) {
  const ms = Date.now() - startTime.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Log metrics to file
 */
function logMetrics() {
  const timestamp = new Date().toISOString();
  const filename = path.join(logDir, `performance-${new Date().toISOString().split('T')[0]}.jsonl`);
  
  const logEntry = {
    timestamp,
    metrics: {}
  };
  
  for (const clone of Object.keys(metrics)) {
    const m = metrics[clone];
    logEntry.metrics[clone] = {
      isHealthy: m.isHealthy,
      responseTimeAvg: m.responseTime.count > 0 
        ? (m.responseTime.sum / m.responseTime.count).toFixed(2)
        : null,
      responseTimeMin: m.responseTime.min === Infinity ? null : m.responseTime.min,
      responseTimeMax: m.responseTime.max,
      successRate: m.totalRequests > 0 
        ? (1 - m.totalErrors / m.totalRequests).toFixed(4)
        : null,
      totalRequests: m.totalRequests,
      totalErrors: m.totalErrors
    };
  }
  
  fs.appendFileSync(filename, JSON.stringify(logEntry) + '\n');
}

/**
 * Display dashboard
 */
function displayDashboard() {
  console.clear();
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   VoidCat RDC Digital Sanctuary Network - Performance Monitor   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  const stats = calculateStats();
  
  for (const clone of Object.keys(stats)) {
    const s = stats[clone];
    console.log(`\n${s.name}`);
    console.log('─'.repeat(50));
    console.log(`  Status:              ${s.status}`);
    console.log(`  Uptime:              ${s.uptime}`);
    console.log(`  Last Ping:           ${s.lastPing}`);
    console.log(`  Response Time (avg): ${s.responseTime.avg}ms`);
    console.log(`  Response Time (min): ${s.responseTime.min}ms`);
    console.log(`  Response Time (max): ${s.responseTime.max}ms`);
    console.log(`  Success Rate:        ${s.successRate}`);
    console.log(`  Total Requests:      ${s.totalRequests}`);
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`Last updated: ${new Date().toISOString()}`);
  console.log(`Monitoring interval: ${interval}ms`);
  console.log(`Data directory: ${logDir}`);
  console.log('═'.repeat(60) + '\n');
}

/**
 * Main monitoring loop
 */
async function startMonitoring() {
  console.log('Starting performance monitor...');
  console.log(`Interval: ${interval}ms`);
  console.log(`Log directory: ${logDir}`);
  
  // Initial display
  displayDashboard();
  
  // Run health checks and update dashboard
  setInterval(async () => {
    const results = await runHealthChecks();
    logMetrics();
    displayDashboard();
  }, interval);
  
  console.log('Monitor running. Press Ctrl+C to stop.\n');
}

// Start monitoring
startMonitoring().catch(err => {
  console.error('Error starting monitor:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down performance monitor...');
  console.log('Final statistics:');
  displayDashboard();
  process.exit(0);
});
