/**
 * Phase 2 Integration Tests
 * Tests orchestration capabilities across the clone network
 * 
 * Test Coverage:
 * - Base clone orchestration support
 * - Message routing and handling
 * - Task delegation and completion
 * - Status queries
 * - Error handling
 */

import RyuzuClone from '../ryuzu-clone.js';
import { 
    TaskAssignment, 
    TaskCompletion,
    TaskFailure,
    StatusQuery,
    StatusResponse 
} from '../sanctuary-message-protocol.js';
import {
    handleTaskAssignment,
    handleStatusQuery,
    processTaskResult,
    validateMessage
} from '../message-handlers.js';
import {
    getRoutingRule,
    getCloneInfo,
    selectClone,
    getCloneCapabilities
} from '../routing-config.js';

console.log('📋 PHASE 2 INTEGRATION TEST SUITE\n');
console.log('=' .repeat(60));

// Test Suite 1: Base Clone Orchestration Support
console.log('\n📋 TEST SUITE 1: Base Clone Orchestration\n');

let testsPassed = 0;
let testsFailed = 0;

try {
    // Test 1.1: Clone has orchestration properties
    const testClone = new RyuzuClone('Test', 'Testing');
    if (testClone.activeTasks && testClone.orchestrationEnabled) {
        console.log('✅ 1.1: Clone has orchestration properties');
        testsPassed++;
    } else {
        console.log('❌ 1.1: Clone missing orchestration properties');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 1.1: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 1.2: Clone has setupOrchestrationHandlers method
    const testClone = new RyuzuClone('Test', 'Testing');
    if (typeof testClone.setupOrchestrationHandlers === 'function') {
        console.log('✅ 1.2: Clone has setupOrchestrationHandlers method');
        testsPassed++;
    } else {
        console.log('❌ 1.2: Clone missing setupOrchestrationHandlers');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 1.2: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 1.3: Clone has handleTaskAssignment method
    const testClone = new RyuzuClone('Test', 'Testing');
    if (typeof testClone.handleTaskAssignment === 'function') {
        console.log('✅ 1.3: Clone has handleTaskAssignment method');
        testsPassed++;
    } else {
        console.log('❌ 1.3: Clone missing handleTaskAssignment');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 1.3: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 1.4: Clone has handleStatusQuery method
    const testClone = new RyuzuClone('Test', 'Testing');
    if (typeof testClone.handleStatusQuery === 'function') {
        console.log('✅ 1.4: Clone has handleStatusQuery method');
        testsPassed++;
    } else {
        console.log('❌ 1.4: Clone missing handleStatusQuery');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 1.4: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 1.5: Clone has getOrchestrationStatus method
    const testClone = new RyuzuClone('Test', 'Testing');
    if (typeof testClone.getOrchestrationStatus === 'function') {
        console.log('✅ 1.5: Clone has getOrchestrationStatus method');
        testsPassed++;
    } else {
        console.log('❌ 1.5: Clone missing getOrchestrationStatus');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 1.5: Error - ${error.message}`);
    testsFailed++;
}

// Test Suite 2: Message Creation and Validation
console.log('\n📋 TEST SUITE 2: Message Creation and Validation\n');

try {
    // Test 2.1: Create TaskAssignment message
    const taskMsg = new TaskAssignment(
        'Omega',
        'Beta',
        'Analyze security vulnerabilities',
        'security-analysis',
        { priority: 'high' }
    );
    if (taskMsg.messageType === 'TaskAssignment' && taskMsg.taskType === 'security-analysis') {
        console.log('✅ 2.1: TaskAssignment message creation works');
        testsPassed++;
    } else {
        console.log('❌ 2.1: TaskAssignment message invalid');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 2.1: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 2.2: Validate valid message
    const taskMsg = new TaskAssignment(
        'Omega',
        'Beta',
        'Test task',
        'test-type'
    );
    const validation = validateMessage(taskMsg);
    if (validation.valid) {
        console.log('✅ 2.2: Message validation accepts valid message');
        testsPassed++;
    } else {
        console.log(`❌ 2.2: Message validation failed: ${validation.errors.join(', ')}`);
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 2.2: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 2.3: Validate invalid message
    const invalidMsg = {
        messageType: 'TaskAssignment',
        // Missing required fields
    };
    const validation = validateMessage(invalidMsg);
    if (!validation.valid && validation.errors.length > 0) {
        console.log('✅ 2.3: Message validation rejects invalid message');
        testsPassed++;
    } else {
        console.log('❌ 2.3: Message validation should reject invalid message');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 2.3: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 2.4: Create StatusQuery message
    const statusQuery = new StatusQuery('Omega', 'Beta', 'health');
    if (statusQuery.messageType === 'StatusQuery' && statusQuery.queryType === 'health') {
        console.log('✅ 2.4: StatusQuery message creation works');
        testsPassed++;
    } else {
        console.log('❌ 2.4: StatusQuery message invalid');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 2.4: Error - ${error.message}`);
    testsFailed++;
}

// Test Suite 3: Routing Configuration
console.log('\n📋 TEST SUITE 3: Routing Configuration\n');

try {
    // Test 3.1: Get routing rule for known task type
    const rule = getRoutingRule('security-analysis');
    if (rule && rule.destination === 'beta') {
        console.log('✅ 3.1: getRoutingRule returns correct rule');
        testsPassed++;
    } else {
        console.log('❌ 3.1: getRoutingRule failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 3.1: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 3.2: Get clone info
    const cloneInfo = getCloneInfo('beta');
    if (cloneInfo && cloneInfo.role === 'Beta') {
        console.log('✅ 3.2: getCloneInfo returns correct info');
        testsPassed++;
    } else {
        console.log('❌ 3.2: getCloneInfo failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 3.2: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 3.3: Select clone for task type
    const selection = selectClone('architecture-design', { gamma: 'healthy' });
    if (selection && selection.clone.role === 'Gamma') {
        console.log('✅ 3.3: selectClone picks correct clone');
        testsPassed++;
    } else {
        console.log('❌ 3.3: selectClone failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 3.3: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 3.4: Fallback when primary clone unavailable
    const selection = selectClone('security-analysis', { beta: 'unhealthy', omega: 'healthy' });
    if (selection && selection.isFallback && selection.clone.role === 'Omega') {
        console.log('✅ 3.4: selectClone uses fallback when primary unavailable');
        testsPassed++;
    } else {
        console.log('❌ 3.4: selectClone fallback failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 3.4: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 3.5: Get clone capabilities
    const capabilities = getCloneCapabilities('beta');
    if (capabilities && capabilities.includes('security-analysis')) {
        console.log('✅ 3.5: getCloneCapabilities returns correct capabilities');
        testsPassed++;
    } else {
        console.log('❌ 3.5: getCloneCapabilities failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 3.5: Error - ${error.message}`);
    testsFailed++;
}

// Test Suite 4: Message Handlers
console.log('\n📋 TEST SUITE 4: Message Handlers\n');

try {
    // Test 4.1: handleTaskAssignment
    const testClone = new RyuzuClone('Test', 'Testing');
    const taskMsg = new TaskAssignment(
        'Omega',
        'Test',
        'Test task',
        'test-type'
    );
    const ack = await handleTaskAssignment(taskMsg, testClone);
    if (ack && ack.messageType === 'TaskAcknowledgment') {
        console.log('✅ 4.1: handleTaskAssignment creates acknowledgment');
        testsPassed++;
    } else {
        console.log('❌ 4.1: handleTaskAssignment failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 4.1: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 4.2: handleStatusQuery
    const testClone = new RyuzuClone('Test', 'Testing');
    const statusQuery = new StatusQuery('Omega', 'Test', 'health');
    const response = await handleStatusQuery(statusQuery, testClone);
    if (response && response.messageType === 'StatusResponse') {
        console.log('✅ 4.2: handleStatusQuery creates response');
        testsPassed++;
    } else {
        console.log('❌ 4.2: handleStatusQuery failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 4.2: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 4.3: processTaskResult for success
    const testClone = new RyuzuClone('Test', 'Testing');
    const originalMsg = new TaskAssignment('Omega', 'Test', 'Test task', 'test-type');
    const taskResult = {
        success: true,
        result: { data: 'test result' }
    };
    const resultMsg = processTaskResult(taskResult, originalMsg, testClone);
    if (resultMsg instanceof TaskCompletion) {
        console.log('✅ 4.3: processTaskResult creates TaskCompletion for success');
        testsPassed++;
    } else {
        console.log('❌ 4.3: processTaskResult failed to create TaskCompletion');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 4.3: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 4.4: processTaskResult for failure
    const testClone = new RyuzuClone('Test', 'Testing');
    const originalMsg = new TaskAssignment('Omega', 'Test', 'Test task', 'test-type');
    const taskResult = {
        success: false,
        error: 'Test error'
    };
    const resultMsg = processTaskResult(taskResult, originalMsg, testClone);
    if (resultMsg instanceof TaskFailure) {
        console.log('✅ 4.4: processTaskResult creates TaskFailure for failure');
        testsPassed++;
    } else {
        console.log('❌ 4.4: processTaskResult failed to create TaskFailure');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 4.4: Error - ${error.message}`);
    testsFailed++;
}

// Test Suite 5: Clone Orchestration Status
console.log('\n📋 TEST SUITE 5: Clone Orchestration Status\n');

try {
    // Test 5.1: Get orchestration status
    const testClone = new RyuzuClone('Test', 'Testing');
    const status = testClone.getOrchestrationStatus();
    if (status && status.role === 'Test' && status.activeTasks === 0) {
        console.log('✅ 5.1: getOrchestrationStatus returns correct status');
        testsPassed++;
    } else {
        console.log('❌ 5.1: getOrchestrationStatus failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 5.1: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 5.2: Track active tasks
    const testClone = new RyuzuClone('Test', 'Testing');
    testClone.activeTasks.set('task-1', { taskId: 'task-1', status: 'in-progress' });
    const status = testClone.getOrchestrationStatus();
    if (status.activeTasks === 1 && status.activeTaskIds.includes('task-1')) {
        console.log('✅ 5.2: Active tasks are tracked correctly');
        testsPassed++;
    } else {
        console.log('❌ 5.2: Active task tracking failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 5.2: Error - ${error.message}`);
    testsFailed++;
}

// Test Suite 6: All Clone Types
console.log('\n📋 TEST SUITE 6: Individual Clone Types\n');

try {
    // Test 6.1: Beta clone inherits orchestration
    const { default: RyuzuBeta } = await import('../beta-clone.js');
    const beta = new RyuzuBeta();
    if (beta.orchestrationEnabled && typeof beta.handleTaskAssignment === 'function') {
        console.log('✅ 6.1: Beta clone has orchestration support');
        testsPassed++;
    } else {
        console.log('❌ 6.1: Beta clone missing orchestration');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 6.1: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 6.2: Gamma clone inherits orchestration
    const { default: RyuzuGamma } = await import('../gamma-clone.js');
    const gamma = new RyuzuGamma();
    if (gamma.orchestrationEnabled && typeof gamma.handleTaskAssignment === 'function') {
        console.log('✅ 6.2: Gamma clone has orchestration support');
        testsPassed++;
    } else {
        console.log('❌ 6.2: Gamma clone missing orchestration');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 6.2: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 6.3: Delta clone inherits orchestration
    const { default: RyuzuDelta } = await import('../delta-clone.js');
    const delta = new RyuzuDelta();
    if (delta.orchestrationEnabled && typeof delta.handleTaskAssignment === 'function') {
        console.log('✅ 6.3: Delta clone has orchestration support');
        testsPassed++;
    } else {
        console.log('❌ 6.3: Delta clone missing orchestration');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 6.3: Error - ${error.message}`);
    testsFailed++;
}

try {
    // Test 6.4: Sigma clone inherits orchestration
    const { default: RyuzuSigma } = await import('../sigma-clone.js');
    const sigma = new RyuzuSigma();
    if (sigma.orchestrationEnabled && typeof sigma.handleTaskAssignment === 'function') {
        console.log('✅ 6.4: Sigma clone has orchestration support');
        testsPassed++;
    } else {
        console.log('❌ 6.4: Sigma clone missing orchestration');
        testsFailed++;
    }
} catch (error) {
    console.log(`❌ 6.4: Error - ${error.message}`);
    testsFailed++;
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('✅ PHASE 2 INTEGRATION TEST RESULTS');
console.log('='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`  ✅ Tests Passed: ${testsPassed}`);
console.log(`  ❌ Tests Failed: ${testsFailed}`);
console.log(`  📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
    console.log('\n🎉 ALL PHASE 2 INTEGRATION TESTS PASSED!\n');
    process.exit(0);
} else {
    console.log(`\n⚠️  ${testsFailed} test(s) failed - review output above\n`);
    process.exit(1);
}
