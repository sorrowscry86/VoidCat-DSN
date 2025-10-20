/**
 * Unit Tests for Message Handlers
 * Tests message processing for orchestration
 */

import {
    handleTaskAssignment,
    handleStatusQuery,
    handleErrorEscalation,
    handleCoordinationMessage,
    processTaskResult,
    routeMessage,
    validateMessage
} from '../message-handlers.js';

import {
    TaskAssignment,
    StatusQuery,
    TaskCompletion,
    TaskFailure,
    ErrorEscalation
} from '../sanctuary-message-protocol.js';

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Mock clone object for testing
 */
const mockClone = {
    role: 'Beta',
    specialization: 'Code analysis and security review',
    activeTasks: [],
    completedTasks: 5,
    failedTasks: 1,
    currentLoad: 0.3
};

/**
 * Run a test case
 */
async function runTest(name, testFn) {
    testsRun++;
    try {
        await testFn();
        console.log(`✅ ${name}`);
        testsPassed++;
        return true;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
        testsFailed++;
        return false;
    }
}

/**
 * Assertion helper
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

console.log('\n' + '='.repeat(70));
console.log('🧪 MESSAGE HANDLERS - UNIT TEST SUITE');
console.log('='.repeat(70) + '\n');

// TEST SUITE 1: handleTaskAssignment
console.log('📋 TEST SUITE 1: handleTaskAssignment\n');

await runTest('1.1: handleTaskAssignment exists', () => {
    assert(typeof handleTaskAssignment === 'function', 
        'handleTaskAssignment should be a function');
});

await runTest('1.2: handleTaskAssignment processes valid task', async () => {
    const task = new TaskAssignment(
        'omega',
        'beta',
        'security-analysis',
        'Analyze authentication module for vulnerabilities'
    );
    
    const ack = await handleTaskAssignment(task, mockClone);
    
    assert(ack, 'Should return acknowledgment');
    assert(ack.fromClone === 'Beta', 'Acknowledgment should be from correct clone');
    assert(ack.originalTaskId === task.messageId, 'Should reference original task');
});

await runTest('1.3: handleTaskAssignment validates required fields', async () => {
    const invalidTask = new TaskAssignment('omega', 'beta', '', '');
    
    try {
        await handleTaskAssignment(invalidTask, mockClone);
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('Invalid'), 'Should throw validation error');
    }
});

await runTest('1.4: handleTaskAssignment sets estimated completion', async () => {
    const task = new TaskAssignment(
        'omega',
        'beta',
        'code-review',
        'Review payment processing code'
    );
    
    const ack = await handleTaskAssignment(task, mockClone);
    
    assert(ack.estimatedCompletionTime, 'Should have estimated completion time');
});

// TEST SUITE 2: handleStatusQuery
console.log('\n📋 TEST SUITE 2: handleStatusQuery\n');

await runTest('2.1: handleStatusQuery exists', () => {
    assert(typeof handleStatusQuery === 'function', 
        'handleStatusQuery should be a function');
});

await runTest('2.2: handleStatusQuery returns status response', async () => {
    const query = new StatusQuery('omega', 'beta', 'health');
    
    const response = await handleStatusQuery(query, mockClone);
    
    assert(response, 'Should return response');
    assert(response.fromClone === 'Beta', 'Response should be from correct clone');
    assert(response.status, 'Should have status data');
});

await runTest('2.3: handleStatusQuery includes clone details', async () => {
    const query = new StatusQuery('omega', 'beta', 'full');
    
    const response = await handleStatusQuery(query, mockClone);
    
    assert(response.cloneStatus.role === 'Beta', 'Should include role in cloneStatus');
    assert(response.cloneStatus.specialization, 'Should include specialization in cloneStatus');
});

await runTest('2.4: handleStatusQuery handles different query types', async () => {
    const healthQuery = new StatusQuery('omega', 'beta', 'health');
    const fullQuery = new StatusQuery('omega', 'beta', 'full');
    
    const healthResponse = await handleStatusQuery(healthQuery, mockClone);
    const fullResponse = await handleStatusQuery(fullQuery, mockClone);
    
    assert(healthResponse.status, 'Health query should return status');
    assert(fullResponse.status, 'Full query should return status');
});

// TEST SUITE 3: processTaskResult
console.log('\n📋 TEST SUITE 3: processTaskResult\n');

await runTest('3.1: processTaskResult exists', () => {
    assert(typeof processTaskResult === 'function', 
        'processTaskResult should be a function');
});

await runTest('3.2: processTaskResult handles successful task', () => {
    const taskResult = {
        success: true,
        result: { analysis: 'Complete' }
    };
    const task = new TaskAssignment('omega', 'beta', 'test', 'test task');
    
    const processed = processTaskResult(taskResult, task, mockClone);
    
    assert(processed, 'Should return processed result');
    assert(processed.messageType === 'TaskCompletion', 'Should be completion message');
});

await runTest('3.3: processTaskResult handles failed task', () => {
    const taskResult = {
        success: false,
        error: 'Task failed'
    };
    const task = new TaskAssignment('omega', 'beta', 'test', 'test task');
    
    const processed = processTaskResult(taskResult, task, mockClone);
    
    assert(processed, 'Should return processed result');
    assert(processed.messageType === 'TaskFailure', 'Should be failure message');
});

// TEST SUITE 4: routeMessage
console.log('\n📋 TEST SUITE 4: routeMessage\n');

await runTest('4.1: routeMessage exists', () => {
    assert(typeof routeMessage === 'function', 
        'routeMessage should be a function');
});

await runTest('4.2: routeMessage handles TaskAssignment', async () => {
    const task = new TaskAssignment(
        'omega',
        'beta',
        'security-analysis',
        'Analyze code'
    );
    
    const result = await routeMessage(task, mockClone);
    
    assert(result, 'Should return result');
});

await runTest('4.3: routeMessage handles StatusQuery', async () => {
    const query = new StatusQuery('omega', 'beta', 'health');
    
    const result = await routeMessage(query, mockClone);
    
    assert(result, 'Should return result');
});

// TEST SUITE 5: handleErrorEscalation
console.log('\n📋 TEST SUITE 5: handleErrorEscalation\n');

await runTest('5.1: handleErrorEscalation exists', () => {
    assert(typeof handleErrorEscalation === 'function', 
        'handleErrorEscalation should be a function');
});

await runTest('5.2: handleErrorEscalation processes escalation', async () => {
    const escalation = new ErrorEscalation(
        'beta',
        'omega',
        'critical',
        'Database connection lost',
        'System error'
    );
    
    const result = await handleErrorEscalation(escalation, mockClone);
    
    assert(result, 'Should return result');
    assert(result.acknowledged === true, 'Should be acknowledged');
});

await runTest('5.3: handleErrorEscalation handles critical severity', async () => {
    const criticalEscalation = new ErrorEscalation(
        'beta',
        'omega',
        'critical',
        'Critical system failure',
        'Immediate attention required'
    );
    
    const result = await handleErrorEscalation(criticalEscalation, mockClone);
    
    assert(result.action === 'logged_and_flagged', 'Critical errors should be flagged');
});

// TEST SUITE 6: validateMessage
console.log('\n📋 TEST SUITE 6: validateMessage\n');

await runTest('6.1: validateMessage exists', () => {
    assert(typeof validateMessage === 'function', 'validateMessage should be a function');
});

await runTest('6.2: validateMessage accepts valid messages', () => {
    const task = new TaskAssignment('omega', 'beta', 'test', 'test task');
    const result = validateMessage(task);
    assert(result.valid === true, 'Should validate correct message');
    assert(result.errors.length === 0, 'Should have no errors');
});

await runTest('6.3: validateMessage rejects invalid messages', () => {
    const invalid = { messageType: 'Invalid' };
    const result = validateMessage(invalid);
    assert(result.valid === false, 'Should reject invalid message');
    assert(result.errors.length > 0, 'Should have errors');
});

// TEST SUITE 7: Integration with Message Types
console.log('\n📋 TEST SUITE 7: Integration with Message Types\n');

await runTest('7.1: Handler works with TaskAssignment class', async () => {
    const task = new TaskAssignment(
        'omega',
        'beta',
        'security-analysis',
        'Comprehensive security audit'
    );
    
    assert(task.messageType === 'TaskAssignment', 'Message type should be correct');
    
    const ack = await handleTaskAssignment(task, mockClone);
    assert(ack, 'Should process TaskAssignment instance');
});

await runTest('7.2: Handler works with StatusQuery class', async () => {
    const query = new StatusQuery('omega', 'beta', 'health');
    
    assert(query.messageType === 'StatusQuery', 'Message type should be correct');
    
    const response = await handleStatusQuery(query, mockClone);
    assert(response, 'Should process StatusQuery instance');
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${testsRun}`);
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`Success Rate: ${((testsPassed/testsRun)*100).toFixed(1)}%`);
console.log('='.repeat(70) + '\n');

if (testsFailed > 0) {
    process.exit(1);
}
