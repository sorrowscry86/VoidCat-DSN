/**
 * Unit Tests: RyuzuOrchestratorAgent
 * 
 * Tests for AutoGen integration foundation orchestration layer
 * Validates command-and-control, task delegation, error handling
 */

import { strict as assert } from 'assert';
import {
    RyuzuOrchestratorAgent,
    TaskDelegation,
    TaskResult,
    ErrorReport
} from '../ryuzu-orchestrator-agent.js';

// Test Suite 1: Message Classes
console.log('\n📋 TEST SUITE 1: Message Classes\n');

// Test 1.1: TaskDelegation Creation
{
    const delegation = new TaskDelegation(
        'task_001',
        'omega',
        'beta',
        'Analyze code for security vulnerabilities',
        { priority: 'high', taskType: 'security-review' }
    );

    assert.equal(delegation.taskId, 'task_001');
    assert.equal(delegation.sourceClone, 'omega');
    assert.equal(delegation.targetClone, 'beta');
    assert.equal(delegation.priority, 'high');
    assert(delegation.timestamp);

    console.log('✅ 1.1: TaskDelegation message creation works');
}

// Test 1.2: TaskResult Creation
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

// Test 1.3: ErrorReport Creation
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

    // Verify routing table populated
    assert(orchestrator.routingTable.has('code-analysis'));
    assert(orchestrator.routingTable.has('architecture'));
    assert(orchestrator.routingTable.has('testing'));
    assert(orchestrator.routingTable.has('documentation'));

    // Verify routing destinations
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

// Test 4.1: Delegate Task to Registered Clone
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

// Test 4.2: Reject Task to Unregistered Clone
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

// Test 5.1: Record Task Completion
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

    // Should not throw, but log the critical error
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

    assert(auditTrail.length >= 2); // At least clone_registered and task_delegated
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

    // Create many actions to test bounding
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

    // Verify report structure
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
console.log('✅ ALL RYUZU ORCHESTRATOR AGENT TESTS PASSED');
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
