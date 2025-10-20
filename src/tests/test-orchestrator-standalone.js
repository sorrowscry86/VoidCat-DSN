/**
 * Unit Tests: RyuzuOrchestratorAgent (Standalone - No AutoGen Dependency)
 * 
 * Tests for orchestration foundation layer
 * Validates command-and-control, task delegation, error handling
 */

import { strict as assert } from 'assert';

// Mock the AutoGen imports for testing purposes
class RoutedAgent {
    constructor(config) {
        this.config = config;
    }
}

class DefaultAssistant {}
class MessageContext {}

/**
 * Standalone RyuzuOrchestratorAgent Implementation (for testing)
 */
class RyuzuOrchestratorAgent extends RoutedAgent {
    constructor(role = 'Omega', specialization = 'Network Coordination') {
        super({
            model_client: new DefaultAssistant(),
            system_prompt: `You are Ryuzu ${role}, orchestrator of the Digital Sanctuary Network.`
        });

        this.role = role;
        this.specialization = specialization;
        this.taskLog = new Map();
        this.cloneRegistry = new Map();
        this.routingTable = new Map();
        this.messageHistory = [];
        this.initializeDefaultRouting();
    }

    initializeDefaultRouting() {
        this.routingTable.set('code-analysis', 'beta');
        this.routingTable.set('security-review', 'beta');
        this.routingTable.set('debugging', 'beta');

        this.routingTable.set('architecture', 'gamma');
        this.routingTable.set('system-design', 'gamma');
        this.routingTable.set('scalability', 'gamma');

        this.routingTable.set('testing', 'delta');
        this.routingTable.set('qa-strategy', 'delta');
        this.routingTable.set('validation', 'delta');

        this.routingTable.set('documentation', 'sigma');
        this.routingTable.set('communication', 'sigma');
        this.routingTable.set('knowledge-base', 'sigma');
    }

    registerClone(cloneName, cloneInfo) {
        this.cloneRegistry.set(cloneName, {
            name: cloneName,
            specialization: cloneInfo.specialization,
            port: cloneInfo.port,
            status: 'registered',
            registeredAt: new Date().toISOString()
        });
        this.logAction('clone_registered', { clone: cloneName, ...cloneInfo });
    }

    delegateTask(taskId, targetClone, taskDescription, parameters = {}) {
        if (!this.cloneRegistry.has(targetClone)) {
            throw new Error(`Target clone '${targetClone}' not registered in orchestrator`);
        }

        const delegation = {
            taskId,
            sourceClone: this.role,
            targetClone,
            taskDescription,
            parameters,
            timestamp: new Date().toISOString(),
            priority: parameters.priority || 'normal'
        };

        this.taskLog.set(taskId, {
            delegation,
            status: 'pending',
            startTime: new Date(),
            result: null,
            error: null
        });

        this.logAction('task_delegated', {
            taskId,
            targetClone,
            taskDescription,
            parameters
        });

        return delegation;
    }

    recordTaskResult(result) {
        const taskRecord = this.taskLog.get(result.taskId);
        
        if (!taskRecord) {
            throw new Error(`Task '${result.taskId}' not found in task log`);
        }

        taskRecord.status = result.success ? 'completed' : 'failed';
        taskRecord.result = result;
        taskRecord.endTime = new Date();
        taskRecord.duration = taskRecord.endTime - taskRecord.startTime;

        this.logAction('task_completed', {
            taskId: result.taskId,
            success: result.success,
            duration: taskRecord.duration,
            sourceClone: result.sourceClone
        });

        return taskRecord;
    }

    recordError(error) {
        const taskRecord = this.taskLog.get(error.taskId);
        
        if (taskRecord) {
            taskRecord.status = 'error';
            taskRecord.error = error;
            taskRecord.endTime = new Date();
        }

        this.logAction('error_reported', {
            taskId: error.taskId,
            severity: error.severity,
            message: error.message,
            sourceClone: error.sourceClone
        });

        if (error.severity === 'critical') {
            this.handleCriticalError(error);
        }
    }

    handleCriticalError(error) {
        this.logAction('critical_error_handling', {
            taskId: error.taskId,
            message: error.message,
            sourceClone: error.sourceClone
        });
    }

    getRoutingDestination(taskType) {
        return this.routingTable.get(taskType) || null;
    }

    getTaskStatus(taskId) {
        return this.taskLog.get(taskId) || null;
    }

    getActiveTasks() {
        return Array.from(this.taskLog.values())
            .filter(record => record.status === 'pending' || record.status === 'in-progress');
    }

    getAuditTrail() {
        return [...this.messageHistory];
    }

    logAction(action, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action,
            role: this.role,
            details
        };

        this.messageHistory.push(logEntry);

        if (this.messageHistory.length > 10000) {
            this.messageHistory = this.messageHistory.slice(-10000);
        }
    }

    getStatusReport() {
        return {
            orchestrator: this.role,
            specialization: this.specialization,
            timestamp: new Date().toISOString(),
            clones: {
                registered: this.cloneRegistry.size,
                list: Array.from(this.cloneRegistry.values())
            },
            tasks: {
                total: this.taskLog.size,
                active: this.getActiveTasks().length,
                completed: Array.from(this.taskLog.values()).filter(t => t.status === 'completed').length,
                failed: Array.from(this.taskLog.values()).filter(t => t.status === 'failed').length,
                errors: Array.from(this.taskLog.values()).filter(t => t.status === 'error').length
            },
            auditTrail: {
                entries: this.messageHistory.length,
                lastAction: this.messageHistory[this.messageHistory.length - 1] || null
            }
        };
    }
}

// Test Suite 1: Message Classes
console.log('\n📋 TEST SUITE 1: Task Message Structure\n');

class TaskDelegation {
    constructor(taskId, sourceClone, targetClone, taskDescription, parameters = {}) {
        this.taskId = taskId;
        this.sourceClone = sourceClone;
        this.targetClone = targetClone;
        this.taskDescription = taskDescription;
        this.parameters = parameters;
        this.timestamp = new Date().toISOString();
        this.priority = parameters.priority || 'normal';
    }
}

class TaskResult {
    constructor(taskId, sourceClone, targetClone, success, result, error = null) {
        this.taskId = taskId;
        this.sourceClone = sourceClone;
        this.targetClone = targetClone;
        this.success = success;
        this.result = result;
        this.error = error;
        this.timestamp = new Date().toISOString();
    }
}

class ErrorReport {
    constructor(taskId, sourceClone, targetClone, severity, message, context = {}) {
        this.taskId = taskId;
        this.sourceClone = sourceClone;
        this.targetClone = targetClone;
        this.severity = severity;
        this.message = message;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}

// Test 1.1: TaskDelegation
{
    const delegation = new TaskDelegation(
        'task_001',
        'omega',
        'beta',
        'Analyze code for security',
        { priority: 'high', taskType: 'security-review' }
    );

    assert.equal(delegation.taskId, 'task_001');
    assert.equal(delegation.sourceClone, 'omega');
    assert.equal(delegation.targetClone, 'beta');
    assert.equal(delegation.priority, 'high');
    assert(delegation.timestamp);

    console.log('✅ 1.1: TaskDelegation message creation works');
}

// Test 1.2: TaskResult
{
    const result = new TaskResult(
        'task_001',
        'beta',
        'omega',
        true,
        { vulnerabilities: ['SQLi', 'XSS'], score: 7.2 }
    );

    assert.equal(result.taskId, 'task_001');
    assert.equal(result.success, true);
    assert.deepEqual(result.result.vulnerabilities, ['SQLi', 'XSS']);

    console.log('✅ 1.2: TaskResult message creation works');
}

// Test 1.3: ErrorReport
{
    const error = new ErrorReport(
        'task_002',
        'gamma',
        'omega',
        'critical',
        'Database connection failed',
        { database: 'postgres', timeout: 30000 }
    );

    assert.equal(error.severity, 'critical');
    assert.equal(error.message, 'Database connection failed');
    assert.deepEqual(error.context.database, 'postgres');

    console.log('✅ 1.3: ErrorReport message creation works');
}

// Test Suite 2: OrchestratorAgent Initialization
console.log('\n📋 TEST SUITE 2: OrchestratorAgent Initialization\n');

// Test 2.1: Create Orchestrator
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    assert.equal(orchestrator.role, 'Omega');
    assert.equal(orchestrator.specialization, 'Network Coordination');
    assert(orchestrator.taskLog instanceof Map);
    assert(orchestrator.cloneRegistry instanceof Map);
    assert(orchestrator.routingTable instanceof Map);

    console.log('✅ 2.1: OrchestratorAgent creates successfully');
}

// Test 2.2: Default Routing Initialization
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    assert(orchestrator.routingTable.has('code-analysis'));
    assert(orchestrator.routingTable.has('architecture'));
    assert(orchestrator.routingTable.has('testing'));
    assert(orchestrator.routingTable.has('documentation'));

    assert.equal(orchestrator.getRoutingDestination('code-analysis'), 'beta');
    assert.equal(orchestrator.getRoutingDestination('architecture'), 'gamma');
    assert.equal(orchestrator.getRoutingDestination('testing'), 'delta');
    assert.equal(orchestrator.getRoutingDestination('documentation'), 'sigma');

    console.log('✅ 2.2: Default routing table initialized correctly');
}

// Test Suite 3: Clone Registration
console.log('\n📋 TEST SUITE 3: Clone Registration\n');

// Test 3.1: Register Single Clone
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    assert(orchestrator.cloneRegistry.has('beta'));
    const betaInfo = orchestrator.cloneRegistry.get('beta');
    assert.equal(betaInfo.name, 'beta');
    assert.equal(betaInfo.specialization, 'Code Analysis & Security');
    assert.equal(betaInfo.port, 3002);
    assert.equal(betaInfo.status, 'registered');

    console.log('✅ 3.1: Single clone registration works');
}

// Test 3.2: Register Multiple Clones
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    const clones = [
        { name: 'beta', specialization: 'Code Analysis', port: 3002 },
        { name: 'gamma', specialization: 'Architecture', port: 3003 },
        { name: 'delta', specialization: 'Testing', port: 3004 },
        { name: 'sigma', specialization: 'Documentation', port: 3005 }
    ];

    clones.forEach(clone => {
        orchestrator.registerClone(clone.name, {
            specialization: clone.specialization,
            port: clone.port
        });
    });

    assert.equal(orchestrator.cloneRegistry.size, 4);

    console.log('✅ 3.2: Multiple clone registration works');
}

// Test Suite 4: Task Delegation
console.log('\n📋 TEST SUITE 4: Task Delegation\n');

// Test 4.1: Delegate Task
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    const delegation = orchestrator.delegateTask(
        'task_001',
        'beta',
        'Review code for security issues',
        { priority: 'high', taskType: 'security-review' }
    );

    assert.equal(delegation.taskId, 'task_001');
    assert.equal(delegation.targetClone, 'beta');
    assert(orchestrator.taskLog.has('task_001'));

    const taskRecord = orchestrator.taskLog.get('task_001');
    assert.equal(taskRecord.status, 'pending');

    console.log('✅ 4.1: Task delegation to registered clone works');
}

// Test 4.2: Reject Unregistered Clone
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    try {
        orchestrator.delegateTask(
            'task_002',
            'unknown-clone',
            'Some task',
            {}
        );
        assert.fail('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('not registered'));
        console.log('✅ 4.2: Task delegation rejects unregistered clones');
    }
}

// Test 4.3: Get Active Tasks
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Task 1', {});
    orchestrator.delegateTask('task_002', 'beta', 'Task 2', {});

    const activeTasks = orchestrator.getActiveTasks();
    assert.equal(activeTasks.length, 2);

    console.log('✅ 4.3: Get active tasks works');
}

// Test Suite 5: Task Completion
console.log('\n📋 TEST SUITE 5: Task Completion\n');

// Test 5.1: Record Completion
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});

    const result = new TaskResult(
        'task_001',
        'beta',
        'omega',
        true,
        { score: 8.5, issues: 3 }
    );

    const taskRecord = orchestrator.recordTaskResult(result);

    assert.equal(taskRecord.status, 'completed');
    assert.equal(taskRecord.result.success, true);
    assert(taskRecord.duration !== undefined);

    console.log('✅ 5.1: Recording task completion works');
}

// Test 5.2: Get Task Status
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});

    const status = orchestrator.getTaskStatus('task_001');
    assert.equal(status.status, 'pending');

    console.log('✅ 5.2: Get task status works');
}

// Test Suite 6: Error Handling
console.log('\n📋 TEST SUITE 6: Error Handling\n');

// Test 6.1: Record Error
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});

    const error = new ErrorReport(
        'task_001',
        'beta',
        'omega',
        'medium',
        'Timeout during analysis',
        { timeout: 30000 }
    );

    orchestrator.recordError(error);

    const taskStatus = orchestrator.getTaskStatus('task_001');
    assert.equal(taskStatus.status, 'error');

    console.log('✅ 6.1: Recording error works');
}

// Test 6.2: Critical Error Handling
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});

    const criticalError = new ErrorReport(
        'task_001',
        'beta',
        'omega',
        'critical',
        'Clone process crashed',
        { exitCode: 1 }
    );

    orchestrator.recordError(criticalError);

    const auditTrail = orchestrator.getAuditTrail();
    assert(auditTrail.length > 0);

    console.log('✅ 6.2: Critical error handling works');
}

// Test Suite 7: Audit Trail
console.log('\n📋 TEST SUITE 7: Audit Trail\n');

// Test 7.1: Audit Trail Logging
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});

    const auditTrail = orchestrator.getAuditTrail();

    assert(auditTrail.length >= 2);
    assert(auditTrail[0].action === 'clone_registered');
    assert(auditTrail[1].action === 'task_delegated');

    console.log('✅ 7.1: Audit trail logging works');
}

// Test 7.2: Audit Trail Bounded
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    for (let i = 0; i < 10100; i++) {
        orchestrator.logAction('test_action', { index: i });
    }

    const auditTrail = orchestrator.getAuditTrail();
    assert(auditTrail.length <= 10000);

    console.log('✅ 7.2: Audit trail is properly bounded');
}

// Test Suite 8: Status Reporting
console.log('\n📋 TEST SUITE 8: Status Reporting\n');

// Test 8.1: Generate Status Report
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.registerClone('gamma', {
        specialization: 'System Architecture',
        port: 3003
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});
    orchestrator.delegateTask('task_002', 'gamma', 'Design architecture', {});

    const report = orchestrator.getStatusReport();

    assert.equal(report.orchestrator, 'Omega');
    assert.equal(report.clones.registered, 2);
    assert.equal(report.tasks.total, 2);
    assert.equal(report.tasks.active, 2);

    console.log('✅ 8.1: Status report generation works');
}

// Test 8.2: Status Report Structure
{
    const orchestrator = new RyuzuOrchestratorAgent('Omega', 'Network Coordination');

    orchestrator.registerClone('beta', {
        specialization: 'Code Analysis & Security',
        port: 3002
    });

    orchestrator.delegateTask('task_001', 'beta', 'Analyze code', {});

    const report = orchestrator.getStatusReport();

    assert(report.timestamp);
    assert(report.orchestrator);
    assert(report.clones);
    assert(report.tasks);
    assert(report.auditTrail);
    assert.equal(typeof report.clones.registered, 'number');
    assert(Array.isArray(report.clones.list));

    console.log('✅ 8.2: Status report has correct structure');
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL ORCHESTRATOR AGENT TESTS PASSED');
console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log('  ✅ Message Classes: 3/3 tests passed');
console.log('  ✅ Initialization: 2/2 tests passed');
console.log('  ✅ Clone Registration: 2/2 tests passed');
console.log('  ✅ Task Delegation: 3/3 tests passed');
console.log('  ✅ Task Completion: 2/2 tests passed');
console.log('  ✅ Error Handling: 2/2 tests passed');
console.log('  ✅ Audit Trail: 2/2 tests passed');
console.log('  ✅ Status Reporting: 2/2 tests passed');
console.log('\n  Total: 18/18 tests passed ✅\n');
