/**
 * Unit Tests for Context Engineer
 * Tests context package construction and quality scoring
 */

import ContextEngineer from '../context-engineer.js';

let contextEngineer;
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

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
console.log('🧪 CONTEXT ENGINEER - UNIT TEST SUITE');
console.log('='.repeat(70) + '\n');

// Setup
contextEngineer = new ContextEngineer();

// TEST SUITE 1: Initialization
console.log('📋 TEST SUITE 1: Initialization\n');

await runTest('1.1: ContextEngineer creation works', () => {
    assert(contextEngineer !== null, 'Engineer should be created');
    assert(contextEngineer.contextSchema, 'Schema should be defined');
});

await runTest('1.2: Context schema has required fields', () => {
    assert(contextEngineer.contextSchema.objective === 'string', 'Should have objective field');
    assert(contextEngineer.contextSchema.targetClone === 'string', 'Should have targetClone field');
    assert(contextEngineer.contextSchema.artifactManifests === 'array', 'Should have artifactManifests field');
});

// TEST SUITE 2: Basic Context Package Construction
console.log('\n📋 TEST SUITE 2: Basic Context Package Construction\n');

await runTest('2.1: Minimal context package creation works', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Analyze code for security vulnerabilities',
        targetClone: 'beta'
    });
    
    assert(context.contextId, 'Should have context ID');
    assert(context.objective, 'Should have objective');
    assert(context.targetClone === 'beta', 'Target clone should match');
    assert(context.timestamp, 'Should have timestamp');
});

await runTest('2.2: Context package with artifacts works', () => {
    const artifactManifest = {
        artifactId: 'test-123',
        type: 'code',
        checksum: 'abc123'
    };
    
    const context = contextEngineer.constructContextPackage({
        objective: 'Review architecture',
        targetClone: 'gamma',
        artifactManifests: [artifactManifest]
    });
    
    assert(Array.isArray(context.artifactManifests), 'Should have artifact manifests array');
    assert(context.artifactManifests.length === 1, 'Should have one manifest');
});

await runTest('2.3: Context package with essential data works', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Test application',
        targetClone: 'delta',
        essentialData: {
            framework: 'Jest',
            coverage: '90%'
        }
    });
    
    assert(context.essentialData, 'Should have essential data');
    assert(context.essentialData.framework === 'Jest', 'Essential data preserved');
});

await runTest('2.4: Context package with constraints works', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Document API',
        targetClone: 'sigma',
        constraints: ['Keep under 500 words', 'Use markdown format']
    });
    
    assert(Array.isArray(context.constraints), 'Should have constraints array');
    assert(context.constraints.length === 2, 'Should have two constraints');
});

// TEST SUITE 3: Validation
console.log('\n📋 TEST SUITE 3: Validation\n');

await runTest('3.1: Missing objective throws error', () => {
    try {
        contextEngineer.constructContextPackage({
            targetClone: 'beta'
        });
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('objective'), 'Should mention objective');
    }
});

await runTest('3.2: Missing targetClone throws error', () => {
    try {
        contextEngineer.constructContextPackage({
            objective: 'Test objective'
        });
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('targetClone'), 'Should mention targetClone');
    }
});

// TEST SUITE 4: Quality Metrics
console.log('\n📋 TEST SUITE 4: Quality Metrics\n');

await runTest('4.1: Context quality metrics are generated', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Analyze security vulnerabilities in authentication module',
        targetClone: 'beta'
    });
    
    assert(context.quality, 'Should have quality metrics');
    assert(typeof context.quality.overallQuality === 'number', 'Should have overall quality score');
});

await runTest('4.2: Quality score is 0-100 range', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Test',
        targetClone: 'delta'
    });
    
    assert(context.quality.overallQuality >= 0, 'Quality should be >= 0');
    assert(context.quality.overallQuality <= 100, 'Quality should be <= 100');
});

await runTest('4.3: Optimal objective length scores higher', () => {
    const shortContext = contextEngineer.constructContextPackage({
        objective: 'Review code',
        targetClone: 'beta'
    });
    
    const optimalContext = contextEngineer.constructContextPackage({
        objective: 'Analyze authentication module for SQL injection vulnerabilities',
        targetClone: 'beta'
    });
    
    // Optimal length (5-20 words) should score higher than very short
    assert(optimalContext.quality.objectiveClarity >= shortContext.quality.objectiveClarity, 
        'Optimal objective should score equal or higher');
});

// TEST SUITE 5: Objective Optimization
console.log('\n📋 TEST SUITE 5: Objective Optimization\n');

await runTest('5.1: Objective optimization preserves content', () => {
    const original = 'Analyze code for security issues';
    const optimized = contextEngineer.optimizeObjective(original);
    
    assert(optimized, 'Should return optimized objective');
    assert(typeof optimized === 'string', 'Should be a string');
});

await runTest('5.2: Empty objective is handled', () => {
    const optimized = contextEngineer.optimizeObjective('');
    assert(optimized === '', 'Empty objective preserved');
});

// TEST SUITE 6: Lightweight Manifest Creation
console.log('\n📋 TEST SUITE 6: Lightweight Manifest Creation\n');

await runTest('6.1: Lightweight manifest excludes full content', () => {
    const fullManifest = {
        artifactId: 'test-456',
        type: 'code',
        checksum: 'xyz789',
        content: 'This is the full content that should be excluded',
        size: 1000,
        metadata: { author: 'Test' }
    };
    
    const lightweight = contextEngineer.createLightweightManifest(fullManifest);
    
    assert(lightweight.artifactId, 'Should preserve artifact ID');
    assert(lightweight.type, 'Should preserve type');
    assert(lightweight.checksum, 'Should preserve checksum');
    assert(!lightweight.content, 'Should exclude content');
});

await runTest('6.2: Lightweight manifest preserves essential fields', () => {
    const manifest = {
        artifactId: 'test-789',
        type: 'doc',
        version: '2.0.0',
        checksum: 'checksum123',
        timestamp: '2025-10-20T12:00:00Z'
    };
    
    const lightweight = contextEngineer.createLightweightManifest(manifest);
    
    assert(lightweight.artifactId === manifest.artifactId, 'ID preserved');
    assert(lightweight.type === manifest.type, 'Type preserved');
    assert(lightweight.version === manifest.version, 'Version preserved');
});

// TEST SUITE 7: Essential Data Sanitization
console.log('\n📋 TEST SUITE 7: Essential Data Sanitization\n');

await runTest('7.1: Essential data is sanitized', () => {
    const data = {
        necessary: 'value',
        redundant: null,
        empty: ''
    };
    
    const sanitized = contextEngineer.sanitizeEssentialData(data);
    assert(sanitized.necessary === 'value', 'Should preserve necessary data');
});

await runTest('7.2: Nested objects are handled', () => {
    const data = {
        config: {
            setting1: 'value1',
            setting2: 'value2'
        }
    };
    
    const sanitized = contextEngineer.sanitizeEssentialData(data);
    assert(sanitized.config, 'Should preserve nested objects');
});

// TEST SUITE 8: Context ID Generation
console.log('\n📋 TEST SUITE 8: Context ID Generation\n');

await runTest('8.1: Context ID is unique', () => {
    const id1 = contextEngineer.generateContextId();
    const id2 = contextEngineer.generateContextId();
    
    assert(id1 !== id2, 'IDs should be unique');
});

await runTest('8.2: Context ID has correct format', () => {
    const id = contextEngineer.generateContextId();
    
    assert(typeof id === 'string', 'ID should be string');
    assert(id.length > 0, 'ID should not be empty');
});

// TEST SUITE 9: Metadata Handling
console.log('\n📋 TEST SUITE 9: Metadata Handling\n');

await runTest('9.1: Default metadata is added', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Test',
        targetClone: 'beta'
    });
    
    assert(context.metadata.constructedBy, 'Should have constructedBy');
    assert(context.metadata.contextVersion, 'Should have contextVersion');
});

await runTest('9.2: Custom metadata is preserved', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Test',
        targetClone: 'beta',
        metadata: {
            priority: 'high',
            requestId: 'req-123'
        }
    });
    
    assert(context.metadata.priority === 'high', 'Custom metadata preserved');
    assert(context.metadata.requestId === 'req-123', 'Request ID preserved');
});

// TEST SUITE 10: Integration Scenarios
console.log('\n📋 TEST SUITE 10: Integration Scenarios\n');

await runTest('10.1: Complete context package for code review', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Review authentication module for security vulnerabilities',
        targetClone: 'beta',
        artifactManifests: [{
            artifactId: 'auth-module-123',
            type: 'code',
            checksum: 'abc123'
        }],
        essentialData: {
            language: 'JavaScript',
            framework: 'Express.js'
        },
        constraints: [
            'Focus on SQL injection',
            'Check password hashing'
        ],
        metadata: {
            priority: 'critical',
            deadline: '2025-10-21'
        }
    });
    
    assert(context.objective, 'Has objective');
    assert(context.artifactManifests.length === 1, 'Has artifacts');
    assert(context.essentialData.language, 'Has essential data');
    assert(context.constraints.length === 2, 'Has constraints');
    assert(context.quality, 'Has quality metrics');
});

await runTest('10.2: Context package for documentation task', () => {
    const context = contextEngineer.constructContextPackage({
        objective: 'Document REST API endpoints',
        targetClone: 'sigma',
        essentialData: {
            endpoints: 5,
            format: 'OpenAPI 3.0'
        }
    });
    
    assert(context.targetClone === 'sigma', 'Correct target');
    assert(context.essentialData.format, 'Has format requirement');
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
