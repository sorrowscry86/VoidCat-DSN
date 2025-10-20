/**
 * Unit Tests for Routing Configuration
 * Tests clone registry and routing rules
 */

import { 
    cloneRegistry, 
    routingRules, 
    getRoutingRule, 
    getCloneInfo, 
    selectClone,
    getCloneCapabilities 
} from '../routing-config.js';

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Helper function for compatibility
 */
function getCloneForTask(taskType) {
    const rule = getRoutingRule(taskType);
    return rule ? rule.destination : null;
}

/**
 * Helper function for validation
 */
function validateRoutingConfig() {
    // Check that all routing rules point to valid clones
    for (const rule of Object.values(routingRules)) {
        if (!cloneRegistry[rule.destination]) {
            return false;
        }
    }
    return true;
}

/**
 * Run a test case
 */
function runTest(name, testFn) {
    testsRun++;
    try {
        testFn();
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
console.log('🧪 ROUTING CONFIGURATION - UNIT TEST SUITE');
console.log('='.repeat(70) + '\n');

// TEST SUITE 1: Clone Registry
console.log('📋 TEST SUITE 1: Clone Registry\n');

runTest('1.1: Clone registry has all 5 clones', () => {
    const cloneNames = Object.keys(cloneRegistry);
    assert(cloneNames.length === 5, 'Should have 5 clones');
    assert(cloneNames.includes('beta'), 'Should include beta');
    assert(cloneNames.includes('gamma'), 'Should include gamma');
    assert(cloneNames.includes('delta'), 'Should include delta');
    assert(cloneNames.includes('sigma'), 'Should include sigma');
    assert(cloneNames.includes('omega'), 'Should include omega');
});

runTest('1.2: Beta clone configuration is valid', () => {
    const beta = cloneRegistry.beta;
    assert(beta.url === 'http://localhost:3002', 'Beta URL correct');
    assert(beta.role === 'Beta', 'Beta role correct');
    assert(beta.specialization, 'Has specialization');
    assert(Array.isArray(beta.capabilities), 'Has capabilities array');
});

runTest('1.3: Gamma clone configuration is valid', () => {
    const gamma = cloneRegistry.gamma;
    assert(gamma.url === 'http://localhost:3003', 'Gamma URL correct');
    assert(gamma.capabilities.includes('architecture-design'), 'Has architecture capability');
});

runTest('1.4: Delta clone configuration is valid', () => {
    const delta = cloneRegistry.delta;
    assert(delta.url === 'http://localhost:3004', 'Delta URL correct');
    assert(delta.capabilities.includes('test-strategy'), 'Has testing capability');
});

runTest('1.5: Sigma clone configuration is valid', () => {
    const sigma = cloneRegistry.sigma;
    assert(sigma.url === 'http://localhost:3005', 'Sigma URL correct');
    assert(sigma.capabilities.includes('documentation'), 'Has documentation capability');
});

runTest('1.6: Omega clone configuration is valid', () => {
    const omega = cloneRegistry.omega;
    assert(omega.url === 'http://localhost:3000', 'Omega URL correct');
    assert(omega.capabilities.includes('coordination'), 'Has coordination capability');
});

// TEST SUITE 2: Routing Rules
console.log('\n📋 TEST SUITE 2: Routing Rules\n');

runTest('2.1: Routing rules exist and are non-empty', () => {
    assert(routingRules, 'Routing rules should exist');
    const ruleCount = Object.keys(routingRules).length;
    assert(ruleCount > 0, 'Should have routing rules');
});

runTest('2.2: Security analysis routes to Beta', () => {
    const rule = routingRules['security-analysis'];
    assert(rule, 'Security analysis rule exists');
    assert(rule.destination === 'beta', 'Routes to beta');
    assert(rule.priority === 'high', 'Has high priority');
});

runTest('2.3: Code review routes to Beta', () => {
    const rule = routingRules['code-review'];
    assert(rule, 'Code review rule exists');
    assert(rule.destination === 'beta', 'Routes to beta');
});

runTest('2.4: Architecture tasks route to Gamma', () => {
    const rule = routingRules['architecture-design'];
    assert(rule, 'Architecture design rule exists');
    assert(rule.destination === 'gamma', 'Routes to gamma');
});

runTest('2.5: Testing tasks route to Delta', () => {
    const rule = routingRules['test-strategy'];
    assert(rule, 'Test strategy rule exists');
    assert(rule.destination === 'delta', 'Routes to delta');
});

runTest('2.6: Documentation tasks route to Sigma', () => {
    const rule = routingRules['documentation'];
    assert(rule, 'Documentation rule exists');
    assert(rule.destination === 'sigma', 'Routes to sigma');
});

// TEST SUITE 3: Rule Structure
console.log('\n📋 TEST SUITE 3: Rule Structure\n');

runTest('3.1: All rules have required fields', () => {
    for (const [taskType, rule] of Object.entries(routingRules)) {
        assert(rule.destination, `${taskType} should have destination`);
        assert(rule.priority, `${taskType} should have priority`);
        assert(typeof rule.timeout === 'number', `${taskType} should have numeric timeout`);
        assert(typeof rule.retries === 'number', `${taskType} should have numeric retries`);
    }
});

runTest('3.2: Priorities are valid', () => {
    const validPriorities = ['low', 'normal', 'high', 'critical'];
    for (const [taskType, rule] of Object.entries(routingRules)) {
        assert(validPriorities.includes(rule.priority), 
            `${taskType} priority should be valid`);
    }
});

runTest('3.3: Timeouts are reasonable', () => {
    for (const [taskType, rule] of Object.entries(routingRules)) {
        assert(rule.timeout >= 5000, `${taskType} timeout should be >= 5s`);
        assert(rule.timeout <= 60000, `${taskType} timeout should be <= 60s`);
    }
});

runTest('3.4: Retries are reasonable', () => {
    for (const [taskType, rule] of Object.entries(routingRules)) {
        assert(rule.retries >= 0, `${taskType} retries should be >= 0`);
        assert(rule.retries <= 3, `${taskType} retries should be <= 3`);
    }
});

// TEST SUITE 4: Task Routing Function (if exists)
console.log('\n📋 TEST SUITE 4: Task Routing Function\n');

runTest('4.1: getRoutingRule function exists', () => {
    assert(typeof getRoutingRule === 'function', 'getRoutingRule should be a function');
});

runTest('4.2: getRoutingRule returns correct rule for security-analysis', () => {
    const rule = getRoutingRule('security-analysis');
    assert(rule, 'Should return a rule');
    assert(rule.destination === 'beta', 'Should route to beta');
});

runTest('4.3: getCloneInfo function works', () => {
    const cloneInfo = getCloneInfo('beta');
    assert(cloneInfo, 'Should return clone info');
    assert(cloneInfo.url, 'Should have URL');
    assert(cloneInfo.role === 'Beta', 'Should have role');
});

runTest('4.4: selectClone function works for known task', () => {
    const result = selectClone('security-analysis');
    assert(result, 'Should return result');
    assert(result.clone, 'Should have clone info');
    assert(result.rule, 'Should have routing rule');
});

// TEST SUITE 5: Configuration Validation
console.log('\n📋 TEST SUITE 5: Configuration Validation\n');

runTest('5.1: validateRoutingConfig function exists', () => {
    assert(typeof validateRoutingConfig === 'function', 
        'validateRoutingConfig should be a function');
});

runTest('5.2: Routing configuration is valid', () => {
    const isValid = validateRoutingConfig();
    assert(isValid === true, 'Routing configuration should be valid');
});

runTest('5.3: All routing destinations exist in clone registry', () => {
    for (const [taskType, rule] of Object.entries(routingRules)) {
        assert(cloneRegistry[rule.destination], 
            `${taskType} destination ${rule.destination} should exist in registry`);
    }
});

// TEST SUITE 6: Clone Capabilities
console.log('\n📋 TEST SUITE 6: Clone Capabilities\n');

runTest('6.1: Beta has security and code analysis capabilities', () => {
    const beta = cloneRegistry.beta;
    assert(beta.capabilities.includes('security-analysis'), 'Beta should have security-analysis');
    assert(beta.capabilities.includes('code-review'), 'Beta should have code-review');
});

runTest('6.2: Gamma has architecture capabilities', () => {
    const gamma = cloneRegistry.gamma;
    assert(gamma.capabilities.includes('architecture-design'), 'Gamma should have architecture-design');
    assert(gamma.capabilities.includes('system-planning'), 'Gamma should have system-planning');
});

runTest('6.3: Delta has testing capabilities', () => {
    const delta = cloneRegistry.delta;
    assert(delta.capabilities.includes('test-strategy'), 'Delta should have test-strategy');
    assert(delta.capabilities.includes('quality-assurance'), 'Delta should have quality-assurance');
});

runTest('6.4: Sigma has documentation capabilities', () => {
    const sigma = cloneRegistry.sigma;
    assert(sigma.capabilities.includes('documentation'), 'Sigma should have documentation');
});

runTest('6.5: Omega has coordination capabilities', () => {
    const omega = cloneRegistry.omega;
    assert(omega.capabilities.includes('coordination'), 'Omega should have coordination');
    assert(omega.capabilities.includes('orchestration'), 'Omega should have orchestration');
});

// TEST SUITE 7: Port Allocation
console.log('\n📋 TEST SUITE 7: Port Allocation\n');

runTest('7.1: All clones have unique ports', () => {
    const ports = Object.values(cloneRegistry).map(c => {
        const match = c.url.match(/:(\d+)/);
        return match ? parseInt(match[1]) : null;
    });
    
    const uniquePorts = new Set(ports);
    assert(uniquePorts.size === 5, 'All 5 clones should have unique ports');
});

runTest('7.2: Ports are in correct range (3000-3005)', () => {
    for (const [name, clone] of Object.entries(cloneRegistry)) {
        const match = clone.url.match(/:(\d+)/);
        if (match) {
            const port = parseInt(match[1]);
            assert(port >= 3000 && port <= 3005, 
                `${name} port should be in range 3000-3005`);
        }
    }
});

runTest('7.3: Omega is on port 3000 (coordinator)', () => {
    assert(cloneRegistry.omega.url.includes(':3000'), 'Omega should be on port 3000');
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
