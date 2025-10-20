/**
 * Message Handlers for Clone Orchestration
 * 
 * Implements Phase 2: Message processing and handling
 * Provides specialized handlers for different message types
 * 
 * Handler Principles:
 * - Each message type has a dedicated handler
 * - Handlers are stateless and pure when possible
 * - Error handling is comprehensive
 * - All handlers return structured responses
 */

import {
    TaskAssignment,
    TaskAcknowledgment,
    TaskCompletion,
    TaskFailure,
    StatusQuery,
    StatusResponse,
    ErrorEscalation,
    CoordinationMessage
} from './sanctuary-message-protocol.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handle TaskAssignment messages
 * Called when a clone receives a task assignment from the orchestrator
 * 
 * @param {TaskAssignment} message - Task assignment message
 * @param {Object} clone - Clone instance that will execute the task
 * @returns {Promise<TaskAcknowledgment>} Acknowledgment message
 */
export async function handleTaskAssignment(message, clone) {
    try {
        // Validate message
        if (!message.taskDescription || !message.taskType) {
            throw new Error('Invalid TaskAssignment: missing taskDescription or taskType');
        }

        // Create acknowledgment
        const ack = new TaskAcknowledgment(
            clone.role,
            message.fromClone,
            message.messageId,
            message.taskDescription
        );

        // Set estimated completion time (default: 5 minutes)
        ack.setEstimatedCompletion(5);

        console.log(`📥 ${clone.role} received task: ${message.taskDescription.substring(0, 50)}...`);

        return ack;

    } catch (error) {
        console.error(`❌ Error handling TaskAssignment: ${error.message}`);
        throw error;
    }
}

/**
 * Handle StatusQuery messages
 * Called when the orchestrator requests status information
 * 
 * @param {StatusQuery} message - Status query message
 * @param {Object} clone - Clone instance
 * @returns {Promise<StatusResponse>} Status response message
 */
export async function handleStatusQuery(message, clone) {
    try {
        // Gather clone status
        const status = {
            role: clone.role,
            specialization: clone.specialization,
            status: 'active',
            orchestrationEnabled: clone.orchestrationEnabled || true,
            activeTasks: clone.activeTasks ? clone.activeTasks.size : 0,
            capabilities: clone.capabilities || [],
            timestamp: new Date().toISOString()
        };

        // Add active task details if requested
        if (message.parameters && message.parameters.includeTaskDetails && clone.activeTasks) {
            status.activeTaskDetails = Array.from(clone.activeTasks.values());
        }

        const response = new StatusResponse(
            clone.role,
            message.fromClone,
            message.messageId,
            message.queryType || 'health'
        );

        // Populate cloneStatus field
        response.cloneStatus = {
            role: clone.role,
            specialization: clone.specialization,
            health: 'healthy',
            activeTasks: clone.activeTasks ? Array.from(clone.activeTasks.values()) : [],
            uptime: process.uptime ? process.uptime() : null,
            lastActivity: new Date().toISOString()
        };

        console.log(`📊 ${clone.role} sending status: ${status.activeTasks} active tasks`);

        return response;

    } catch (error) {
        console.error(`❌ Error handling StatusQuery: ${error.message}`);
        throw error;
    }
}

/**
 * Handle ErrorEscalation messages
 * Called when a critical error needs to be escalated to the orchestrator
 * 
 * @param {ErrorEscalation} message - Error escalation message
 * @param {Object} clone - Clone instance
 * @returns {Promise<Object>} Error handling result
 */
export async function handleErrorEscalation(message, clone) {
    try {
        // Log error escalation
        console.error(`🚨 ${clone.role} received error escalation from ${message.fromClone}`);
        console.error(`   Severity: ${message.severity}`);
        console.error(`   Error: ${message.errorMessage}`);
        console.error(`   Context: ${JSON.stringify(message.context)}`);

        // Store error for analysis
        if (!clone.errorLog) {
            clone.errorLog = [];
        }

        clone.errorLog.push({
            messageId: message.messageId,
            fromClone: message.fromClone,
            severity: message.severity,
            error: message.errorMessage,
            context: message.context,
            timestamp: message.timestamp
        });

        // Limit error log size
        if (clone.errorLog.length > 100) {
            clone.errorLog = clone.errorLog.slice(-100);
        }

        // If severity is critical, may need to take action
        if (message.severity === 'critical') {
            console.error(`🔴 CRITICAL ERROR received by ${clone.role} - may require intervention`);
        }

        return {
            acknowledged: true,
            role: clone.role,
            action: message.severity === 'critical' ? 'logged_and_flagged' : 'logged',
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error(`❌ Error handling ErrorEscalation: ${error.message}`);
        throw error;
    }
}

/**
 * Handle CoordinationMessage messages (broadcast)
 * Called when a clone receives a coordination message from the orchestrator
 * 
 * @param {CoordinationMessage} message - Coordination message
 * @param {Object} clone - Clone instance
 * @returns {Promise<Object>} Coordination acknowledgment
 */
export async function handleCoordinationMessage(message, clone) {
    try {
        console.log(`📢 ${clone.role} received coordination: ${message.coordinationType}`);

        // Store coordination message in log
        if (!clone.coordinationLog) {
            clone.coordinationLog = [];
        }

        clone.coordinationLog.push({
            messageId: message.messageId,
            fromClone: message.fromClone,
            coordinationType: message.coordinationType,
            details: message.details,
            timestamp: message.timestamp
        });

        // Limit coordination log size
        if (clone.coordinationLog.length > 50) {
            clone.coordinationLog = clone.coordinationLog.slice(-50);
        }

        return {
            acknowledged: true,
            role: clone.role,
            messageId: message.messageId,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error(`❌ Error handling CoordinationMessage: ${error.message}`);
        throw error;
    }
}

/**
 * Process task result and create appropriate response message
 * 
 * @param {Object} taskResult - Result from task execution
 * @param {Object} originalMessage - Original task assignment message
 * @param {Object} clone - Clone instance
 * @returns {TaskCompletion|TaskFailure} Response message
 */
export function processTaskResult(taskResult, originalMessage, clone) {
    try {
        if (taskResult.success !== false && !taskResult.error) {
            // Task succeeded
            const completion = new TaskCompletion(
                clone.role,
                originalMessage.fromClone,
                originalMessage.messageId,
                originalMessage.taskDescription,
                taskResult.result || taskResult
            );

            if (taskResult.duration) {
                completion.duration = taskResult.duration;
            }

            console.log(`✅ ${clone.role} completed task: ${originalMessage.taskDescription.substring(0, 50)}...`);

            return completion;

        } else {
            // Task failed
            const failure = new TaskFailure(
                clone.role,
                originalMessage.fromClone,
                originalMessage.messageId,
                originalMessage.taskDescription,
                taskResult.error || 'Task execution failed',
                taskResult.context || {}
            );

            console.error(`❌ ${clone.role} task failed: ${taskResult.error}`);

            return failure;
        }

    } catch (error) {
        // Handler error - create failure message
        const failure = new TaskFailure(
            clone.role,
            originalMessage.fromClone,
            originalMessage.messageId,
            originalMessage.taskDescription,
            `Error processing task result: ${error.message}`,
            { handlerError: true, originalError: error.message }
        );

        return failure;
    }
}

/**
 * Route message to appropriate handler
 * 
 * @param {Object} message - Message to route
 * @param {Object} clone - Clone instance
 * @returns {Promise<Object>} Handler result
 */
export async function routeMessage(message, clone) {
    const messageType = message.messageType || message.constructor.name;

    switch (messageType) {
        case 'TaskAssignment':
            return await handleTaskAssignment(message, clone);

        case 'StatusQuery':
            return await handleStatusQuery(message, clone);

        case 'ErrorEscalation':
            return await handleErrorEscalation(message, clone);

        case 'CoordinationMessage':
            return await handleCoordinationMessage(message, clone);

        default:
            console.warn(`⚠️ Unknown message type: ${messageType}`);
            return {
                error: `Unknown message type: ${messageType}`,
                role: clone.role,
                timestamp: new Date().toISOString()
            };
    }
}

/**
 * Validate message structure
 * 
 * @param {Object} message - Message to validate
 * @returns {Object} Validation result { valid: boolean, errors: [] }
 */
export function validateMessage(message) {
    const errors = [];

    // Check required base fields
    if (!message.messageId) {
        errors.push('Missing messageId');
    }
    if (!message.messageType) {
        errors.push('Missing messageType');
    }
    if (!message.fromClone) {
        errors.push('Missing fromClone');
    }
    if (!message.toClone) {
        errors.push('Missing toClone');
    }
    if (!message.timestamp) {
        errors.push('Missing timestamp');
    }

    // Type-specific validation
    switch (message.messageType) {
        case 'TaskAssignment':
            if (!message.taskDescription) {
                errors.push('TaskAssignment missing taskDescription');
            }
            if (!message.taskType) {
                errors.push('TaskAssignment missing taskType');
            }
            break;

        case 'StatusQuery':
            // StatusQuery has no additional required fields
            break;

        case 'ErrorEscalation':
            if (!message.errorMessage) {
                errors.push('ErrorEscalation missing errorMessage');
            }
            if (!message.severity) {
                errors.push('ErrorEscalation missing severity');
            }
            break;

        case 'CoordinationMessage':
            if (!message.coordinationType) {
                errors.push('CoordinationMessage missing coordinationType');
            }
            break;
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

export default {
    handleTaskAssignment,
    handleStatusQuery,
    handleErrorEscalation,
    handleCoordinationMessage,
    processTaskResult,
    routeMessage,
    validateMessage
};
