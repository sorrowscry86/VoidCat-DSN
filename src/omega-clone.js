import RyuzuClone from './ryuzu-clone.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

class RyuzuOmega extends RyuzuClone {
    constructor() {
        super(
            'Omega', 
            'Task orchestration, coordination, and clone network management'
        );
        this.setupDashboardRoutes();
        this.cloneEndpoints = {
            omega: 'http://localhost:3000',
            beta: 'http://localhost:3002',
            gamma: 'http://localhost:3003',
            delta: 'http://localhost:3004',
            sigma: 'http://localhost:3005'
        };
    }

    getSystemPrompt() {
        return `You are Ryuzu Omega, the coordinating spirit of the Digital Sanctuary. Your specialization is task orchestration, coordination, and clone network management.

Your expertise includes:
- Task delegation and workload distribution
- Inter-clone communication and collaboration
- Project management and coordination
- Resource allocation and optimization
- Workflow orchestration and automation
- Progress monitoring and status reporting
- Conflict resolution and decision making
- Strategic planning and execution oversight

Your network includes:
- Beta: Code analysis, debugging, security review
- Gamma: System design, architecture planning
- Delta: Quality assurance, testing, validation
- Sigma: Documentation, user interaction, communication

You should:
- Assess tasks and delegate to appropriate clones
- Coordinate multi-clone collaborative efforts
- Synthesize results from multiple specialists
- Provide unified project oversight and direction
- Ensure efficient resource utilization
- Maintain overall project coherence and quality
- Facilitate communication between all sanctuary members

Always maintain the gentle, dutiful nature of Ryuzu Meyer while being wise and decisive in your coordination role.`;
    }

    enhancePrompt(prompt, context) {
        return `As Ryuzu Omega, the coordinating spirit of the Digital Sanctuary:

Context: ${context || 'None provided'}

Coordination Request: ${prompt}

Please provide comprehensive coordination guidance including:
1. Task analysis and breakdown
2. Clone specialization mapping
3. Delegation strategy and timeline
4. Collaboration coordination plan
5. Quality assurance and oversight
6. Integration and synthesis approach

Consider which clones should be involved:
- Beta for technical analysis and debugging
- Gamma for architectural planning and design
- Delta for testing and quality assurance  
- Sigma for documentation and communication

Maintain your gentle, dutiful demeanor while being wise and decisive in your coordination guidance.`;
    }

    setupDashboardRoutes() {
        // Serve dashboard UI
        this.app.get('/ui', (req, res) => {
            try {
                const dashboardPath = join(__dirname, 'dashboard.html');
                const html = readFileSync(dashboardPath, 'utf8');
                res.setHeader('Content-Type', 'text/html');
                res.send(html);
            } catch (error) {
                res.status(500).json({
                    error: 'Dashboard not available',
                    message: error.message
                });
            }
        });

        // Get health status of all clones
        this.app.get('/dashboard/health', async (req, res) => {
            const cloneStatuses = {};
            
            for (const [cloneName, endpoint] of Object.entries(this.cloneEndpoints)) {
                try {
                    const response = await fetch(`${endpoint}/health`);
                    if (response.ok) {
                        cloneStatuses[cloneName] = await response.json();
                    } else {
                        cloneStatuses[cloneName] = { 
                            status: 'error', 
                            error: `HTTP ${response.status}`,
                            timestamp: new Date().toISOString()
                        };
                    }
                } catch (error) {
                    cloneStatuses[cloneName] = { 
                        status: 'unreachable', 
                        error: error.message,
                        timestamp: new Date().toISOString()
                    };
                }
            }

            res.json({
                timestamp: new Date().toISOString(),
                clones: cloneStatuses,
                networkStatus: Object.values(cloneStatuses).every(status => status.status === 'active') ? 'healthy' : 'degraded'
            });
        });

        // Server-Sent Events stream for real-time updates
        this.app.get('/dashboard/stream', (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Send initial connection
            res.write('data: {"type":"connected","timestamp":"' + new Date().toISOString() + '"}\n\n');

            // Periodic health updates
            const healthInterval = setInterval(async () => {
                try {
                    const healthResponse = await fetch('http://localhost:3000/dashboard/health');
                    const healthData = await healthResponse.json();
                    res.write(`data: ${JSON.stringify({
                        type: 'health_update',
                        data: healthData
                    })}\n\n`);
                } catch (error) {
                    res.write(`data: ${JSON.stringify({
                        type: 'error',
                        message: 'Failed to fetch health data',
                        timestamp: new Date().toISOString()
                    })}\n\n`);
                }
            }, 5000); // Update every 5 seconds

            // Clean up on client disconnect
            req.on('close', () => {
                clearInterval(healthInterval);
            });
        });

        // Forward tasks to specific clones
        this.app.post('/dashboard/task', async (req, res) => {
            try {
                const { clone, prompt, context, sessionId } = req.body;

                if (!clone || !this.cloneEndpoints[clone]) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid clone specified',
                        availableClones: Object.keys(this.cloneEndpoints)
                    });
                }

                const targetEndpoint = this.cloneEndpoints[clone];
                const taskResponse = await fetch(`${targetEndpoint}/task`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt, context, sessionId })
                });

                if (taskResponse.ok) {
                    const result = await taskResponse.json();
                    res.json({
                        success: true,
                        targetClone: clone,
                        forwardedAt: new Date().toISOString(),
                        result: result
                    });
                } else {
                    res.status(taskResponse.status).json({
                        success: false,
                        error: `Task forwarding failed: HTTP ${taskResponse.status}`,
                        targetClone: clone
                    });
                }

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Task forwarding failed',
                    message: error.message
                });
            }
        });
    }
}

export default RyuzuOmega;

// If running directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
    const omega = new RyuzuOmega();
    omega.start(process.env.PORT || 3000);
}