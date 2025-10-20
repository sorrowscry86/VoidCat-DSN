/**
 * Unit Tests: SanctuaryMessageProtocol (Standalone - No Dependencies)
 * 
 * Tests for clone-to-clone communication protocol
 * Validates message types, routing, and delivery
 */

import { strict as assert } from 'assert';

// Message Base Class
class SanctuaryMessage {
    constructor(messageType, fromClone, toClone) {
        this.messageId = this.generateMessageId();
        this.messageType = messageType;
        this.fromClone = fromClone;
        this.toClone = toClone;
        this.timestamp = new Date().toISOString();
        this.status = 'pending';
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

// Message Types
class TaskAssignment extends SanctuaryMessage {
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

class TaskAcknowledgment extends SanctuaryMessage {
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

class TaskCompletion extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, taskDescription, result) {
        super('TaskCompletion', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.taskDescription = taskDescription;
        this.result = result;
        this.completedAt = new Date().toISOString();
        this.success = true;
        this.duration = null;
    }
}

class TaskFailure extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, taskDescription, error, severity = 'medium') {
        super('TaskFailure', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.taskDescription = taskDescription;
        this.error = error;
        this.severity = severity;
        this.failedAt = new Date().toISOString();
        this.success = false;
        this.recoveryAttempts = 0;
        this.suggestedRecovery = null;
    }

    setSuggestedRecovery(recoveryAction) {
        this.suggestedRecovery = recoveryAction;
    }
}

class StatusQuery extends SanctuaryMessage {
    constructor(fromClone, toClone, queryType = 'health', details = {}) {
        super('StatusQuery', fromClone, toClone);
        this.queryType = queryType;
        this.details = details;
        this.requiresResponse = true;
    }
}

class StatusResponse extends SanctuaryMessage {
    constructor(fromClone, toClone, originalMessageId, queryType) {
        super('StatusResponse', fromClone, toClone);
        this.originalMessageId = originalMessageId;
        this.queryType = queryType;
        this.cloneStatus = {
            role: null,
            specialization: null,
            health: 'unknown',
            activeTasks: [],
            uptime: null,
            lastActivity: null
        };
        this.respondedAt = new Date().toISOString();
    }
}

class ArtifactReference extends SanctuaryMessage {
    constructor(fromClone, toClone, artifactId, artifactType, action = 'reference') {
        super('ArtifactReference', fromClone, toClone);
        this.artifactId = artifactId;
        this.artifactType = artifactType;
        this.action = action;
        this.metadata = {
            description: null,
            version: null,
            checksum: null
        };
    }
}

class CoordinationMessage extends SanctuaryMessage {
    constructor(fromClone, targetClones, coordinationType, details = {}) {
        super('CoordinationMessage', fromClone, Array.isArray(targetClones) ? 'broadcast' : targetClones);
        this.targetClones = Array.isArray(targetClones) ? targetClones : [targetClones];
        this.coordinationType = coordinationType;
        this.details = details;
        this.broadcast = Array.isArray(targetClones);
    }
}

class ErrorEscalation extends SanctuaryMessage {
    constructor(fromClone, toClone, severity, errorMessage, context = {}) {
        super('ErrorEscalation', fromClone, toClone);
        this.severity = severity;
        this.errorMessage = errorMessage;
        this.context = context;
        this.escalatedAt = new Date().toISOString();
        this.requiresImmediateResponse = severity === 'critical';
    }
}

class RecoveryAction extends SanctuaryMessage {
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

// Message Router
class SanctuaryMessageRouter {
    constructor() {
        this.messageQueue = new Map();
        this.messageHistory = [];
        this.routingRules = new Map();
        this.deliveryCallbacks = new Map();
    }

    queueMessage(message) {
        if (!this.messageQueue.has(message.toClone)) {
            this.messageQueue.set(message.toClone, []);
        }
        this.messageQueue.get(message.toClone).push(message);
        this.messageHistory.push(message);
    }

    getQueuedMessages(cloneName) {
        const messages = this.messageQueue.get(cloneName) || [];
        return messages;
    }

    markDelivered(messageId) {
        const message = this.messageHistory.find(m => m.messageId === messageId);
        if (message) {
            message.status = 'delivered';
        }
    }

    markAcknowledged(messageId) {
        const message = this.messageHistory.find(m => m.messageId === messageId);
        if (message) {
            message.status = 'acknowledged';
        }
    }

    getMessageHistory(filter = {}) {
        return this.messageHistory.filter(msg => {
            if (filter.fromClone && msg.fromClone !== filter.fromClone) return false;
            if (filter.toClone && msg.toClone !== filter.toClone) return false;
            if (filter.messageType && msg.messageType !== filter.messageType) return false;
            if (filter.status && msg.status !== filter.status) return false;
            return true;
        });
    }

    registerDeliveryCallback(messageType, callback) {
        if (!this.deliveryCallbacks.has(messageType)) {
            this.deliveryCallbacks.set(messageType, []);
        }
        this.deliveryCallbacks.get(messageType).push(callback);
    }

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

// Tests Start
console.log('\n📋 TEST SUITE 1: Base Message Class\n');

// Test 1.1: Message Creation
{
    const message = new SanctuaryMessage('TestMessage', 'omega', 'beta');

    assert(message.messageId);
    assert.equal(message.messageType, 'TestMessage');
    assert.equal(message.fromClone, 'omega');
    assert.equal(message.toClone, 'beta');
    assert.equal(message.status, 'pending');
    assert(message.timestamp);

    console.log('✅ 1.1: Base message creation works');
}

// Test 1.2: Message JSON Serialization
{
    const message = new SanctuaryMessage('TestMessage', 'omega', 'beta');
    const json = message.toJSON();

    assert.equal(json.messageType, 'TestMessage');
    assert.equal(json.fromClone, 'omega');
    assert.equal(json.toClone, 'beta');
    assert(json.messageId);

    console.log('✅ 1.2: Message JSON serialization works');
}

// Test Suite 2: Message Types
console.log('\n📋 TEST SUITE 2: Message Types\n');

// Test 2.1: TaskAssignment
{
    const task = new TaskAssignment(
        'omega',
        'beta',
        'Review code for security issues',
        'security-review',
        { priority: 'high' }
    );

    assert.equal(task.messageType, 'TaskAssignment');
    assert.equal(task.taskDescription, 'Review code for security issues');
    assert.equal(task.taskType, 'security-review');
    assert.equal(task.priority, 'high');
    assert.equal(task.requiresAcknowledgment, true);

    console.log('✅ 2.1: TaskAssignment creation works');
}

// Test 2.2: TaskAcknowledgment
{
    const ack = new TaskAcknowledgment('beta', 'omega', 'msg_123', 'Security review task');
    ack.setEstimatedCompletion(30);

    assert.equal(ack.messageType, 'TaskAcknowledgment');
    assert.equal(ack.originalMessageId, 'msg_123');
    assert(ack.estimatedCompletion);

    console.log('✅ 2.2: TaskAcknowledgment creation works');
}

// Test 2.3: TaskCompletion
{
    const completion = new TaskCompletion(
        'beta',
        'omega',
        'msg_123',
        'Security review task',
        { vulnerabilities: ['XSS', 'SQLi'], score: 7.2 }
    );

    assert.equal(completion.messageType, 'TaskCompletion');
    assert.equal(completion.success, true);
    assert.deepEqual(completion.result.vulnerabilities, ['XSS', 'SQLi']);

    console.log('✅ 2.3: TaskCompletion creation works');
}

// Test 2.4: TaskFailure
{
    const failure = new TaskFailure(
        'beta',
        'omega',
        'msg_123',
        'Security review task',
        new Error('Timeout'),
        'medium'
    );

    assert.equal(failure.messageType, 'TaskFailure');
    assert.equal(failure.success, false);
    assert.equal(failure.severity, 'medium');

    console.log('✅ 2.4: TaskFailure creation works');
}

// Test 2.5: StatusQuery
{
    const query = new StatusQuery('omega', 'beta', 'health', { includeMetrics: true });

    assert.equal(query.messageType, 'StatusQuery');
    assert.equal(query.queryType, 'health');
    assert.equal(query.requiresResponse, true);

    console.log('✅ 2.5: StatusQuery creation works');
}

// Test 2.6: StatusResponse
{
    const response = new StatusResponse('beta', 'omega', 'msg_456', 'health');

    response.cloneStatus.role = 'Beta';
    response.cloneStatus.health = 'healthy';

    assert.equal(response.messageType, 'StatusResponse');
    assert.equal(response.cloneStatus.health, 'healthy');

    console.log('✅ 2.6: StatusResponse creation works');
}

// Test 2.7: ArtifactReference
{
    const artifact = new ArtifactReference('beta', 'omega', 'art_001', 'code', 'share');

    artifact.metadata.description = 'Security analysis results';
    artifact.metadata.version = '1.0.0';

    assert.equal(artifact.messageType, 'ArtifactReference');
    assert.equal(artifact.artifactType, 'code');
    assert.equal(artifact.action, 'share');

    console.log('✅ 2.7: ArtifactReference creation works');
}

// Test 2.8: CoordinationMessage
{
    const coord = new CoordinationMessage(
        'omega',
        ['beta', 'gamma', 'delta', 'sigma'],
        'phase-transition',
        { phase: 2 }
    );

    assert.equal(coord.messageType, 'CoordinationMessage');
    assert.equal(coord.coordinationType, 'phase-transition');
    assert.equal(coord.broadcast, true);
    assert.equal(coord.targetClones.length, 4);

    console.log('✅ 2.8: CoordinationMessage creation works');
}

// Test 2.9: ErrorEscalation
{
    const escalation = new ErrorEscalation(
        'beta',
        'omega',
        'critical',
        'Clone process crashed',
        { exitCode: 1 }
    );

    assert.equal(escalation.messageType, 'ErrorEscalation');
    assert.equal(escalation.severity, 'critical');
    assert.equal(escalation.requiresImmediateResponse, true);

    console.log('✅ 2.9: ErrorEscalation creation works');
}

// Test 2.10: RecoveryAction
{
    const recovery = new RecoveryAction(
        'omega',
        'beta',
        'msg_789',
        { action: 'restart', timeout: 30 }
    );

    recovery.setDeadline(5);

    assert.equal(recovery.messageType, 'RecoveryAction');
    assert.equal(recovery.priority, 'high');
    assert(recovery.deadline);

    console.log('✅ 2.10: RecoveryAction creation works');
}

// Test Suite 3: Message Router
console.log('\n📋 TEST SUITE 3: Message Router\n');

// Test 3.1: Create Router
{
    const router = new SanctuaryMessageRouter();

    assert(router.messageQueue instanceof Map);
    assert(router.messageHistory instanceof Array);
    assert(router.routingRules instanceof Map);
    assert(router.deliveryCallbacks instanceof Map);

    console.log('✅ 3.1: Message router creation works');
}

// Test 3.2: Queue Message
{
    const router = new SanctuaryMessageRouter();
    const message = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');

    router.queueMessage(message);

    assert.equal(router.messageHistory.length, 1);
    assert(router.messageQueue.has('beta'));

    const queuedMessages = router.getQueuedMessages('beta');
    assert.equal(queuedMessages.length, 1);

    console.log('✅ 3.2: Queue message works');
}

// Test 3.3: Multiple Messages for Multiple Clones
{
    const router = new SanctuaryMessageRouter();

    const msg1 = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');
    const msg2 = new TaskAssignment('omega', 'gamma', 'Design system', 'architecture');
    const msg3 = new TaskAssignment('omega', 'beta', 'Another analysis', 'code-analysis');

    router.queueMessage(msg1);
    router.queueMessage(msg2);
    router.queueMessage(msg3);

    assert.equal(router.getQueuedMessages('beta').length, 2);
    assert.equal(router.getQueuedMessages('gamma').length, 1);
    assert.equal(router.messageHistory.length, 3);

    console.log('✅ 3.3: Multiple messages for multiple clones works');
}

// Test 3.4: Mark Message Delivered
{
    const router = new SanctuaryMessageRouter();
    const message = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');

    router.queueMessage(message);

    const originalId = message.messageId;
    router.markDelivered(originalId);

    const deliveredMsg = router.messageHistory.find(m => m.messageId === originalId);
    assert.equal(deliveredMsg.status, 'delivered');

    console.log('✅ 3.4: Mark message delivered works');
}

// Test 3.5: Mark Message Acknowledged
{
    const router = new SanctuaryMessageRouter();
    const message = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');

    router.queueMessage(message);

    const originalId = message.messageId;
    router.markAcknowledged(originalId);

    const acknowledgedMsg = router.messageHistory.find(m => m.messageId === originalId);
    assert.equal(acknowledgedMsg.status, 'acknowledged');

    console.log('✅ 3.5: Mark message acknowledged works');
}

// Test 3.6: Get Message History with Filter
{
    const router = new SanctuaryMessageRouter();

    const msg1 = new TaskAssignment('omega', 'beta', 'Task 1', 'code-analysis');
    const msg2 = new TaskAssignment('omega', 'gamma', 'Task 2', 'architecture');
    const msg3 = new TaskAcknowledgment('beta', 'omega', msg1.messageId, 'Task 1');

    router.queueMessage(msg1);
    router.queueMessage(msg2);
    router.queueMessage(msg3);

    const betaMessages = router.getMessageHistory({ toClone: 'beta' });
    assert.equal(betaMessages.length, 1);

    const taskAssignments = router.getMessageHistory({ messageType: 'TaskAssignment' });
    assert.equal(taskAssignments.length, 2);

    console.log('✅ 3.6: Get message history with filter works');
}

// Test 3.7: Register and Execute Delivery Callback
{
    const router = new SanctuaryMessageRouter();
    let callbackExecuted = false;
    let callbackMessage = null;

    router.registerDeliveryCallback('TaskAssignment', (msg) => {
        callbackExecuted = true;
        callbackMessage = msg;
    });

    const message = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');
    router.queueMessage(message);
    router.executeCallbacks(message);

    assert.equal(callbackExecuted, true);
    assert.equal(callbackMessage.messageType, 'TaskAssignment');

    console.log('✅ 3.7: Register and execute delivery callback works');
}

// Test 3.8: Multiple Callbacks
{
    const router = new SanctuaryMessageRouter();
    let callback1Executed = false;
    let callback2Executed = false;

    router.registerDeliveryCallback('TaskAssignment', () => {
        callback1Executed = true;
    });

    router.registerDeliveryCallback('TaskAssignment', () => {
        callback2Executed = true;
    });

    const message = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');
    router.executeCallbacks(message);

    assert.equal(callback1Executed, true);
    assert.equal(callback2Executed, true);

    console.log('✅ 3.8: Multiple callbacks execution works');
}

// Test 3.9: Router Statistics
{
    const router = new SanctuaryMessageRouter();

    const msg1 = new TaskAssignment('omega', 'beta', 'Task 1', 'code-analysis');
    const msg2 = new TaskAssignment('omega', 'gamma', 'Task 2', 'architecture');

    router.queueMessage(msg1);
    router.queueMessage(msg2);

    router.markDelivered(msg1.messageId);

    const stats = router.getStatistics();

    assert.equal(stats.totalMessages, 2);
    assert.equal(stats.pendingMessages, 1);
    assert.equal(stats.deliveredMessages, 1);

    console.log('✅ 3.9: Router statistics work');
}

// Test 3.10: Message History Audit Trail
{
    const router = new SanctuaryMessageRouter();

    for (let i = 0; i < 5; i++) {
        const message = new TaskAssignment('omega', 'beta', `Task ${i}`, 'code-analysis');
        router.queueMessage(message);
    }

    const history = router.getMessageHistory();
    assert.equal(history.length, 5);

    console.log('✅ 3.10: Message history audit trail works');
}

// Test Suite 4: Message Flow Scenarios
console.log('\n📋 TEST SUITE 4: Message Flow Scenarios\n');

// Test 4.1: Complete Task Workflow
{
    const router = new SanctuaryMessageRouter();

    const assignment = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');
    router.queueMessage(assignment);

    const ack = new TaskAcknowledgment('beta', 'omega', assignment.messageId, 'Analyze code');
    router.queueMessage(ack);

    const completion = new TaskCompletion('beta', 'omega', assignment.messageId, 'Analyze code', {
        score: 8.5,
        issues: 3
    });
    router.queueMessage(completion);

    const history = router.getMessageHistory();
    assert.equal(history.length, 3);
    assert.equal(history[0].messageType, 'TaskAssignment');
    assert.equal(history[1].messageType, 'TaskAcknowledgment');
    assert.equal(history[2].messageType, 'TaskCompletion');

    console.log('✅ 4.1: Complete task workflow works');
}

// Test 4.2: Error Recovery Workflow
{
    const router = new SanctuaryMessageRouter();

    const assignment = new TaskAssignment('omega', 'beta', 'Analyze code', 'code-analysis');
    router.queueMessage(assignment);

    const failure = new TaskFailure('beta', 'omega', assignment.messageId, 'Analyze code',
        new Error('Timeout'), 'high');
    router.queueMessage(failure);

    const recovery = new RecoveryAction('omega', 'beta', assignment.messageId,
        { action: 'retry', timeout: 60 });
    router.queueMessage(recovery);

    const history = router.getMessageHistory();
    assert.equal(history.length, 3);
    assert.equal(history[1].messageType, 'TaskFailure');
    assert.equal(history[2].messageType, 'RecoveryAction');

    console.log('✅ 4.2: Error recovery workflow works');
}

// Test 4.3: Broadcast Coordination
{
    const router = new SanctuaryMessageRouter();

    const coordMsg = new CoordinationMessage(
        'omega',
        ['beta', 'gamma', 'delta', 'sigma'],
        'phase-transition',
        { phase: 2 }
    );

    router.queueMessage(coordMsg);

    assert.equal(router.messageHistory.length, 1);
    assert.equal(coordMsg.broadcast, true);

    console.log('✅ 4.3: Broadcast coordination works');
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL MESSAGE PROTOCOL TESTS PASSED');
console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log('  ✅ Base Message Class: 2/2 tests passed');
console.log('  ✅ Message Types: 10/10 tests passed');
console.log('  ✅ Message Router: 10/10 tests passed');
console.log('  ✅ Message Flow Scenarios: 3/3 tests passed');
console.log('\n  Total: 25/25 tests passed ✅\n');
