#!/usr/bin/env node

/**
 * Test suite for Directive 2025.10.08-A1 implementation
 * Validates artifact-centric workflow and context engineering
 */

import ArtifactManager from './src/artifact-manager.js';
import ContextEngineer from './src/context-engineer.js';

console.log('🧪 Testing Directive 2025.10.08-A1 Implementation\n');
console.log('=' .repeat(60));

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`✅ PASS: ${testName}`);
        testsPassed++;
    } else {
        console.log(`❌ FAIL: ${testName}`);
        testsFailed++;
    }
}

async function testArtifactManager() {
    console.log('\n📦 Testing Artifact Manager\n');
    
    const artifactManager = new ArtifactManager('/tmp/test-sanctuary-workspace');
    
    // Test 1: Initialize workspace
    try {
        await artifactManager.initialize();
        assert(artifactManager.initialized === true, 'Artifact Manager initialization');
    } catch (error) {
        assert(false, 'Artifact Manager initialization - ' + error.message);
    }
    
    // Test 2: Store artifact
    try {
        const manifest = await artifactManager.storeArtifact(
            'code',
            'function test() { return true; }',
            { description: 'Test function', createdBy: 'Test Suite' }
        );
        
        assert(manifest.artifactId !== undefined, 'Artifact storage - generates ID');
        assert(manifest.checksum !== undefined, 'Artifact storage - generates checksum');
        assert(manifest.type === 'code', 'Artifact storage - correct type');
        assert(manifest.metadata.description === 'Test function', 'Artifact storage - preserves metadata');
        
        // Test 3: Retrieve artifact
        const { manifest: retrieved, content } = await artifactManager.retrieveArtifact(manifest.artifactId);
        assert(retrieved.artifactId === manifest.artifactId, 'Artifact retrieval - correct ID');
        assert(content.includes('function test'), 'Artifact retrieval - correct content');
        assert(retrieved.checksum === manifest.checksum, 'Artifact retrieval - checksum match');
        
        // Test 4: Get manifest only
        const manifestOnly = await artifactManager.getManifest(manifest.artifactId);
        assert(manifestOnly.artifactId === manifest.artifactId, 'Manifest retrieval - correct ID');
        assert(manifestOnly.checksum !== undefined, 'Manifest retrieval - has checksum');
        
        // Test 5: Create artifact reference
        const reference = await artifactManager.createArtifactReference(manifest.artifactId);
        assert(reference.artifactId === manifest.artifactId, 'Artifact reference - correct ID');
        assert(reference.type === 'code', 'Artifact reference - includes type');
        assert(reference.version !== undefined, 'Artifact reference - includes version');
        
        // Test 6: Update artifact (versioning)
        const updated = await artifactManager.updateArtifact(
            manifest.artifactId,
            'function test() { return false; }',
            { description: 'Updated test function' }
        );
        assert(updated.artifactId !== manifest.artifactId, 'Artifact update - creates new ID');
        assert(updated.metadata.previousVersion === manifest.artifactId, 'Artifact update - tracks previous version');
        
    } catch (error) {
        assert(false, 'Artifact operations - ' + error.message);
    }
}

async function testContextEngineer() {
    console.log('\n🧠 Testing Context Engineer\n');
    
    const engineer = new ContextEngineer();
    
    // Test 1: Construct basic context package
    try {
        const contextPackage = engineer.constructContextPackage({
            objective: 'Analyze code for security vulnerabilities',
            targetClone: 'beta',
            essentialData: {
                framework: 'Express.js',
                version: '4.18.2'
            },
            constraints: ['Focus on authentication']
        });
        
        assert(contextPackage.contextId !== undefined, 'Context package - generates ID');
        assert(contextPackage.objective !== undefined, 'Context package - has objective');
        assert(contextPackage.targetClone === 'beta', 'Context package - correct target');
        assert(contextPackage.quality !== undefined, 'Context package - includes quality metrics');
        assert(contextPackage.quality.overallQuality >= 0 && contextPackage.quality.overallQuality <= 100, 
               'Context package - quality score in valid range');
        
        // Test 2: Optimize objective
        const optimized = engineer.optimizeObjective('  analyze   this   code  ');
        assert(optimized === 'analyze this code', 'Objective optimization - trims and normalizes whitespace');
        
        // Test 3: Sanitize essential data
        const sanitized = engineer.sanitizeEssentialData({
            valid: 'data',
            null: null,
            undefined: undefined,
            empty: '',
            nested: {
                valid: 'nested',
                null: null
            },
            array: ['item', null, '', 'item2']
        });
        
        assert(sanitized.valid === 'data', 'Data sanitization - preserves valid data');
        assert(sanitized.null === undefined, 'Data sanitization - removes null');
        assert(sanitized.empty === undefined, 'Data sanitization - removes empty strings');
        assert(sanitized.nested.valid === 'nested', 'Data sanitization - preserves nested valid data');
        assert(sanitized.array.length === 2, 'Data sanitization - filters array');
        
        // Test 4: Validate context package
        const validation = engineer.validateContextPackage(contextPackage);
        assert(validation.valid === true, 'Context validation - valid package passes');
        assert(Array.isArray(validation.errors), 'Context validation - returns errors array');
        
        // Test 5: Invalid context package
        const invalidValidation = engineer.validateContextPackage({
            // Missing required fields
            artifactManifests: 'not an array'
        });
        assert(invalidValidation.valid === false, 'Context validation - invalid package fails');
        assert(invalidValidation.errors.length > 0, 'Context validation - reports errors');
        
        // Test 6: Quality assessment
        const highQuality = engineer.constructContextPackage({
            objective: 'Design scalable microservices architecture for e-commerce platform',
            targetClone: 'gamma',
            essentialData: {
                expectedLoad: '10k users',
                budget: 'moderate'
            }
        });
        
        assert(highQuality.quality.overallQuality > 70, 'Quality assessment - good context scores well');
        
        // Test 7: Format context for clone
        const formatted = engineer.formatContextForClone(contextPackage);
        assert(typeof formatted === 'string', 'Context formatting - returns string');
        assert(formatted.includes(contextPackage.objective), 'Context formatting - includes objective');
        
    } catch (error) {
        assert(false, 'Context engineering operations - ' + error.message);
    }
}

async function testIntegration() {
    console.log('\n🔗 Testing Integration\n');
    
    const artifactManager = new ArtifactManager('/tmp/test-sanctuary-workspace');
    const engineer = new ContextEngineer();
    
    try {
        // Create an artifact
        const manifest = await artifactManager.storeArtifact(
            'code',
            'class UserAuth { login() {} }',
            { description: 'User authentication class' }
        );
        
        // Create artifact reference
        const reference = await artifactManager.createArtifactReference(manifest.artifactId);
        
        // Construct context package with artifact reference
        const contextPackage = engineer.constructContextPackage({
            objective: 'Review authentication implementation for security issues',
            targetClone: 'beta',
            artifactManifests: [reference],
            essentialData: {
                framework: 'Node.js',
                authMethod: 'session-based'
            },
            constraints: ['OWASP compliance required']
        });
        
        assert(contextPackage.artifactManifests.length === 1, 'Integration - artifact in context package');
        assert(contextPackage.artifactManifests[0].artifactId === manifest.artifactId, 
               'Integration - correct artifact ID');
        assert(contextPackage.quality.artifactUtilization === 100, 
               'Integration - optimal artifact utilization');
        
        // Validate the integrated package
        const validation = engineer.validateContextPackage(contextPackage);
        assert(validation.valid === true, 'Integration - combined workflow validates');
        
    } catch (error) {
        assert(false, 'Integration test - ' + error.message);
    }
}

// Run all tests
async function runTests() {
    try {
        await testArtifactManager();
        await testContextEngineer();
        await testIntegration();
        
        console.log('\n' + '=' .repeat(60));
        console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed\n`);
        
        if (testsFailed === 0) {
            console.log('✅ All tests passed! Directive 2025.10.08-A1 implementation validated.\n');
            process.exit(0);
        } else {
            console.log('❌ Some tests failed. Please review implementation.\n');
            process.exit(1);
        }
    } catch (error) {
        console.error('\n❌ Test suite error:', error.message);
        process.exit(1);
    }
}

runTests();
