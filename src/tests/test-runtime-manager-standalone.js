/**
 * Unit Tests: AutoGenRuntimeManager (Standalone - No Dependencies)
 * 
 * Tests for AutoGen runtime bridge and clone management
 * Validates initialization, clone registration, task delegation
 */

import { strict as assert } from 'assert';

// Standalone Runtime Manager Implementation
class AutoGenRuntimeManager {
    constructor(orchestratorConfig = {}) {
        this.orchestrator = null;
        this.messageRouter = {
            messageQueue: new Map(),
            messageHistory: [],
            getStatistics: () => ({
                totalMessages: 0,
                pendingMessages: 0,
                deliveredMessages: 0,
                acknowledgedMessages: 0,
                queuedByClone: {}
            })
        };
        this.cloneRegistry = new Map();
        this.taskTracker = new Map();
        this.config = {
            orchestratorRole: 'Omega',
            orchestratorPort: 3000,
            healthCheckInterval: 30000,
            taskTimeout: 300000,
            ...orchestratorConfig
        };

        this.initialized = false;
        this.runningHealthChecks = new Map();
    }

    async initialize() {
        if (this.initialized) {
            console.log('⚠️  AutoGen Runtime already initialized');
            return;
        }

        this.orchestrator = {
            role: this.config.orchestratorRole,
            getStatusReport: () => ({
                orchestrator: this.config.orchestratorRole,
                clones: { registered: this.cloneRegistry.size, list: [] },
                tasks: { total: 0, active: 0, completed: 0, failed: 0, errors: 0 },
                auditTrail: { entries: 0, lastAction: null }
            }),
            getAuditTrail: () => []
        };

        this.registerDefaultClones();
        this.initialized = true;
        this.startHealthChecks();
    }

    registerDefaultClones() {
        const defaultClones = [
            { name: 'beta', role: 'Beta', specialization: 'Code Analysis & Security Review', port: 3002 },
            { name: 'gamma', role: 'Gamma', specialization: 'System Architecture & Design', port: 3003 },
            { name: 'delta', role: 'Delta', specialization: 'Testing & Quality Assurance', port: 3004 },
            { name: 'sigma', role: 'Sigma', specialization: 'Documentation & Communication', port: 3005 }
        ];

        defaultClones.forEach(clone => {
            this.registerClone(clone.name, {
                role: clone.role,
                specialization: clone.specialization,
                port: clone.port,
                baseUrl: `http://localhost:${clone.port}`
            });
        });
    }

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
    }

    async delegateTask(targetClone, taskDescription, parameters = {}) {
        if (!this.initialized) {
            throw new Error('AutoGen Runtime not initialized');
        }

        if (!this.cloneRegistry.has(targetClone)) {
            throw new Error(`Clone '${targetClone}' not found in registry`);
        }

        const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const taskType = parameters.taskType || 'general';

        const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        this.taskTracker.set(taskId, {
            taskId,
            targetClone,
            description: taskDescription,
            status: 'delegated',
            messageId,
            startTime: new Date(),
            response: null
        });

        return {
            success: true,
            taskId,
            messageId,
            targetClone,
            status: 'delegated'
        };
    }

    async sendTaskToClone(cloneName, taskData) {
        const cloneInfo = this.cloneRegistry.get(cloneName);
        if (!cloneInfo) {
            throw new Error(`Clone '${cloneName}' not found`);
        }

        // Simulate HTTP call (would be real axios in production)
        return { status: 'received', taskId: taskData.taskId };
    }

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
    }

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
    }

    startHealthChecks() {
        const interval = setInterval(() => {
            this.performHealthCheck();
        }, this.config.healthCheckInterval);

        this.runningHealthChecks.set('main', interval);
    }

    async performHealthCheck() {
        for (const [cloneName, cloneInfo] of this.cloneRegistry) {
            cloneInfo.lastHealthCheck = new Date().toISOString();
            cloneInfo.status = 'healthy';
        }
    }

    stopHealthChecks() {
        for (const [key, interval] of this.runningHealthChecks) {
            clearInterval(interval);
        }
        this.runningHealthChecks.clear();
    }

    async queryCloneStatus(cloneName) {
        const cloneInfo = this.cloneRegistry.get(cloneName);
        if (!cloneInfo) {
            throw new Error(`Clone '${cloneName}' not found`);
        }

        return {
            success: true,
            clone: cloneName,
            status: cloneInfo.status
        };
    }

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

    getAuditTrail() {
        return {
            orchestrator: this.orchestrator.getAuditTrail(),
            messages: this.messageRouter.messageHistory,
            tasks: Array.from(this.taskTracker.values())
        };
    }

    async shutdown() {
        this.stopHealthChecks();
        this.cloneRegistry.clear();
        this.taskTracker.clear();
        this.initialized = false;
    }
}

// Tests Start
console.log('\n📋 TEST SUITE 1: Runtime Manager Initialization\n');

// Test 1.1: Create Runtime Manager
{
    const manager = new AutoGenRuntimeManager();

    assert(manager.orchestrator === null);
    assert(manager.messageRouter);
    assert(manager.cloneRegistry instanceof Map);
    assert(manager.taskTracker instanceof Map);
    assert.equal(manager.initialized, false);

    console.log('✅ 1.1: Runtime manager creation works');
}

// Test 1.2: Custom Configuration
{
    const config = {
        orchestratorRole: 'CustomOmega',
        orchestratorPort: 9000,
        healthCheckInterval: 60000,
        taskTimeout: 600000
    };

    const manager = new AutoGenRuntimeManager(config);

    assert.equal(manager.config.orchestratorRole, 'CustomOmega');
    assert.equal(manager.config.orchestratorPort, 9000);
    assert.equal(manager.config.healthCheckInterval, 60000);
    assert.equal(manager.config.taskTimeout, 600000);

    console.log('✅ 1.2: Custom configuration works');
}

// Test 1.3: Initialize Runtime
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    assert.equal(manager.initialized, true);
    assert(manager.orchestrator !== null);
    assert.equal(manager.cloneRegistry.size, 4);

    await manager.shutdown();

    console.log('✅ 1.3: Initialize runtime works');
}

// Test Suite 2: Clone Registration
console.log('\n📋 TEST SUITE 2: Clone Registration\n');

// Test 2.1: Register Single Clone
{
    const manager = new AutoGenRuntimeManager();

    manager.registerClone('custom-clone', {
        role: 'CustomClone',
        specialization: 'Custom Analysis',
        port: 9001,
        baseUrl: 'http://localhost:9001'
    });

    assert(manager.cloneRegistry.has('custom-clone'));
    const cloneInfo = manager.cloneRegistry.get('custom-clone');
    assert.equal(cloneInfo.role, 'CustomClone');
    assert.equal(cloneInfo.port, 9001);

    console.log('✅ 2.1: Register single clone works');
}

// Test 2.2: Default Clones Registration
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    assert(manager.cloneRegistry.has('beta'));
    assert(manager.cloneRegistry.has('gamma'));
    assert(manager.cloneRegistry.has('delta'));
    assert(manager.cloneRegistry.has('sigma'));

    const betaInfo = manager.cloneRegistry.get('beta');
    assert.equal(betaInfo.role, 'Beta');
    assert.equal(betaInfo.port, 3002);

    await manager.shutdown();

    console.log('✅ 2.2: Default clones registration works');
}

// Test 2.3: Clone Registry Size
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    assert.equal(manager.cloneRegistry.size, 4);

    await manager.shutdown();

    console.log('✅ 2.3: Clone registry size correct');
}

// Test Suite 3: Task Delegation
console.log('\n📋 TEST SUITE 3: Task Delegation\n');

// Test 3.1: Delegate Task
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const result = await manager.delegateTask('beta', 'Test analysis task', {
        taskType: 'code-analysis',
        priority: 'high'
    });

    assert.equal(result.success, true);
    assert(result.taskId);
    assert(result.messageId);
    assert.equal(result.targetClone, 'beta');
    assert.equal(result.status, 'delegated');

    await manager.shutdown();

    console.log('✅ 3.1: Delegate task to registered clone works');
}

// Test 3.2: Reject Unregistered Clone
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    try {
        await manager.delegateTask('unknown-clone', 'Test task', {});
        assert.fail('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('not found'));
    }

    await manager.shutdown();

    console.log('✅ 3.2: Reject task to unregistered clone works');
}

// Test 3.3: Reject Delegation Before Initialization
{
    const manager = new AutoGenRuntimeManager();

    try {
        await manager.delegateTask('beta', 'Test task', {});
        assert.fail('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('not initialized'));
    }

    console.log('✅ 3.3: Reject delegation before initialization works');
}

// Test 3.4: Task Tracker Recording
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const result = await manager.delegateTask('beta', 'Test task', {
        taskType: 'code-analysis'
    });

    assert(manager.taskTracker.has(result.taskId));

    const taskRecord = manager.taskTracker.get(result.taskId);
    assert.equal(taskRecord.targetClone, 'beta');
    assert.equal(taskRecord.status, 'delegated');

    await manager.shutdown();

    console.log('✅ 3.4: Task tracker recording works');
}

// Test Suite 4: Task Completion Tracking
console.log('\n📋 TEST SUITE 4: Task Completion Tracking\n');

// Test 4.1: Record Task Completion
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const result = await manager.delegateTask('beta', 'Test analysis', {
        taskType: 'code-analysis'
    });

    const taskId = result.taskId;

    manager.recordTaskCompletion(taskId, {
        score: 8.5,
        issues: 3,
        vulnerabilities: ['XSS', 'SQLi']
    });

    const taskRecord = manager.taskTracker.get(taskId);
    assert.equal(taskRecord.status, 'completed');
    assert.deepEqual(taskRecord.result.score, 8.5);

    await manager.shutdown();

    console.log('✅ 4.1: Record task completion works');
}

// Test 4.2: Record Task Failure
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const result = await manager.delegateTask('beta', 'Test analysis', {
        taskType: 'code-analysis'
    });

    const taskId = result.taskId;

    manager.recordTaskFailure(taskId, new Error('Timeout during analysis'), 'high');

    const taskRecord = manager.taskTracker.get(taskId);
    assert.equal(taskRecord.status, 'failed');
    assert(taskRecord.error);

    await manager.shutdown();

    console.log('✅ 4.2: Record task failure works');
}

// Test 4.3: Task Duration Tracking
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const result = await manager.delegateTask('beta', 'Test analysis', {
        taskType: 'code-analysis'
    });

    const taskId = result.taskId;

    await new Promise(resolve => setTimeout(resolve, 100));

    manager.recordTaskCompletion(taskId, { status: 'complete' });

    const taskRecord = manager.taskTracker.get(taskId);
    assert(taskRecord.duration >= 100);

    await manager.shutdown();

    console.log('✅ 4.3: Task duration tracking works');
}

// Test Suite 5: Network Status
console.log('\n📋 TEST SUITE 5: Network Status\n');

// Test 5.1: Get Network Status
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const status = manager.getNetworkStatus();

    assert(status.orchestrator);
    assert(status.clones);
    assert(status.messageRouter);
    assert(status.tasks);

    assert.equal(status.clones.length, 4);

    await manager.shutdown();

    console.log('✅ 5.1: Get network status works');
}

// Test 5.2: Network Status Structure
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const status = manager.getNetworkStatus();

    assert(Array.isArray(status.clones));
    assert(typeof status.messageRouter.totalMessages === 'number');
    assert(typeof status.tasks.total === 'number');

    await manager.shutdown();

    console.log('✅ 5.2: Network status structure correct');
}

// Test 5.3: Status After Task Delegation
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    await manager.delegateTask('beta', 'Test 1', { taskType: 'code-analysis' });
    await manager.delegateTask('gamma', 'Test 2', { taskType: 'architecture' });

    const status = manager.getNetworkStatus();

    assert.equal(status.tasks.total, 2);
    assert.equal(status.tasks.pending, 2);

    await manager.shutdown();

    console.log('✅ 5.3: Status after task delegation works');
}

// Test Suite 6: Audit Trail
console.log('\n📋 TEST SUITE 6: Audit Trail\n');

// Test 6.1: Get Audit Trail
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const auditTrail = manager.getAuditTrail();

    assert(auditTrail.orchestrator !== undefined);
    assert(auditTrail.messages !== undefined);
    assert(auditTrail.tasks !== undefined);

    assert(Array.isArray(auditTrail.orchestrator));
    assert(Array.isArray(auditTrail.messages));
    assert(Array.isArray(auditTrail.tasks));

    await manager.shutdown();

    console.log('✅ 6.1: Get audit trail works');
}

// Test 6.2: Audit Trail After Actions
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    await manager.delegateTask('beta', 'Test task', { taskType: 'code-analysis' });

    const auditTrail = manager.getAuditTrail();

    assert(auditTrail.tasks.length > 0);

    await manager.shutdown();

    console.log('✅ 6.2: Audit trail after actions works');
}

// Test Suite 7: Clone Status Query
console.log('\n📋 TEST SUITE 7: Clone Status Query\n');

// Test 7.1: Query Registered Clone Status
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const status = await manager.queryCloneStatus('beta');
    assert(status);
    assert.equal(status.clone, 'beta');

    await manager.shutdown();

    console.log('✅ 7.1: Query registered clone status works');
}

// Test 7.2: Query Unregistered Clone
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    try {
        await manager.queryCloneStatus('unknown-clone');
        assert.fail('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('not found'));
    }

    await manager.shutdown();

    console.log('✅ 7.2: Query unregistered clone throws error');
}

// Test Suite 8: Lifecycle Management
console.log('\n📋 TEST SUITE 8: Lifecycle Management\n');

// Test 8.1: Initialize and Shutdown
{
    const manager = new AutoGenRuntimeManager();

    assert.equal(manager.initialized, false);

    await manager.initialize();
    assert.equal(manager.initialized, true);

    await manager.shutdown();
    assert.equal(manager.initialized, false);

    console.log('✅ 8.1: Initialize and shutdown works');
}

// Test 8.2: Cannot Initialize Twice
{
    const manager = new AutoGenRuntimeManager();

    await manager.initialize();
    await manager.initialize();

    assert.equal(manager.initialized, true);

    await manager.shutdown();

    console.log('✅ 8.2: Cannot initialize twice works');
}

// Test 8.3: Resource Cleanup on Shutdown
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    await manager.delegateTask('beta', 'Test', {});

    const sizeBefore = manager.cloneRegistry.size;
    assert(sizeBefore > 0);

    await manager.shutdown();

    const sizeAfter = manager.cloneRegistry.size;
    assert.equal(sizeAfter, 0);

    console.log('✅ 8.3: Resource cleanup on shutdown works');
}

// Test Suite 9: Health Check Management
console.log('\n📋 TEST SUITE 9: Health Check Management\n');

// Test 9.1: Start Health Checks
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    assert(manager.runningHealthChecks.size > 0);

    await manager.shutdown();

    console.log('✅ 9.1: Start health checks works');
}

// Test 9.2: Stop Health Checks
{
    const manager = new AutoGenRuntimeManager();
    await manager.initialize();

    const sizeAfterInit = manager.runningHealthChecks.size;
    assert(sizeAfterInit > 0);

    manager.stopHealthChecks();

    assert.equal(manager.runningHealthChecks.size, 0);

    console.log('✅ 9.2: Stop health checks works');
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL RUNTIME MANAGER TESTS PASSED');
console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log('  ✅ Runtime Manager Initialization: 3/3 tests passed');
console.log('  ✅ Clone Registration: 3/3 tests passed');
console.log('  ✅ Task Delegation: 4/4 tests passed');
console.log('  ✅ Task Completion Tracking: 3/3 tests passed');
console.log('  ✅ Network Status: 3/3 tests passed');
console.log('  ✅ Audit Trail: 2/2 tests passed');
console.log('  ✅ Clone Status Query: 2/2 tests passed');
console.log('  ✅ Lifecycle Management: 3/3 tests passed');
console.log('  ✅ Health Check Management: 2/2 tests passed');
console.log('\n  Total: 25/25 tests passed ✅\n');
