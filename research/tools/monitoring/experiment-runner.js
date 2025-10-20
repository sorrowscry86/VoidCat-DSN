/**
 * Experiment Runner - Standardized experiment execution for research
 * Coordinates monitoring, data collection, and result storage
 * 
 * Usage:
 *   node experiment-runner.js <config-file> [--output-dir ../data/experiments]
 * 
 * Configuration file format (JSON):
 * {
 *   "experimentId": "EXP-001",
 *   "title": "Baseline Performance Test",
 *   "objective": "Establish baseline response times",
 *   "duration": 60000,
 *   "tasks": [
 *     {"clone": "beta", "endpoint": "/task", "payload": {...}, "count": 100}
 *   ]
 * }
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const args = process.argv.slice(2);
const configFile = args[0];
const outputDir = args[args.indexOf('--output-dir') + 1] 
  || path.join(__dirname, '../data/experiments');

// Validate config file
if (!configFile) {
  console.error('Usage: node experiment-runner.js <config-file>');
  process.exit(1);
}

if (!fs.existsSync(configFile)) {
  console.error(`Config file not found: ${configFile}`);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load configuration
let config;
try {
  config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} catch (error) {
  console.error('Error parsing config file:', error.message);
  process.exit(1);
}

// Clone port mapping
const CLONE_PORTS = {
  beta: 3002,
  gamma: 3003,
  delta: 3004,
  sigma: 3005,
  omega: 3000
};

// Experiment state
const experiment = {
  config,
  startTime: new Date(),
  endTime: null,
  results: {
    tasks: [],
    summary: {},
    errors: []
  },
  currentTask: 0
};

/**
 * Execute a single task
 */
async function executeTask(task, taskIndex) {
  return new Promise((resolve) => {
    const clonePort = CLONE_PORTS[task.clone];
    if (!clonePort) {
      experiment.results.errors.push(`Unknown clone: ${task.clone}`);
      resolve({ success: false, error: 'Unknown clone' });
      return;
    }
    
    const taskStartTime = Date.now();
    const results = [];
    let completed = 0;
    
    // Execute task multiple times
    for (let i = 0; i < task.count; i++) {
      setTimeout(() => {
        const requestStart = Date.now();
        
        const options = {
          hostname: 'localhost',
          port: clonePort,
          path: task.endpoint,
          method: task.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        };
        
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            const requestEnd = Date.now();
            results.push({
              duration: requestEnd - requestStart,
              statusCode: res.statusCode,
              success: res.statusCode === 200
            });
            completed++;
          });
        });
        
        req.on('error', (error) => {
          results.push({
            duration: Date.now() - requestStart,
            error: error.message,
            success: false
          });
          completed++;
        });
        
        req.on('timeout', () => {
          results.push({
            duration: Date.now() - requestStart,
            error: 'Timeout',
            success: false
          });
          completed++;
        });
        
        if (task.payload) {
          req.write(JSON.stringify(task.payload));
        }
        req.end();
      }, i * 100); // Spread requests over time
    }
    
    // Wait for all requests to complete
    const checkInterval = setInterval(() => {
      if (completed >= task.count) {
        clearInterval(checkInterval);
        
        const taskEndTime = Date.now();
        const successful = results.filter(r => r.success).length;
        const avgDuration = results.length > 0
          ? (results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length).toFixed(2)
          : 0;
        
        const taskResult = {
          taskIndex,
          clone: task.clone,
          endpoint: task.endpoint,
          count: task.count,
          completed,
          successful,
          successRate: ((successful / task.count) * 100).toFixed(2) + '%',
          avgDuration: avgDuration + 'ms',
          totalDuration: (taskEndTime - taskStartTime) + 'ms',
          results
        };
        
        experiment.results.tasks.push(taskResult);
        resolve(taskResult);
      }
    }, 100);
  });
}

/**
 * Run all tasks
 */
async function runExperiment() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║              Experiment Runner - Task Execution                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Experiment: ${config.experimentId} - ${config.title}`);
  console.log(`Objective: ${config.objective}`);
  console.log(`Tasks: ${config.tasks.length}\n`);
  
  // Execute each task sequentially
  for (let i = 0; i < config.tasks.length; i++) {
    const task = config.tasks[i];
    console.log(`[${i + 1}/${config.tasks.length}] Executing task: ${task.clone}.${task.endpoint} x${task.count}`);
    
    const result = await executeTask(task, i);
    console.log(`  ✓ Success Rate: ${result.successRate}`);
    console.log(`  ✓ Avg Duration: ${result.avgDuration}`);
    console.log(`  ✓ Total Time: ${result.totalDuration}\n`);
  }
  
  experiment.endTime = new Date();
  
  // Calculate summary
  const allResults = experiment.results.tasks;
  if (allResults.length > 0) {
    const totalTasks = allResults.reduce((sum, t) => sum + t.count, 0);
    const totalSuccessful = allResults.reduce((sum, t) => sum + t.successful, 0);
    
    experiment.results.summary = {
      totalTasks,
      totalSuccessful,
      overallSuccessRate: ((totalSuccessful / totalTasks) * 100).toFixed(2) + '%',
      totalDuration: (experiment.endTime - experiment.startTime) + 'ms',
      avgTaskDuration: (experiment.endTime - experiment.startTime) / allResults.length,
      startTime: experiment.startTime.toISOString(),
      endTime: experiment.endTime.toISOString()
    };
  }
  
  // Save results
  const resultsFile = path.join(
    outputDir,
    `${config.experimentId}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  
  fs.writeFileSync(resultsFile, JSON.stringify(experiment.results, null, 2));
  
  // Display summary
  console.log('═'.repeat(60));
  console.log('📊 Experiment Summary');
  console.log('─'.repeat(60));
  console.log(`Total Tasks: ${experiment.results.summary.totalTasks}`);
  console.log(`Successful: ${experiment.results.summary.totalSuccessful}`);
  console.log(`Success Rate: ${experiment.results.summary.overallSuccessRate}`);
  console.log(`Total Duration: ${experiment.results.summary.totalDuration}`);
  console.log(`Results File: ${resultsFile}`);
  console.log('═'.repeat(60) + '\n');
}

// Run experiment
runExperiment().catch(err => {
  console.error('Error running experiment:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nExperiment interrupted');
  process.exit(1);
});
