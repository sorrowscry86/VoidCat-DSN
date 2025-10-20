/**
 * Interaction Logger - Records all clone-to-clone communication
 * Captures HTTP requests/responses, orchestration events, and context engineering
 * 
 * Usage:
 *   node interaction-logger.js [--logdir ../data/interactions] [--intercept-port 9000]
 * 
 * This proxy intercepts and logs all clone communications for analysis
 * Particularly useful for studying:
 * - Omega coordination patterns
 * - Context engineering effectiveness
 * - Clone communication efficiency
 * - Inter-clone message flows
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Transform } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const args = process.argv.slice(2);
const logDir = args[args.indexOf('--logdir') + 1] || path.join(__dirname, '../data/interactions');
const interceptPort = parseInt(args[args.indexOf('--intercept-port') + 1] || '9000');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Session tracking
const sessions = {};
let sessionCounter = 0;

/**
 * Clone mapping for request forwarding
 */
const CLONE_TARGETS = {
  omega: { port: 3000, name: 'Omega' },
  beta: { port: 3002, name: 'Beta' },
  gamma: { port: 3003, name: 'Gamma' },
  delta: { port: 3004, name: 'Delta' },
  sigma: { port: 3005, name: 'Sigma' }
};

/**
 * Parse clone name from request hostname/path
 */
function getTargetClone(pathname) {
  for (const [clone, config] of Object.entries(CLONE_TARGETS)) {
    if (pathname.includes(clone)) {
      return clone;
    }
  }
  // Default to first path segment
  const match = pathname.match(/^\/([^\/]+)/);
  return match ? match[1] : 'omega';
}

/**
 * Log interaction to file
 */
function logInteraction(interaction) {
  const date = new Date().toISOString().split('T')[0];
  const filename = path.join(logDir, `interactions-${date}.jsonl`);
  
  // Sanitize large response bodies
  if (interaction.response.body && interaction.response.body.length > 10000) {
    interaction.response.bodySummary = `[${interaction.response.body.length} bytes]`;
    delete interaction.response.body;
  }
  if (interaction.request.body && interaction.request.body.length > 10000) {
    interaction.request.bodySummary = `[${interaction.request.body.length} bytes]`;
    delete interaction.request.body;
  }
  
  fs.appendFileSync(filename, JSON.stringify(interaction) + '\n');
}

/**
 * Extract request body
 */
async function extractBody(stream) {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', chunk => {
      data += chunk.toString();
    });
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
}

/**
 * Create intercepting proxy
 */
function createInterceptingProxy() {
  const server = http.createServer(async (req, res) => {
    const interactionId = ++sessionCounter;
    const startTime = Date.now();
    
    try {
      // Extract request body
      let requestBody = '';
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        requestBody = await extractBody(req);
      }
      
      // Determine target clone
      const targetClone = getTargetClone(req.url);
      const targetConfig = CLONE_TARGETS[targetClone];
      
      if (!targetConfig) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Unknown clone' }));
        return;
      }
      
      // Forward request to clone
      const options = {
        hostname: 'localhost',
        port: targetConfig.port,
        path: req.url.replace(`/${targetClone}`, ''),
        method: req.method,
        headers: {
          ...req.headers,
          'x-forwarded-for': req.socket.remoteAddress,
          'x-interaction-id': interactionId
        }
      };
      
      // Make upstream request
      await new Promise((resolve, reject) => {
        const upstream = http.request(options, (upstreamRes) => {
          let responseBody = '';
          
          upstreamRes.on('data', chunk => {
            responseBody += chunk.toString();
            res.write(chunk);
          });
          
          upstreamRes.on('end', () => {
            const endTime = Date.now();
            
            // Log interaction
            const interaction = {
              timestamp: new Date().toISOString(),
              interactionId,
              duration: endTime - startTime,
              source: {
                ip: req.socket.remoteAddress,
                method: req.method,
                url: req.url
              },
              target: {
                clone: targetClone,
                name: targetConfig.name,
                port: targetConfig.port
              },
              request: {
                method: req.method,
                path: req.url,
                headers: req.headers,
                bodyLength: requestBody.length,
                body: requestBody.length < 5000 ? requestBody : null
              },
              response: {
                status: upstreamRes.statusCode,
                headers: upstreamRes.headers,
                bodyLength: responseBody.length,
                body: responseBody.length < 5000 ? responseBody : null
              }
            };
            
            logInteraction(interaction);
            res.end();
            resolve();
          });
          
          upstreamRes.on('error', reject);
        });
        
        upstream.on('error', reject);
        
        // Send request body
        if (requestBody) {
          upstream.write(requestBody);
        }
        
        upstream.end();
      });
      
    } catch (error) {
      console.error(`Error in interaction ${interactionId}:`, error.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  });
  
  return server;
}

/**
 * Statistics generator
 */
function generateStatistics() {
  const date = new Date().toISOString().split('T')[0];
  const filename = path.join(logDir, `interactions-${date}.jsonl`);
  
  if (!fs.existsSync(filename)) {
    return null;
  }
  
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.trim().split('\n').filter(l => l.trim());
  
  const stats = {
    totalInteractions: lines.length,
    byClone: {},
    byEndpoint: {},
    byStatus: {},
    totalDuration: 0,
    avgDuration: 0,
    minDuration: Infinity,
    maxDuration: 0
  };
  
  for (const line of lines) {
    const interaction = JSON.parse(line);
    
    // Track by clone
    if (!stats.byClone[interaction.target.clone]) {
      stats.byClone[interaction.target.clone] = 0;
    }
    stats.byClone[interaction.target.clone]++;
    
    // Track by endpoint
    if (!stats.byEndpoint[interaction.request.path]) {
      stats.byEndpoint[interaction.request.path] = 0;
    }
    stats.byEndpoint[interaction.request.path]++;
    
    // Track by status
    const status = interaction.response.status;
    if (!stats.byStatus[status]) {
      stats.byStatus[status] = 0;
    }
    stats.byStatus[status]++;
    
    // Duration stats
    stats.totalDuration += interaction.duration;
    stats.minDuration = Math.min(stats.minDuration, interaction.duration);
    stats.maxDuration = Math.max(stats.maxDuration, interaction.duration);
  }
  
  stats.avgDuration = stats.totalInteractions > 0 
    ? (stats.totalDuration / stats.totalInteractions).toFixed(2)
    : 0;
  stats.minDuration = stats.minDuration === Infinity ? 0 : stats.minDuration;
  
  return stats;
}

/**
 * Display dashboard
 */
function displayDashboard() {
  console.clear();
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║        Interaction Logger - Clone Communication Monitor        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  const stats = generateStatistics();
  
  if (stats) {
    console.log('📊 Today\'s Statistics');
    console.log('─'.repeat(50));
    console.log(`  Total Interactions:  ${stats.totalInteractions}`);
    console.log(`  Avg Duration:        ${stats.avgDuration}ms`);
    console.log(`  Min Duration:        ${stats.minDuration}ms`);
    console.log(`  Max Duration:        ${stats.maxDuration}ms`);
    
    console.log('\n📍 By Clone:');
    for (const [clone, count] of Object.entries(stats.byClone)) {
      console.log(`  ${clone.padEnd(10)}: ${count} interactions`);
    }
    
    console.log('\n🔗 Top Endpoints:');
    const sortedEndpoints = Object.entries(stats.byEndpoint)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    for (const [endpoint, count] of sortedEndpoints) {
      console.log(`  ${endpoint.padEnd(20)}: ${count} calls`);
    }
    
    console.log('\n📈 Response Status Codes:');
    for (const [status, count] of Object.entries(stats.byStatus)) {
      console.log(`  ${status.padEnd(4)}: ${count} responses`);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`Listening on: http://localhost:${interceptPort}`);
  console.log(`Log directory: ${logDir}`);
  console.log(`Forward requests to: http://localhost:${interceptPort}/[clone]/[endpoint]`);
  console.log('═'.repeat(60) + '\n');
}

/**
 * Start interaction logger
 */
async function startLogger() {
  const server = createInterceptingProxy();
  
  server.listen(interceptPort, '127.0.0.1', () => {
    console.log(`Interaction Logger started on port ${interceptPort}`);
    console.log(`Logging directory: ${logDir}`);
    displayDashboard();
  });
  
  // Update dashboard every 5 seconds
  setInterval(displayDashboard, 5000);
  
  console.log('Logger running. Press Ctrl+C to stop.\n');
  
  return server;
}

// Start the logger
startLogger().catch(err => {
  console.error('Error starting logger:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down interaction logger...');
  displayDashboard();
  process.exit(0);
});
