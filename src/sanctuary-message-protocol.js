/**
 * Clone Communication Protocol Definitions
 * 
 * Implements Directive DSN-2025.10.19-AFT: Clone-to-Clone Communication
 * Defines message formats for orchestrated AutoGen-based clone network
 * 
 * Protocol Principles:
 * - Message-based (no LLM-based routing ambiguity)
 * - Explicit acknowledgment required
 * - Deterministic routing rules
 * - Full audit trail
 * - Error recovery procedures
 */

/**
 * Base Message Class
 * All clone-to-clone communication extends this base
 */
export class SanctuaryMessage {
    constructor(messageType, fromClone, toClone) {
        this.messageId = this.generateMessageId();
        this.messageType = messageType;
        this.fromClone = fromClone;
        this.toClone = toClone;
        this.timestamp = new Date().toISOString();
        this.status = 'pending'; // pending, sent, received, acknowledged
        this.metadata = {};
    }

    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    toJSON() {
        return {
            messageId: this.messageId,
            messageType: this.messageType,
            fromClone: this.fromClone,
            toClone: this.toClone,
            timestamp: this.timestamp,
            status: this.status,
            metadata: this.metadata
        };
    }
}

/**
 * Task Assignment Message
 * Orchestrator sends this to delegate work to a clone
 */
export class TaskAssignment extends SanctuaryMessage {
    constructor(fromClone, toClone, taskDescription, taskType, parameters = {}) {
        super('TaskAssignment', fromClone, toClone);
        this.taskDescription = taskDescription;
        this.taskType = taskType;
        this.parameters = parameters;
        this.priority = parameters.priority || 'normal';
        this.deadline = parameters.deadline || null;
        this.requiresAcknowledgment = true;
    }
}

/**
 * Task Acknowledgment Message
 * Clone sends this to confirm receipt of task assignment
 */
export class TaskAcknowledgment extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, taskDescription) {
        super('TaskAcknowledgment', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.taskDescription = taskDescription;
        this.acceptedAt = new Date().toISOString();
        this.estimatedCompletion = null;
    }

    setEstimatedCompletion(minutes) {
        this.estimatedCompletion = new Date(Date.now() + minutes * 60000).toISOString();
    }
}

/**
 * Task Completion Message
 * Clone sends this upon successful task completion
 */
export class TaskCompletion extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, taskDescription, result) {
        super('TaskCompletion', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.taskDescription = taskDescription;
        this.result = result;
        this.completedAt = new Date().toISOString();
        this.success = true;
        this.duration = null; // Set by receiver if needed
    }
}

/**
 * Task Failure Message
 * Clone sends this when task execution fails
 */
export class TaskFailure extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, taskDescription, error, severity = 'medium') {
        super('TaskFailure', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.taskDescription = taskDescription;
        this.error = error;
        this.severity = severity; // low, medium, high, critical
        this.failedAt = new Date().toISOString();
        this.success = false;
        this.recoveryAttempts = 0;
        this.suggestedRecovery = null;
    }

    setSuggestedRecovery(recoveryAction) {
        this.suggestedRecovery = recoveryAction;
    }
}

/**
 * Status Query Message
 * Orchestrator sends to check clone status or task progress
 */
export class StatusQuery extends SanctuaryMessage {
    constructor(fromClone, toClone, queryType = 'health', details = {}) {
        super('StatusQuery', fromClone, toClone);
        this.queryType = queryType; // 'health', 'task', 'all'
        this.details = details;
        this.requiresResponse = true;
    }
}

/**
 * Status Response Message
 * Clone responds to status query
 */
export class StatusResponse extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, queryType) {
        super('StatusResponse', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.queryType = queryType;
        this.cloneStatus = {
            role: null,
            specialization: null,
            health: 'unknown', // 'healthy', 'degraded', 'error'
            activeTasks: [],
            uptime: null,
            lastActivity: null
        };
        this.respondedAt = new Date().toISOString();
    }
}

/**
 * Artifact Reference Message
 * Clone requests or shares an artifact via AutoGen network
 */
export class ArtifactReference extends SanctuaryMessage {
    constructor(fromClone, toClone, artifactId, artifactType, action = 'reference') {
        super('ArtifactReference', fromClone, toClone);
        this.artifactId = artifactId;
        this.artifactType = artifactType;
        this.action = action; // 'reference', 'request', 'share'
        this.metadata = {
            description: null,
            version: null,
            checksum: null
        };
    }
}

/**
 * Coordination Message
 * For multi-clone coordination scenarios (e.g., all clones prepare for new phase)
 */
export class CoordinationMessage extends SanctuaryMessage {
    constructor(fromClone, targetClones, coordinationType, details = {}) {
        super('CoordinationMessage', fromClone, Array.isArray(targetClones) ? 'broadcast' : targetClones);
        this.targetClones = Array.isArray(targetClones) ? targetClones : [targetClones];
        this.coordinationType = coordinationType; // 'phase-transition', 'network-sync', etc.
        this.details = details;
        this.broadcast = Array.isArray(targetClones);
    }
}

/**
 * Error Escalation Message
 * Clone escalates critical errors to orchestrator
 */
export class ErrorEscalation extends SanctuaryMessage {
    constructor(fromClone, toClone, severity, errorMessage, context = {}) {
        super('ErrorEscalation', fromClone, toClone);
        this.severity = severity; // low, medium, high, critical
        this.errorMessage = errorMessage;
        this.context = context;
        this.escalatedAt = new Date().toISOString();
        this.requiresImmediateResponse = severity === 'critical';
    }
}

/**
 * Recovery Action Message
 * Orchestrator sends recovery instructions after error
 */
export class RecoveryAction extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, recoveryInstructions) {
        super('RecoveryAction', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.recoveryInstructions = recoveryInstructions;
        this.priority = 'high';
        this.issuedAt = new Date().toISOString();
        this.deadline = null;
    }

    setDeadline(minutesFromNow) {
        this.deadline = new Date(Date.now() + minutesFromNow * 60000).toISOString();
    }
}

/**
 * Message Router
 * Handles message routing, tracking, and delivery
 */
export class SanctuaryMessageRouter {
    constructor() {
        this.messageQueue = new Map(); // Clone -> Message[]
        this.messageHistory = []; // All messages for audit
        this.routingRules = new Map();
        this.deliveryCallbacks = new Map();
    }

    /**
     * Queue message for delivery to clone
     * @param {SanctuaryMessage} message - Message to queue
     */
    queueMessage(message) {
        if (!this.messageQueue.has(message.toClone)) {
            this.messageQueue.set(message.toClone, []);
        }
        this.messageQueue.get(message.toClone).push(message);
        this.messageHistory.push(message);
    }

    /**
     * Get queued messages for a clone
     * @param {string} cloneName - Clone identifier
     * @returns {Array} Messages awaiting delivery
     */
    getQueuedMessages(cloneName) {
        const messages = this.messageQueue.get(cloneName) || [];
        return messages;
    }

    /**
     * Mark message as delivered
     * @param {string} messageId - Message identifier
     */
    markDelivered(messageId) {
        const message = this.messageHistory.find(m => m.messageId === messageId);
        if (message) {
            message.status = 'delivered';
        }
    }

    /**
     * Mark message as acknowledged by recipient
     * @param {string} messageId - Message identifier
     */
    markAcknowledged(messageId) {
        const message = this.messageHistory.find(m => m.messageId === messageId);
        if (message) {
            message.status = 'acknowledged';
        }
    }

    /**
     * Get message history for audit
     * @param {Object} filter - Filter options (fromClone, toClone, messageType, etc.)
     * @returns {Array} Filtered message history
     */
    getMessageHistory(filter = {}) {
        return this.messageHistory.filter(msg => {
            if (filter.fromClone && msg.fromClone !== filter.fromClone) return false;
            if (filter.toClone && msg.toClone !== filter.toClone) return false;
            if (filter.messageType && msg.messageType !== filter.messageType) return false;
            if (filter.status && msg.status !== filter.status) return false;
            return true;
        });
    }

    /**
     * Register delivery callback for specific message type
     * @param {string} messageType - Message type to handle
     * @param {Function} callback - Callback function
     */
    registerDeliveryCallback(messageType, callback) {
        if (!this.deliveryCallbacks.has(messageType)) {
            this.deliveryCallbacks.set(messageType, []);
        }
        this.deliveryCallbacks.get(messageType).push(callback);
    }

    /**
     * Execute delivery callbacks for message
     * @param {SanctuaryMessage} message - Message to process
     */
    executeCallbacks(message) {
        const callbacks = this.deliveryCallbacks.get(message.messageType) || [];
        callbacks.forEach(callback => {
            try {
                callback(message);
            } catch (error) {
                console.error(`Error executing callback for ${message.messageType}:`, error);
            }
        });
    }

    /**
     * Get router statistics for monitoring
     * @returns {Object} Statistics
     */
    getStatistics() {
        return {
            totalMessages: this.messageHistory.length,
            pendingMessages: this.messageHistory.filter(m => m.status === 'pending').length,
            deliveredMessages: this.messageHistory.filter(m => m.status === 'delivered').length,
            acknowledgedMessages: this.messageHistory.filter(m => m.status === 'acknowledged').length,
            queuedByClone: Object.fromEntries(
                Array.from(this.messageQueue.entries()).map(([clone, msgs]) => [clone, msgs.length])
            )
        };
    }
}

export default {
    SanctuaryMessage,
    TaskAssignment,
    TaskAcknowledgment,
    TaskCompletion,
    TaskFailure,
    StatusQuery,
    StatusResponse,
    ArtifactReference,
    CoordinationMessage,
    ErrorEscalation,
    RecoveryAction,
    SanctuaryMessageRouter
};
