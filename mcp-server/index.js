#!/usr/bin/env node

/**
 * Digital Sanctuary Network MCP Server
 * 
 * Exposes the Ryuzu clone network capabilities as MCP tools for Claude Desktop/Code.
 * Each clone's specialized capabilities are accessible through standardized tool interfaces.
 * 
 * Inspired by Ryuzu Meyer's gentle, dutiful nature from Re:Zero.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Clone network configuration
const CLONE_ENDPOINTS = {
  omega: process.env.OMEGA_URL || 'http://localhost:3000',
  beta: process.env.BETA_URL || 'http://localhost:3002',
  gamma: process.env.GAMMA_URL || 'http://localhost:3003',
  delta: process.env.DELTA_URL || 'http://localhost:3004',
  sigma: process.env.SIGMA_URL || 'http://localhost:3005'
};

const CLONE_SPECIALIZATIONS = {
  omega: 'Task orchestration, coordination, and clone network management',
  beta: 'Code analysis, debugging, security review',
  gamma: 'System design, architecture planning',
  delta: 'Quality assurance, testing, validation',
  sigma: 'Documentation, user interaction, communication'
};

/**
 * Helper function to make HTTP requests to clone endpoints
 */
async function callCloneEndpoint(clone, endpoint, method = 'GET', body = null) {
  const url = `${CLONE_ENDPOINTS[clone]}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to call ${clone} clone: ${error.message}`);
  }
}

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'digital-sanctuary-network',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool definitions for the clone network
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Health check tool
      {
        name: 'sanctuary_health_check',
        description: 'Check the health status of all clones in the Digital Sanctuary Network. Returns the operational status of Omega, Beta, Gamma, Delta, and Sigma clones.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      
      // Beta clone - Code analysis and security
      {
        name: 'sanctuary_beta_analyze',
        description: 'Ask Beta (the Analyzer) to perform code analysis, debugging, or security review. Beta specializes in identifying vulnerabilities, performance issues, and code quality problems.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The analysis task or question to ask Beta',
            },
            context: {
              type: 'string',
              description: 'Additional context about the code or system being analyzed',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for conversation continuity',
            },
          },
          required: ['prompt'],
        },
      },

      // Gamma clone - Architecture and design
      {
        name: 'sanctuary_gamma_design',
        description: 'Ask Gamma (the Architect) to design system architecture, plan technical infrastructure, or provide technology recommendations. Gamma specializes in scalable system design and architectural patterns.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The design task or architectural question to ask Gamma',
            },
            context: {
              type: 'string',
              description: 'Additional context about requirements, constraints, or existing systems',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for conversation continuity',
            },
          },
          required: ['prompt'],
        },
      },

      // Delta clone - Testing and QA
      {
        name: 'sanctuary_delta_test',
        description: 'Ask Delta (the Tester) to develop testing strategies, create test cases, or provide quality assurance guidance. Delta specializes in comprehensive testing approaches and quality metrics.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The testing task or QA question to ask Delta',
            },
            context: {
              type: 'string',
              description: 'Additional context about the system or features to be tested',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for conversation continuity',
            },
          },
          required: ['prompt'],
        },
      },

      // Sigma clone - Documentation and communication
      {
        name: 'sanctuary_sigma_document',
        description: 'Ask Sigma (the Communicator) to create documentation, write explanations, or develop communication materials. Sigma specializes in clear, user-friendly documentation and knowledge sharing.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The documentation task or communication question to ask Sigma',
            },
            context: {
              type: 'string',
              description: 'Additional context about the audience, format, or content requirements',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for conversation continuity',
            },
          },
          required: ['prompt'],
        },
      },

      // Omega clone - Coordination and orchestration
      {
        name: 'sanctuary_omega_orchestrate',
        description: 'Ask Omega (the Coordinator) to orchestrate complex multi-clone tasks, coordinate project workflows, or provide strategic guidance. Omega can delegate work to other clones and synthesize their results.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'The coordination task or strategic question to ask Omega',
            },
            context: {
              type: 'string',
              description: 'Additional context about the project, goals, or constraints',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for conversation continuity',
            },
          },
          required: ['prompt'],
        },
      },

      // Specialized orchestration with context engineering
      {
        name: 'sanctuary_omega_delegate',
        description: 'Use Omega to delegate a task to a specific clone with optimized context engineering. This provides better quality than direct clone access by using minimal, high-relevance context packages.',
        inputSchema: {
          type: 'object',
          properties: {
            targetClone: {
              type: 'string',
              description: 'Target clone: beta, gamma, delta, or sigma',
              enum: ['beta', 'gamma', 'delta', 'sigma'],
            },
            objective: {
              type: 'string',
              description: 'The task objective to accomplish',
            },
            essentialData: {
              type: 'object',
              description: 'Essential data needed for the task (JSON object)',
            },
            constraints: {
              type: 'array',
              description: 'Array of constraint strings',
              items: {
                type: 'string',
              },
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for conversation continuity',
            },
          },
          required: ['targetClone', 'objective'],
        },
      },

      // Artifact management
      {
        name: 'sanctuary_store_artifact',
        description: 'Store an artifact (code, document, configuration) in the centralized sanctuary workspace with version control and checksums.',
        inputSchema: {
          type: 'object',
          properties: {
            clone: {
              type: 'string',
              description: 'Clone to store through: omega, beta, gamma, delta, or sigma',
              enum: ['omega', 'beta', 'gamma', 'delta', 'sigma'],
            },
            type: {
              type: 'string',
              description: 'Artifact type (e.g., code, document, configuration)',
            },
            content: {
              type: 'string',
              description: 'Artifact content',
            },
            metadata: {
              type: 'object',
              description: 'Additional metadata (description, version, etc.)',
            },
          },
          required: ['clone', 'type', 'content'],
        },
      },

      // Artifact retrieval
      {
        name: 'sanctuary_get_artifact',
        description: 'Retrieve an artifact from the sanctuary workspace by its ID.',
        inputSchema: {
          type: 'object',
          properties: {
            clone: {
              type: 'string',
              description: 'Clone to retrieve from: omega, beta, gamma, delta, or sigma',
              enum: ['omega', 'beta', 'gamma', 'delta', 'sigma'],
            },
            artifactId: {
              type: 'string',
              description: 'Artifact ID (UUID format)',
            },
            manifestOnly: {
              type: 'boolean',
              description: 'If true, return only the manifest without content',
            },
          },
          required: ['clone', 'artifactId'],
        },
      },
    ],
  };
});

/**
 * Tool execution handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'sanctuary_health_check': {
        const healthResults = {};
        
        for (const [cloneName, endpoint] of Object.entries(CLONE_ENDPOINTS)) {
          try {
            const health = await callCloneEndpoint(cloneName, '/health');
            healthResults[cloneName] = {
              status: health.status,
              role: health.role,
              specialization: health.specialization,
              timestamp: health.timestamp,
            };
          } catch (error) {
            healthResults[cloneName] = {
              status: 'unreachable',
              error: error.message,
            };
          }
        }

        const allHealthy = Object.values(healthResults).every(
          result => result.status === 'active'
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                networkStatus: allHealthy ? 'healthy' : 'degraded',
                clones: healthResults,
                timestamp: new Date().toISOString(),
              }, null, 2),
            },
          ],
        };
      }

      case 'sanctuary_beta_analyze':
      case 'sanctuary_gamma_design':
      case 'sanctuary_delta_test':
      case 'sanctuary_sigma_document':
      case 'sanctuary_omega_orchestrate': {
        // Extract clone name from tool name
        const cloneMap = {
          sanctuary_beta_analyze: 'beta',
          sanctuary_gamma_design: 'gamma',
          sanctuary_delta_test: 'delta',
          sanctuary_sigma_document: 'sigma',
          sanctuary_omega_orchestrate: 'omega',
        };
        
        const clone = cloneMap[name];
        const result = await callCloneEndpoint(clone, '/task', 'POST', {
          prompt: args.prompt,
          context: args.context || '',
          sessionId: args.sessionId || null,
        });

        // Extract the actual response content
        const responseContent = result.response && result.response.length > 0
          ? result.response.map(msg => msg.content).join('\n\n')
          : 'No response generated';

        return {
          content: [
            {
              type: 'text',
              text: `🌸 ${result.role} Clone Response:\n\n${responseContent}\n\n---\nSession: ${result.sessionId || 'none'}\nTimestamp: ${result.timestamp}`,
            },
          ],
        };
      }

      case 'sanctuary_omega_delegate': {
        const result = await callCloneEndpoint('omega', '/orchestrate', 'POST', {
          objective: args.objective,
          targetClone: args.targetClone,
          essentialData: args.essentialData || {},
          constraints: args.constraints || [],
          sessionId: args.sessionId || null,
        });

        const responseContent = result.result.response && result.result.response.length > 0
          ? result.result.response.map(msg => msg.content).join('\n\n')
          : 'No response generated';

        return {
          content: [
            {
              type: 'text',
              text: `👑 Omega Orchestrated Delegation to ${result.targetClone}:\n\nContext Quality: ${result.contextPackage.quality.overallQuality}%\n\n${responseContent}\n\n---\nContext ID: ${result.contextPackage.contextId}\nTimestamp: ${result.timestamp}`,
            },
          ],
        };
      }

      case 'sanctuary_store_artifact': {
        const result = await callCloneEndpoint(args.clone, '/artifacts', 'POST', {
          type: args.type,
          content: args.content,
          metadata: args.metadata || {},
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: result.success,
                artifactId: result.manifest.artifactId,
                type: result.manifest.type,
                checksum: result.manifest.checksum,
                size: result.manifest.size,
                location: result.manifest.location,
                timestamp: result.manifest.timestamp,
                createdBy: result.manifest.metadata.createdBy,
              }, null, 2),
            },
          ],
        };
      }

      case 'sanctuary_get_artifact': {
        const endpoint = `/artifacts/${args.artifactId}${args.manifestOnly ? '?manifestOnly=true' : ''}`;
        const result = await callCloneEndpoint(args.clone, endpoint, 'GET');

        if (args.manifestOnly) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: result.success,
                  manifest: result.manifest,
                }, null, 2),
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: result.success,
                  manifest: result.manifest,
                  content: result.content,
                }, null, 2),
              },
            ],
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the MCP server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('🏰 Digital Sanctuary Network MCP Server started');
  console.error('🌸 Clone network ready for Claude Desktop/Code integration');
  console.error(`📡 Endpoints: ${Object.keys(CLONE_ENDPOINTS).join(', ')}`);
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
