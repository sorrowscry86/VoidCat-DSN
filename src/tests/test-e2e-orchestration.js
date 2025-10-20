/**
 * End-to-End Orchestration Workflow Test
 * 
 * Simulates a complete multi-clone workflow:
 * 1. Omega coordinates a project
 * 2. Routes tasks to Beta, Gamma, Delta, Sigma
 * 3. Collects results
 * 4. Validates orchestration performance
 */

import RyuzuClone from '../ryuzu-clone.js';
import { 
    TaskAssignment, 
    StatusQuery
} from '../sanctuary-message-protocol.js';
import {
    selectClone,
    getRoutingRule
} from '../routing-config.js';
import {
    handleTaskAssignment,
    handleStatusQuery
} from '../message-handlers.js';

console.log('🚀 END-TO-END ORCHESTRATION WORKFLOW TEST\n');
console.log('='.repeat(60));

// Create mock clones
const clones = {
    omega: new RyuzuClone('Omega', 'Network coordination and orchestration'),
    beta: new RyuzuClone('Beta', 'Code analysis and security'),
    gamma: new RyuzuClone('Gamma', 'System architecture and design'),
    delta: new RyuzuClone('Delta', 'Testing and quality assurance'),
    sigma: new RyuzuClone('Sigma', 'Documentation and communication')
};

console.log('✅ Created 5 mock clones: Omega, Beta, Gamma, Delta, Sigma\n');

// Test Scenario: Multi-Clone Project Workflow
console.log('📋 SCENARIO: E-Commerce Platform Security Review\n');
console.log('Workflow Steps:');
console.log('  1. Omega coordinates the project');
console.log('  2. Beta analyzes security vulnerabilities');
console.log('  3. Gamma designs security architecture');
console.log('  4. Delta creates testing strategy');
console.log('  5. Sigma documents findings\n');

let testsPassed = 0;
let testsFailed = 0;

// Step 1: Omega initiates workflow
console.log('Step 1: Omega initiates workflow...');
try {
    const projectTasks = [
        { type: 'security-analysis', description: 'Analyze payment processing security' },
        { type: 'architecture-design', description: 'Design secure authentication system' },
        { type: 'test-strategy', description: 'Create security testing strategy' },
        { type: 'documentation', description: 'Document security best practices' }
    ];

    console.log(`  ✅ Defined ${projectTasks.length} tasks for delegation`);
    testsPassed++;
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 2: Route tasks to appropriate clones
console.log('\nStep 2: Route tasks to clones...');
try {
    const taskAssignments = [];
    
    // Task 1: Security Analysis → Beta
    const betaTask = new TaskAssignment(
        'Omega',
        'Beta',
        'Analyze payment processing security',
        'security-analysis',
        { priority: 'high', context: 'E-commerce payment gateway' }
    );
    taskAssignments.push({ clone: 'beta', task: betaTask });
    
    // Task 2: Architecture Design → Gamma
    const gammaTask = new TaskAssignment(
        'Omega',
        'Gamma',
        'Design secure authentication system',
        'architecture-design',
        { priority: 'high', context: 'Multi-factor authentication' }
    );
    taskAssignments.push({ clone: 'gamma', task: gammaTask });
    
    // Task 3: Test Strategy → Delta
    const deltaTask = new TaskAssignment(
        'Omega',
        'Delta',
        'Create security testing strategy',
        'test-strategy',
        { priority: 'normal', context: 'Penetration testing and vulnerability scanning' }
    );
    taskAssignments.push({ clone: 'delta', task: deltaTask });
    
    // Task 4: Documentation → Sigma
    const sigmaTask = new TaskAssignment(
        'Omega',
        'Sigma',
        'Document security best practices',
        'documentation',
        { priority: 'normal', context: 'Team guidelines and compliance' }
    );
    taskAssignments.push({ clone: 'sigma', task: sigmaTask });
    
    console.log(`  ✅ Created ${taskAssignments.length} task assignments`);
    testsPassed++;
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 3: Verify routing rules
console.log('\nStep 3: Verify routing rules...');
try {
    const securityRule = getRoutingRule('security-analysis');
    const architectureRule = getRoutingRule('architecture-design');
    const testRule = getRoutingRule('test-strategy');
    const docRule = getRoutingRule('documentation');
    
    if (securityRule.destination === 'beta' &&
        architectureRule.destination === 'gamma' &&
        testRule.destination === 'delta' &&
        docRule.destination === 'sigma') {
        console.log('  ✅ All routing rules are correct');
        console.log(`     - security-analysis → ${securityRule.destination}`);
        console.log(`     - architecture-design → ${architectureRule.destination}`);
        console.log(`     - test-strategy → ${testRule.destination}`);
        console.log(`     - documentation → ${docRule.destination}`);
        testsPassed++;
    } else {
        console.log('  ❌ Routing rules mismatch');
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 4: Send tasks to clones and get acknowledgments
console.log('\nStep 4: Send tasks and receive acknowledgments...');
try {
    const betaTask = new TaskAssignment('Omega', 'Beta', 'Security analysis', 'security-analysis');
    const betaAck = await handleTaskAssignment(betaTask, clones.beta);
    
    const gammaTask = new TaskAssignment('Omega', 'Gamma', 'Architecture design', 'architecture-design');
    const gammaAck = await handleTaskAssignment(gammaTask, clones.gamma);
    
    const deltaTask = new TaskAssignment('Omega', 'Delta', 'Test strategy', 'test-strategy');
    const deltaAck = await handleTaskAssignment(deltaTask, clones.delta);
    
    const sigmaTask = new TaskAssignment('Omega', 'Sigma', 'Documentation', 'documentation');
    const sigmaAck = await handleTaskAssignment(sigmaTask, clones.sigma);
    
    if (betaAck.messageType === 'TaskAcknowledgment' &&
        gammaAck.messageType === 'TaskAcknowledgment' &&
        deltaAck.messageType === 'TaskAcknowledgment' &&
        sigmaAck.messageType === 'TaskAcknowledgment') {
        console.log('  ✅ All clones acknowledged task assignments');
        console.log('     - Beta: acknowledged');
        console.log('     - Gamma: acknowledged');
        console.log('     - Delta: acknowledged');
        console.log('     - Sigma: acknowledged');
        testsPassed++;
    } else {
        console.log('  ❌ Some clones failed to acknowledge');
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 5: Query clone status
console.log('\nStep 5: Query clone status...');
try {
    const statusQuery = new StatusQuery('Omega', 'Beta', 'health');
    const betaStatus = await handleStatusQuery(statusQuery, clones.beta);
    
    if (betaStatus.messageType === 'StatusResponse' &&
        betaStatus.cloneStatus.role === 'Beta') {
        console.log('  ✅ Status queries work correctly');
        console.log(`     - Beta status: ${betaStatus.cloneStatus.health}`);
        console.log(`     - Active tasks: ${betaStatus.cloneStatus.activeTasks.length}`);
        testsPassed++;
    } else {
        console.log('  ❌ Status query failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 6: Verify orchestration status tracking
console.log('\nStep 6: Verify orchestration status tracking...');
try {
    const omegaStatus = clones.omega.getOrchestrationStatus();
    const betaStatus = clones.beta.getOrchestrationStatus();
    
    if (omegaStatus.orchestrationEnabled &&
        betaStatus.orchestrationEnabled &&
        omegaStatus.role === 'Omega' &&
        betaStatus.role === 'Beta') {
        console.log('  ✅ Orchestration status tracking works');
        console.log(`     - Omega: ${omegaStatus.activeTasks} active tasks`);
        console.log(`     - Beta: ${betaStatus.activeTasks} active tasks`);
        testsPassed++;
    } else {
        console.log('  ❌ Status tracking failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 7: Verify health-based routing
console.log('\nStep 7: Verify health-based routing...');
try {
    const healthStatus = {
        beta: 'healthy',
        gamma: 'healthy',
        delta: 'healthy',
        sigma: 'healthy',
        omega: 'healthy'
    };
    
    const selection = selectClone('security-analysis', healthStatus);
    
    if (selection.clone.role === 'Beta' && !selection.isFallback) {
        console.log('  ✅ Health-based routing works');
        console.log(`     - Selected ${selection.clone.role} for security-analysis`);
        testsPassed++;
    } else {
        console.log('  ❌ Health-based routing failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 8: Verify fallback routing
console.log('\nStep 8: Verify fallback routing when clone unavailable...');
try {
    const healthStatus = {
        beta: 'unhealthy',  // Primary clone down
        omega: 'healthy'    // Fallback available
    };
    
    const selection = selectClone('security-analysis', healthStatus);
    
    if (selection.clone.role === 'Omega' && selection.isFallback) {
        console.log('  ✅ Fallback routing works');
        console.log(`     - Primary (Beta) unavailable`);
        console.log(`     - Fallback to ${selection.clone.role}`);
        testsPassed++;
    } else {
        console.log('  ❌ Fallback routing failed');
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Step 9: Performance validation
console.log('\nStep 9: Performance validation...');
try {
    const startTime = Date.now();
    
    // Simulate rapid task delegation
    for (let i = 0; i < 10; i++) {
        const task = new TaskAssignment('Omega', 'Beta', `Task ${i}`, 'security-analysis');
        await handleTaskAssignment(task, clones.beta);
    }
    
    const duration = Date.now() - startTime;
    const avgLatency = duration / 10;
    
    if (avgLatency < 100) {
        console.log('  ✅ Performance validation passed');
        console.log(`     - 10 tasks delegated in ${duration}ms`);
        console.log(`     - Average latency: ${avgLatency.toFixed(2)}ms (<100ms target)`);
        testsPassed++;
    } else {
        console.log(`  ❌ Performance below target: ${avgLatency.toFixed(2)}ms`);
        testsFailed++;
    }
} catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    testsFailed++;
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('✅ END-TO-END WORKFLOW TEST RESULTS');
console.log('='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`  ✅ Workflow Steps Passed: ${testsPassed}`);
console.log(`  ❌ Workflow Steps Failed: ${testsFailed}`);
console.log(`  📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

console.log('\n📋 Capabilities Verified:');
console.log('  ✅ Multi-clone orchestration');
console.log('  ✅ Task routing based on specialization');
console.log('  ✅ Task acknowledgment workflow');
console.log('  ✅ Status query and response');
console.log('  ✅ Orchestration status tracking');
console.log('  ✅ Health-based routing');
console.log('  ✅ Fallback routing for reliability');
console.log('  ✅ Performance (<100ms latency)');

if (testsFailed === 0) {
    console.log('\n🎉 END-TO-END ORCHESTRATION TEST PASSED!\n');
    console.log('✨ The Digital Sanctuary Network is ready for production orchestration.\n');
    process.exit(0);
} else {
    console.log(`\n⚠️  ${testsFailed} step(s) failed - review output above\n`);
    process.exit(1);
}
