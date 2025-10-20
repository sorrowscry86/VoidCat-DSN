/**
 * AutoGen Runtime Manager
 * 
 * Manages AutoGen runtime initialization and clone-level integration
 * Provides bridge between Ryuzu clones and AutoGen framework
 * 
 * Implements Directive DSN-2025.10.19-AFT: AutoGen Foundation Phase 1
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { RyuzuOrchestratorAgent, TaskDelegation, TaskResult, ErrorReport } from './ryuzu-orchestrator-agent.js';
import {
    TaskAssignment,
    TaskAcknowledgment,
    TaskCompletion,
    TaskFailure,
    StatusQuery,
    StatusResponse,
    ErrorEscalation,
    RecoveryAction,
    SanctuaryMessageRouter
} from './sanctuary-message-protocol.js';

/**
 * AutoGenRuntimeManager
 * 
 * Manages:
 * - AutoGen runtime initialization
 * - Clone registration and discovery
 * - Task delegation and tracking
 * - Message routing
 * - Error recovery
 * - Audit trail
 */
export class AutoGenRuntimeManager {
    constructor(orchestratorConfig = {}) {
        this.orchestrator = null;
        this.messageRouter = new SanctuaryMessageRouter();
        this.cloneRegistry = new Map();
        this.taskTracker = new Map();
        this.config = {
            orchestratorRole: 'Omega',
            orchestratorPort: 3000,
            healthCheckInterval: 30000, // 30 seconds
            taskTimeout: 300000, // 5 minutes
            ...orchestratorConfig
        };

        this.initialized = false;
        this.runningHealthChecks = new Map();
    }

    /**
     * Initialize AutoGen runtime for DSN
     * Sets up orchestrator and registers default clones
     */
    async initialize() {
        if (this.initialized) {
            console.log('⚠️  AutoGen Runtime already initialized');
            return;
        }

        console.log('🚀 Initializing AutoGen Runtime for Digital Sanctuary Network');

        // Create orchestrator
        this.orchestrator = new RyuzuOrchestratorAgent(
            this.config.orchestratorRole,
            'Digital Sanctuary Network Coordination'
        );

        console.log(`✅ Orchestrator initialized: Ryuzu ${this.config.orchestratorRole}`);

        // Register default clone network
        this.registerDefaultClones();

        this.initialized = true;
        console.log('✅ AutoGen Runtime initialized and ready');

        // Start health checks
        this.startHealthChecks();
    }

    /**
     * Register default Ryuzu clone network
     * Pre-configures Beta, Gamma, Delta, Sigma clones
     */
    registerDefaultClones() {
        const defaultClones = [
            {
                name: 'beta',
                role: 'Beta',
                specialization: 'Code Analysis & Security Review',
                port: 3002
            },
            {
                name: 'gamma',
                role: 'Gamma',
                specialization: 'System Architecture & Design',
                port: 3003
            },
            {
                name: 'delta',
                role: 'Delta',
                specialization: 'Testing & Quality Assurance',
                port: 3004
            },
            {
                name: 'sigma',
                role: 'Sigma',
                specialization: 'Documentation & Communication',
                port: 3005
            }
        ];

        defaultClones.forEach(clone => {
            this.registerClone(clone.name, {
                role: clone.role,
                specialization: clone.specialization,
                port: clone.port,
                baseUrl: `http://localhost:${clone.port}`
            });
        });

        // Configure orchestrator clone registry
        defaultClones.forEach(clone => {
            this.orchestrator.registerClone(clone.name, {
                specialization: clone.specialization,
                port: clone.port
            });
        });

        console.log('✅ Default clone network registered with orchestrator');
    }

    /**
     * Register a clone with the runtime
     * @param {string} cloneName - Clone identifier (e.g., 'beta', 'gamma')
     * @param {Object} cloneInfo - Clone configuration
     */
    registerClone(cloneName, cloneInfo) {
        this.cloneRegistry.set(cloneName, {
            name: cloneName,
            role: cloneInfo.role,
            specialization: cloneInfo.specialization,
            port: cloneInfo.port,
            baseUrl: cloneInfo.baseUrl,
            status: 'registered',
            lastHealthCheck: null,
            registeredAt: new Date().toISOString()
        });

        console.log(`📝 Clone registered: ${cloneName} (${cloneInfo.role})`);
    }

    /**
     * Delegate a task via AutoGen orchestration
     * 
     * @param {string} targetClone - Clone to receive task
     * @param {string} taskDescription - Task description
     * @param {Object} parameters - Task parameters
     * @returns {Promise<Object>} Task delegation result
     */
    async delegateTask(targetClone, taskDescription, parameters = {}) {
        if (!this.initialized) {
            throw new Error('AutoGen Runtime not initialized');
        }

        // Validate clone exists
        if (!this.cloneRegistry.has(targetClone)) {
            throw new Error(`Clone '${targetClone}' not found in registry`);
        }

        const taskId = `task_${Date.now()}_${uuidv4().slice(0, 8)}`;
        const taskType = parameters.taskType || 'general';

        console.log(`📤 Delegating task to ${targetClone}: ${taskDescription.slice(0, 50)}...`);

        try {
            // Create task delegation via orchestrator
            const delegation = this.orchestrator.delegateTask(
                taskId,
                targetClone,
                taskDescription,
                parameters
            );

            // Create AutoGen TaskAssignment message
            const taskAssignment = new TaskAssignment(
                this.config.orchestratorRole,
                targetClone,
                taskDescription,
                taskType,
                parameters
            );

            // Queue message for delivery
            this.messageRouter.queueMessage(taskAssignment);

            // Send task to clone
            const cloneInfo = this.cloneRegistry.get(targetClone);
            const response = await this.sendTaskToClone(targetClone, {
                taskId,
                taskDescription,
                taskType,
                parameters,
                messageId: taskAssignment.messageId
            });

            // Track task
            this.taskTracker.set(taskId, {
                taskId,
                targetClone,
                description: taskDescription,
                status: 'delegated',
                messageId: taskAssignment.messageId,
                startTime: new Date(),
                response: response
            });

            console.log(`✅ Task ${taskId} delegated to ${targetClone}`);

            return {
                success: true,
                taskId,
                messageId: taskAssignment.messageId,
                targetClone,
                status: 'delegated'
            };

        } catch (error) {
            console.error(`❌ Failed to delegate task to ${targetClone}:`, error.message);
            throw error;
        }
    }

    /**
     * Send task directly to clone's /task endpoint
     * @param {string} cloneName - Clone name
     * @param {Object} taskData - Task data
     * @returns {Promise<Object>} Clone response
     */
    async sendTaskToClone(cloneName, taskData) {
        const cloneInfo = this.cloneRegistry.get(cloneName);
        if (!cloneInfo) {
            throw new Error(`Clone '${cloneName}' not found`);
        }

        try {
            const response = await axios.post(
                `${cloneInfo.baseUrl}/task`,
                taskData,
                { timeout: 30000 }
            );

            return response.data;
        } catch (error) {
            throw new Error(`Failed to contact clone ${cloneName}: ${error.message}`);
        }
    }

    /**
     * Record task completion from clone
     * @param {string} taskId - Task identifier
     * @param {Object} result - Task result
     */
    recordTaskCompletion(taskId, result) {
        const taskRecord = this.taskTracker.get(taskId);
        if (!taskRecord) {
            console.warn(`Task ${taskId} not found in tracker`);
            return;
        }

        taskRecord.status = 'completed';
        taskRecord.result = result;
        taskRecord.endTime = new Date();
        taskRecord.duration = taskRecord.endTime - taskRecord.startTime;

        // Update orchestrator
        this.orchestrator.recordTaskResult(
            new TaskResult(
                taskId,
                this.config.orchestratorRole,
                taskRecord.targetClone,
                true,
                result
            )
        );

        console.log(`✅ Task ${taskId} completed (${taskRecord.duration}ms)`);
    }

    /**
     * Record task failure from clone
     * @param {string} taskId - Task identifier
     * @param {Object} error - Error details
     * @param {string} severity - Error severity level
     */
    recordTaskFailure(taskId, error, severity = 'medium') {
        const taskRecord = this.taskTracker.get(taskId);
        if (!taskRecord) {
            console.warn(`Task ${taskId} not found in tracker`);
            return;
        }

        taskRecord.status = 'failed';
        taskRecord.error = error;
        taskRecord.endTime = new Date();
        taskRecord.duration = taskRecord.endTime - taskRecord.startTime;

        // Update orchestrator
        this.orchestrator.recordError(
            new ErrorReport(
                taskId,
                this.config.orchestratorRole,
                taskRecord.targetClone,
                severity,
                error.message || String(error),
                { taskDescription: taskRecord.description }
            )
        );

        console.log(`❌ Task ${taskId} failed: ${error.message || String(error)}`);
    }

    /**
     * Start periodic health checks for all clones
     */
    startHealthChecks() {
        const interval = setInterval(() => {
            this.performHealthCheck();
        }, this.config.healthCheckInterval);

        this.runningHealthChecks.set('main', interval);
        console.log('🏥 Health check cycle started');
    }

    /**
     * Perform health check on all registered clones
     */
    async performHealthCheck() {
        for (const [cloneName, cloneInfo] of this.cloneRegistry) {
            try {
                const response = await axios.get(
                    `${cloneInfo.baseUrl}/health`,
                    { timeout: 5000 }
                );

                cloneInfo.status = response.data.status || 'unknown';
                cloneInfo.lastHealthCheck = new Date().toISOString();

                if (response.data.status === 'active') {
                    console.log(`🟢 ${cloneName} is healthy`);
                } else {
                    console.warn(`🟡 ${cloneName} status: ${response.data.status}`);
                }
            } catch (error) {
                cloneInfo.status = 'offline';
                cloneInfo.lastHealthCheck = new Date().toISOString();
                console.warn(`🔴 ${cloneName} is offline: ${error.message}`);
            }
        }
    }

    /**
     * Stop health checks
     */
    stopHealthChecks() {
        for (const [key, interval] of this.runningHealthChecks) {
            clearInterval(interval);
        }
        this.runningHealthChecks.clear();
        console.log('🏥 Health check cycle stopped');
    }

    /**
     * Query clone status
     * @param {string} cloneName - Clone to query
     * @returns {Promise<Object>} Clone status
     */
    async queryCloneStatus(cloneName) {
        const cloneInfo = this.cloneRegistry.get(cloneName);
        if (!cloneInfo) {
            throw new Error(`Clone '${cloneName}' not found`);
        }

        try {
            const response = await axios.get(
                `${cloneInfo.baseUrl}/health`,
                { timeout: 5000 }
            );
            return {
                success: true,
                clone: cloneName,
                ...response.data
            };
        } catch (error) {
            return {
                success: false,
                clone: cloneName,
                error: error.message,
                lastKnownStatus: cloneInfo.status
            };
        }
    }

    /**
     * Get orchestrator status report
     * @returns {Object} Full network status
     */
    getNetworkStatus() {
        return {
            orchestrator: this.orchestrator.getStatusReport(),
            clones: Array.from(this.cloneRegistry.values()).map(clone => ({
                name: clone.name,
                role: clone.role,
                specialization: clone.specialization,
                status: clone.status,
                lastHealthCheck: clone.lastHealthCheck
            })),
            messageRouter: this.messageRouter.getStatistics(),
            tasks: {
                total: this.taskTracker.size,
                completed: Array.from(this.taskTracker.values()).filter(t => t.status === 'completed').length,
                failed: Array.from(this.taskTracker.values()).filter(t => t.status === 'failed').length,
                pending: Array.from(this.taskTracker.values()).filter(t => t.status === 'delegated').length
            }
        };
    }

    /**
     * Get audit trail
     * @returns {Array} Combined audit trail from orchestrator and router
     */
    getAuditTrail() {
        return {
            orchestrator: this.orchestrator.getAuditTrail(),
            messages: this.messageRouter.getMessageHistory(),
            tasks: Array.from(this.taskTracker.values())
        };
    }

    /**
     * Shutdown runtime
     */
    async shutdown() {
        console.log('🛑 Shutting down AutoGen Runtime...');
        
        this.stopHealthChecks();

        // Clean up resources
        this.cloneRegistry.clear();
        this.taskTracker.clear();

        this.initialized = false;
        console.log('✅ AutoGen Runtime shutdown complete');
    }
}

export default AutoGenRuntimeManager;
