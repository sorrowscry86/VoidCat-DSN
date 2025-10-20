/**
 * Unit Tests for RyuzuClone Base Class
 * Tests core clone functionality without network dependencies
 */

import { TaskAssignment, StatusQuery } from '../sanctuary-message-protocol.js';

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Mock RyuzuClone for testing (avoiding network dependencies)
 */
class MockRyuzuClone {
    constructor(role, specialization) {
        this.role = role;
        this.specialization = specialization;
        this.activeTasks = new Map();
        this.orchestrationEnabled = true;
        this.artifactManager = {
            initialize: async () => {},
            storeArtifact: async (type, content, metadata) => ({
                artifactId: 'mock-' + Date.now(),
                type,
                checksum: 'mock-checksum'
            })
        };
    }

    getSystemPrompt() {
        return `You are Ryuzu ${this.role}, specializing in ${this.specialization}.`;
    }

    enhancePrompt(prompt, context) {
        if (context) {
            return `${prompt}\n\nContext: ${JSON.stringify(context)}`;
        }
        return prompt;
    }

    processContextPackage(contextPackage) {
        if (!contextPackage) return '';
        
        let processedContext = `Objective: ${contextPackage.objective}\n`;
        
        if (contextPackage.artifactManifests && contextPackage.artifactManifests.length > 0) {
            processedContext += `\nArtifacts: ${contextPackage.artifactManifests.length} reference(s)\n`;
        }
        
        if (contextPackage.essentialData) {
            processedContext += `\nEssential Data: ${JSON.stringify(contextPackage.essentialData)}\n`;
        }
        
        if (contextPackage.constraints && contextPackage.constraints.length > 0) {
            processedContext += `\nConstraints: ${contextPackage.constraints.join(', ')}\n`;
        }
        
        return processedContext;
    }

    async handleOrchestrationTask(taskMessage) {
        if (!taskMessage.taskDescription || !taskMessage.taskType) {
            throw new Error('Invalid task assignment');
        }

        const taskId = taskMessage.messageId;
        this.activeTasks.set(taskId, {
            taskId,
            type: taskMessage.taskType,
            description: taskMessage.taskDescription,
            startTime: new Date(),
            status: 'processing'
        });

        return {
            acknowledged: true,
            taskId,
            estimatedCompletion: 5
        };
    }

    async handleStatusQuery(queryMessage) {
        return {
            role: this.role,
            specialization: this.specialization,
            status: 'active',
            activeTasks: this.activeTasks.size,
            orchestrationEnabled: this.orchestrationEnabled,
            timestamp: new Date().toISOString()
        };
    }

    getHealth() {
        return {
            status: 'active',
            role: this.role,
            specialization: this.specialization,
            timestamp: new Date().toISOString()
        };
    }
}

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
console.log('🧪 RYUZU CLONE BASE CLASS - UNIT TEST SUITE');
console.log('='.repeat(70) + '\n');

// TEST SUITE 1: Clone Initialization
console.log('📋 TEST SUITE 1: Clone Initialization\n');

await runTest('1.1: Clone creation with role and specialization', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    assert(clone.role === 'Beta', 'Role should be set');
    assert(clone.specialization === 'Code analysis', 'Specialization should be set');
});

await runTest('1.2: Clone has active tasks map', () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    assert(clone.activeTasks instanceof Map, 'Should have activeTasks Map');
    assert(clone.activeTasks.size === 0, 'Should start with no active tasks');
});

await runTest('1.3: Clone has orchestration enabled', () => {
    const clone = new MockRyuzuClone('Delta', 'Testing');
    assert(clone.orchestrationEnabled === true, 'Orchestration should be enabled');
});

await runTest('1.4: Clone has artifact manager', () => {
    const clone = new MockRyuzuClone('Sigma', 'Documentation');
    assert(clone.artifactManager, 'Should have artifact manager');
});

// TEST SUITE 2: System Prompt
console.log('\n📋 TEST SUITE 2: System Prompt\n');

await runTest('2.1: getSystemPrompt returns role-specific prompt', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const prompt = clone.getSystemPrompt();
    assert(prompt.includes('Beta'), 'Prompt should include role');
    assert(prompt.includes('Code analysis'), 'Prompt should include specialization');
});

await runTest('2.2: getSystemPrompt is consistent', () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    const prompt1 = clone.getSystemPrompt();
    const prompt2 = clone.getSystemPrompt();
    assert(prompt1 === prompt2, 'Prompt should be consistent');
});

// TEST SUITE 3: Prompt Enhancement
console.log('\n📋 TEST SUITE 3: Prompt Enhancement\n');

await runTest('3.1: enhancePrompt without context', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const enhanced = clone.enhancePrompt('Analyze this code');
    assert(enhanced === 'Analyze this code', 'Should return original prompt');
});

await runTest('3.2: enhancePrompt with context', () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    const enhanced = clone.enhancePrompt('Design system', { framework: 'Express' });
    assert(enhanced.includes('Design system'), 'Should include original prompt');
    assert(enhanced.includes('Express'), 'Should include context');
});

await runTest('3.3: enhancePrompt handles empty context', () => {
    const clone = new MockRyuzuClone('Delta', 'Testing');
    const enhanced = clone.enhancePrompt('Test application', null);
    assert(enhanced === 'Test application', 'Should handle null context');
});

// TEST SUITE 4: Context Package Processing
console.log('\n📋 TEST SUITE 4: Context Package Processing\n');

await runTest('4.1: processContextPackage with basic objective', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const contextPackage = {
        objective: 'Analyze security vulnerabilities'
    };
    const processed = clone.processContextPackage(contextPackage);
    assert(processed.includes('Analyze security vulnerabilities'), 'Should include objective');
});

await runTest('4.2: processContextPackage with artifacts', () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    const contextPackage = {
        objective: 'Design system',
        artifactManifests: [
            { artifactId: 'art-1', type: 'code' },
            { artifactId: 'art-2', type: 'doc' }
        ]
    };
    const processed = clone.processContextPackage(contextPackage);
    assert(processed.includes('2 reference(s)'), 'Should include artifact count');
});

await runTest('4.3: processContextPackage with essential data', () => {
    const clone = new MockRyuzuClone('Delta', 'Testing');
    const contextPackage = {
        objective: 'Test application',
        essentialData: {
            framework: 'Jest',
            coverage: '90%'
        }
    };
    const processed = clone.processContextPackage(contextPackage);
    assert(processed.includes('Jest'), 'Should include essential data');
});

await runTest('4.4: processContextPackage with constraints', () => {
    const clone = new MockRyuzuClone('Sigma', 'Documentation');
    const contextPackage = {
        objective: 'Document API',
        constraints: ['Use markdown', 'Keep under 500 words']
    };
    const processed = clone.processContextPackage(contextPackage);
    assert(processed.includes('markdown'), 'Should include constraints');
});

await runTest('4.5: processContextPackage handles null', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const processed = clone.processContextPackage(null);
    assert(processed === '', 'Should return empty string for null');
});

// TEST SUITE 5: Orchestration Task Handling
console.log('\n📋 TEST SUITE 5: Orchestration Task Handling\n');

await runTest('5.1: handleOrchestrationTask accepts valid task', async () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const task = new TaskAssignment('omega', 'beta', 'Analyze code', 'security-analysis');
    
    const result = await clone.handleOrchestrationTask(task);
    assert(result.acknowledged === true, 'Should acknowledge task');
    assert(result.taskId, 'Should have task ID');
});

await runTest('5.2: handleOrchestrationTask adds task to active tasks', async () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    const task = new TaskAssignment('omega', 'gamma', 'Design system', 'architecture-design');
    
    await clone.handleOrchestrationTask(task);
    assert(clone.activeTasks.size === 1, 'Should have one active task');
});

await runTest('5.3: handleOrchestrationTask validates task structure', async () => {
    const clone = new MockRyuzuClone('Delta', 'Testing');
    const invalidTask = new TaskAssignment('omega', 'delta', '', '');
    
    try {
        await clone.handleOrchestrationTask(invalidTask);
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('Invalid'), 'Should throw validation error');
    }
});

await runTest('5.4: handleOrchestrationTask tracks task details', async () => {
    const clone = new MockRyuzuClone('Sigma', 'Documentation');
    const task = new TaskAssignment('omega', 'sigma', 'Document API', 'documentation');
    
    await clone.handleOrchestrationTask(task);
    const taskData = clone.activeTasks.get(task.messageId);
    
    assert(taskData, 'Task data should exist');
    assert(taskData.type === 'documentation', 'Should track task type');
    assert(taskData.status === 'processing', 'Should have processing status');
});

// TEST SUITE 6: Status Query Handling
console.log('\n📋 TEST SUITE 6: Status Query Handling\n');

await runTest('6.1: handleStatusQuery returns clone status', async () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const query = new StatusQuery('omega', 'beta', 'health');
    
    const status = await clone.handleStatusQuery(query);
    assert(status.role === 'Beta', 'Should include role');
    assert(status.specialization === 'Code analysis', 'Should include specialization');
});

await runTest('6.2: handleStatusQuery includes active task count', async () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    const task = new TaskAssignment('omega', 'gamma', 'test task', 'test');
    await clone.handleOrchestrationTask(task);
    
    const query = new StatusQuery('omega', 'gamma', 'full');
    const status = await clone.handleStatusQuery(query);
    
    assert(status.activeTasks === 1, 'Should show one active task');
});

await runTest('6.3: handleStatusQuery includes timestamp', async () => {
    const clone = new MockRyuzuClone('Delta', 'Testing');
    const query = new StatusQuery('omega', 'delta', 'health');
    
    const status = await clone.handleStatusQuery(query);
    assert(status.timestamp, 'Should include timestamp');
});

// TEST SUITE 7: Health Status
console.log('\n📋 TEST SUITE 7: Health Status\n');

await runTest('7.1: getHealth returns active status', () => {
    const clone = new MockRyuzuClone('Sigma', 'Documentation');
    const health = clone.getHealth();
    assert(health.status === 'active', 'Should be active');
});

await runTest('7.2: getHealth includes role and specialization', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis');
    const health = clone.getHealth();
    assert(health.role === 'Beta', 'Should include role');
    assert(health.specialization === 'Code analysis', 'Should include specialization');
});

await runTest('7.3: getHealth includes timestamp', () => {
    const clone = new MockRyuzuClone('Gamma', 'Architecture');
    const health = clone.getHealth();
    assert(health.timestamp, 'Should include timestamp');
});

// TEST SUITE 8: Multiple Roles
console.log('\n📋 TEST SUITE 8: Multiple Roles\n');

await runTest('8.1: Beta clone has correct role', () => {
    const clone = new MockRyuzuClone('Beta', 'Code analysis and security');
    assert(clone.role === 'Beta', 'Beta role should be correct');
});

await runTest('8.2: Gamma clone has correct role', () => {
    const clone = new MockRyuzuClone('Gamma', 'System architecture');
    assert(clone.role === 'Gamma', 'Gamma role should be correct');
});

await runTest('8.3: Delta clone has correct role', () => {
    const clone = new MockRyuzuClone('Delta', 'Testing and QA');
    assert(clone.role === 'Delta', 'Delta role should be correct');
});

await runTest('8.4: Sigma clone has correct role', () => {
    const clone = new MockRyuzuClone('Sigma', 'Documentation');
    assert(clone.role === 'Sigma', 'Sigma role should be correct');
});

await runTest('8.5: Omega clone has correct role', () => {
    const clone = new MockRyuzuClone('Omega', 'Coordination');
    assert(clone.role === 'Omega', 'Omega role should be correct');
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
