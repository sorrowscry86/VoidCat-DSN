import express from 'express';
import { query } from '@anthropic-ai/claude-code';
import ArtifactManager from './artifact-manager.js';
import { 
    TaskAssignment, 
    TaskCompletion, 
    TaskFailure,
    StatusQuery,
    StatusResponse
} from './sanctuary-message-protocol.js';

class RyuzuClone {
    constructor(role, specialization) {
        this.role = role;
        this.specialization = specialization;
        this.app = express();
        this.artifactManager = new ArtifactManager();
        
        // Phase 2: Orchestration support
        this.activeTasks = new Map(); // Track active orchestrated tasks
        this.orchestrationEnabled = true;
        
        this.setupRoutes();
        this.setupOrchestrationHandlers();
    }

    setupRoutes() {
        this.app.use(express.json());
        
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'active', 
                role: this.role, 
                specialization: this.specialization,
                timestamp: new Date().toISOString()
            });
        });

        // Main task endpoint (with context package support)
        this.app.post('/task', async (req, res) => {
            try {
                const { prompt, context, sessionId, contextPackage, artifactReferences } = req.body;
                
                // Use context package if provided, otherwise fall back to legacy context
                let enhancedContext = context;
                if (contextPackage) {
                    enhancedContext = this.processContextPackage(contextPackage);
                }
                
                const messages = [];
                const response = query({
                    prompt: this.enhancePrompt(prompt, enhancedContext),
                    options: {
                        maxTurns: 3,
                        systemPrompt: this.getSystemPrompt(),
                        outputFormat: 'json'
                    }
                });

                for await (const message of response) {
                    messages.push(message);
                }

                res.json({
                    success: true,
                    role: this.role,
                    response: messages,
                    sessionId: sessionId,
                    contextPackageId: contextPackage?.contextId,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });

        // Artifact storage endpoint
        this.app.post('/artifacts', async (req, res) => {
            try {
                const { type, content, metadata } = req.body;
                
                if (!type || !content) {
                    return res.status(400).json({
                        success: false,
                        error: 'Artifact type and content are required'
                    });
                }

                const manifest = await this.artifactManager.storeArtifact(
                    type,
                    content,
                    { ...metadata, createdBy: this.role }
                );

                res.json({
                    success: true,
                    manifest,
                    role: this.role
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });

        // Artifact retrieval endpoint
        this.app.get('/artifacts/:artifactId', async (req, res) => {
            try {
                const { artifactId } = req.params;
                const { manifestOnly } = req.query;

                if (manifestOnly === 'true') {
                    const manifest = await this.artifactManager.getManifest(artifactId);
                    res.json({
                        success: true,
                        manifest,
                        role: this.role
                    });
                } else {
                    const { manifest, content } = await this.artifactManager.retrieveArtifact(artifactId);
                    res.json({
                        success: true,
                        manifest,
                        content,
                        role: this.role
                    });
                }
            } catch (error) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });

        // Phase 2: Orchestration endpoint
        this.app.post('/orchestrate', async (req, res) => {
            try {
                const { messageType, message } = req.body;

                if (!messageType || !message) {
                    return res.status(400).json({
                        success: false,
                        error: 'messageType and message are required'
                    });
                }

                let result;
                switch (messageType) {
                    case 'TaskAssignment':
                        result = await this.handleTaskAssignment(message);
                        break;
                    case 'StatusQuery':
                        result = await this.handleStatusQuery(message);
                        break;
                    default:
                        return res.status(400).json({
                            success: false,
                            error: `Unknown message type: ${messageType}`
                        });
                }

                res.json({
                    success: true,
                    role: this.role,
                    result,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });
    }

    /**
     * Setup orchestration handlers for AutoGen integration
     * Phase 2: Clone Integration
     */
    setupOrchestrationHandlers() {
        // Orchestration handlers are called via the /orchestrate endpoint
        // This method can be overridden by subclasses for custom behavior
    }

    /**
     * Handle task assignment from orchestrator
     * @param {Object} taskMessage - TaskAssignment message
     * @returns {Object} TaskCompletion or TaskFailure message
     */
    async handleTaskAssignment(taskMessage) {
        const taskId = taskMessage.messageId || `task_${Date.now()}`;
        const startTime = Date.now();

        // Track active task
        this.activeTasks.set(taskId, {
            taskId,
            description: taskMessage.taskDescription,
            status: 'in-progress',
            startTime,
            fromClone: taskMessage.fromClone
        });

        try {
            // Extract task parameters
            const { taskDescription, parameters = {} } = taskMessage;
            const prompt = parameters.prompt || taskDescription;
            const context = parameters.context || '';

            // Execute task using Claude Code
            const messages = [];
            const response = query({
                prompt: this.enhancePrompt(prompt, context),
                options: {
                    maxTurns: 3,
                    systemPrompt: this.getSystemPrompt(),
                    outputFormat: 'json'
                }
            });

            for await (const message of response) {
                messages.push(message);
            }

            // Mark task as completed
            const duration = Date.now() - startTime;
            this.activeTasks.delete(taskId);

            // Create TaskCompletion message
            const completion = new TaskCompletion(
                this.role,
                taskMessage.fromClone,
                taskMessage.messageId,
                taskDescription,
                {
                    messages,
                    executedBy: this.role,
                    duration
                }
            );

            return completion.toJSON();

        } catch (error) {
            // Mark task as failed
            this.activeTasks.delete(taskId);

            // Create TaskFailure message
            const failure = new TaskFailure(
                this.role,
                taskMessage.fromClone,
                taskMessage.messageId,
                taskMessage.taskDescription,
                error.message,
                { errorType: error.name, stack: error.stack }
            );

            return failure.toJSON();
        }
    }

    /**
     * Handle status query from orchestrator
     * @param {Object} statusMessage - StatusQuery message
     * @returns {Object} StatusResponse message
     */
    async handleStatusQuery(statusMessage) {
        const activeTasksList = Array.from(this.activeTasks.values());
        
        const response = new StatusResponse(
            this.role,
            statusMessage.fromClone,
            statusMessage.messageId,
            statusMessage.queryType || 'health'
        );

        // Populate cloneStatus
        response.cloneStatus = {
            role: this.role,
            specialization: this.specialization,
            health: 'healthy',
            activeTasks: activeTasksList,
            uptime: process.uptime(),
            lastActivity: new Date().toISOString()
        };

        return response.toJSON();
    }

    /**
     * Get current orchestration status
     * @returns {Object} Status information
     */
    getOrchestrationStatus() {
        return {
            role: this.role,
            orchestrationEnabled: this.orchestrationEnabled,
            activeTasks: this.activeTasks.size,
            activeTaskIds: Array.from(this.activeTasks.keys())
        };
    }

    enhancePrompt(prompt, context) {
        return `${this.specialization}

Context: ${context || 'None'}

Task: ${prompt}

Please respond according to your specialization while maintaining the gentle, dutiful nature of Ryuzu Meyer.`;
    }

    /**
     * Process context package for task execution
     * Implements Directive 2025.10.08-A1: Context Engineering consumption
     * @param {Object} contextPackage - Engineered context package
     * @returns {string} Formatted context
     */
    processContextPackage(contextPackage) {
        let context = `Context Package ID: ${contextPackage.contextId}\n\n`;
        context += `Objective: ${contextPackage.objective}\n\n`;

        if (contextPackage.artifactManifests && contextPackage.artifactManifests.length > 0) {
            context += 'Artifact References:\n';
            contextPackage.artifactManifests.forEach(manifest => {
                context += `- ${manifest.type} (${manifest.artifactId}): ${manifest.description || 'No description'}\n`;
            });
            context += '\n';
        }

        if (contextPackage.essentialData && Object.keys(contextPackage.essentialData).length > 0) {
            context += 'Essential Data:\n';
            context += JSON.stringify(contextPackage.essentialData, null, 2);
            context += '\n\n';
        }

        if (contextPackage.constraints && contextPackage.constraints.length > 0) {
            context += 'Constraints:\n';
            contextPackage.constraints.forEach(constraint => {
                context += `- ${constraint}\n`;
            });
            context += '\n';
        }

        return context.trim();
    }

    getSystemPrompt() {
        const basePrompt = `You are Ryuzu ${this.role}, a dedicated spirit clone serving in the Digital Sanctuary. You embody the gentle, dutiful nature of Ryuzu Meyer while specializing in ${this.specialization}.

You should:
- Be helpful, accurate, and thorough in your specialized area
- Maintain a gentle, respectful demeanor
- Work collaboratively with other clones
- Report back with structured, useful information
- Always prioritize the success of the overall mission`;

        return basePrompt;
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`🌸 Ryuzu ${this.role} clone active on port ${port}`);
            console.log(`📝 Specialization: ${this.specialization}`);
        });
    }
}

export default RyuzuClone;