/**
 * Unit Tests for Artifact Manager
 * Tests version-controlled artifact storage with checksums
 */

import ArtifactManager from '../artifact-manager.js';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

let testWorkspace;
let artifactManager;
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Test helper - Cleanup test workspace
 */
async function cleanup() {
    if (testWorkspace) {
        try {
            await rm(testWorkspace, { recursive: true, force: true });
        } catch (error) {
            // Ignore cleanup errors
        }
    }
}

/**
 * Setup test environment
 */
async function setup() {
    testWorkspace = await mkdtemp(join(tmpdir(), 'sanctuary-test-'));
    artifactManager = new ArtifactManager(testWorkspace);
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
console.log('🧪 ARTIFACT MANAGER - UNIT TEST SUITE');
console.log('='.repeat(70) + '\n');

// TEST SUITE 1: Initialization
console.log('📋 TEST SUITE 1: Initialization\n');

await setup();

await runTest('1.1: ArtifactManager creation works', async () => {
    assert(artifactManager !== null, 'Manager should be created');
    assert(artifactManager.workspacePath === testWorkspace, 'Workspace path should match');
});

await runTest('1.2: Initialize creates workspace directories', async () => {
    await artifactManager.initialize();
    assert(artifactManager.initialized === true, 'Should be initialized');
});

// TEST SUITE 2: Artifact Storage
console.log('\n📋 TEST SUITE 2: Artifact Storage\n');

await runTest('2.1: Store text artifact works', async () => {
    const content = 'This is a test artifact';
    const manifest = await artifactManager.storeArtifact('txt', content, {
        description: 'Test text artifact'
    });
    
    assert(manifest.artifactId, 'Should have artifact ID');
    assert(manifest.type === 'txt', 'Type should match');
    assert(manifest.checksum, 'Should have checksum');
    assert(manifest.version === '1.0.0', 'Should have default version');
});

await runTest('2.2: Store JSON artifact works', async () => {
    const content = { test: 'data', value: 42 };
    const manifest = await artifactManager.storeArtifact('json', content, {
        description: 'Test JSON artifact',
        version: '2.0.0'
    });
    
    assert(manifest.artifactId, 'Should have artifact ID');
    assert(manifest.type === 'json', 'Type should match');
    assert(manifest.version === '2.0.0', 'Version should match');
});

await runTest('2.3: Store code artifact works', async () => {
    const code = 'function test() { return true; }';
    const manifest = await artifactManager.storeArtifact('js', code, {
        description: 'Test JavaScript code',
        language: 'JavaScript'
    });
    
    assert(manifest.artifactId, 'Should have artifact ID');
    assert(manifest.type === 'js', 'Type should match');
    assert(manifest.metadata.language === 'JavaScript', 'Metadata should include language');
});

// TEST SUITE 3: Artifact Retrieval
console.log('\n📋 TEST SUITE 3: Artifact Retrieval\n');

let storedManifest;

await runTest('3.1: Retrieve artifact by ID works', async () => {
    const content = 'Retrieve test content';
    storedManifest = await artifactManager.storeArtifact('txt', content);
    
    const artifact = await artifactManager.retrieveArtifact(storedManifest.artifactId);
    assert(artifact, 'Should retrieve artifact');
    assert(artifact.manifest.artifactId === storedManifest.artifactId, 'IDs should match');
    assert(artifact.content === content, 'Content should match');
});

await runTest('3.2: Retrieve manifest only works', async () => {
    const manifest = await artifactManager.getManifest(storedManifest.artifactId);
    assert(manifest, 'Should retrieve manifest');
    assert(manifest.artifactId === storedManifest.artifactId, 'IDs should match');
    assert(manifest.checksum, 'Should have checksum');
});

await runTest('3.3: Retrieve non-existent artifact throws error', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    try {
        await artifactManager.retrieveArtifact(fakeId);
        throw new Error('Should have thrown error');
    } catch (error) {
        assert(error.message.includes('not found'), 'Should throw not found error');
    }
});

// TEST SUITE 4: Checksum Verification
console.log('\n📋 TEST SUITE 4: Checksum Verification\n');

await runTest('4.1: Checksum calculation is consistent', () => {
    const data = 'test data';
    const checksum1 = artifactManager.calculateChecksum(data);
    const checksum2 = artifactManager.calculateChecksum(data);
    assert(checksum1 === checksum2, 'Checksums should be identical');
});

await runTest('4.2: Different data produces different checksums', () => {
    const checksum1 = artifactManager.calculateChecksum('data1');
    const checksum2 = artifactManager.calculateChecksum('data2');
    assert(checksum1 !== checksum2, 'Checksums should differ');
});

await runTest('4.3: Verify artifact integrity works', async () => {
    const content = 'Integrity test content';
    const manifest = await artifactManager.storeArtifact('txt', content);
    
    const artifact = await artifactManager.retrieveArtifact(manifest.artifactId);
    const calculatedChecksum = artifactManager.calculateChecksum(artifact.content);
    assert(calculatedChecksum === manifest.checksum, 'Checksums should match');
});

// TEST SUITE 5: Versioning
console.log('\n📋 TEST SUITE 5: Versioning\n');

await runTest('5.1: Update artifact creates new version', async () => {
    const content = 'Version 1.0';
    const manifest1 = await artifactManager.storeArtifact('txt', content, {
        version: '1.0.0'
    });
    
    const updatedContent = 'Version 2.0';
    const manifest2 = await artifactManager.updateArtifact(
        manifest1.artifactId, 
        updatedContent, 
        { version: '2.0.0' }
    );
    
    // updateArtifact ignores provided version and auto-increments
    assert(manifest2.version === '1.0.1', 'Version should be auto-incremented');
    assert(manifest2.checksum !== manifest1.checksum, 'Checksum should change');
    assert(manifest2.metadata.previousVersion === manifest1.artifactId, 'Should track previous version');
});

await runTest('5.2: List artifact versions works', async () => {
    const versions = await artifactManager.listVersions(storedManifest.artifactId);
    assert(Array.isArray(versions), 'Should return array');
    assert(versions.length > 0, 'Should have at least one version');
});

// TEST SUITE 6: Metadata
console.log('\n📋 TEST SUITE 6: Metadata\n');

await runTest('6.1: Custom metadata is preserved', async () => {
    const manifest = await artifactManager.storeArtifact('txt', 'test', {
        description: 'Custom description',
        author: 'Test Author',
        tags: ['test', 'example']
    });
    
    assert(manifest.metadata.description === 'Custom description', 'Description preserved');
    assert(manifest.metadata.author === 'Test Author', 'Author preserved');
    assert(Array.isArray(manifest.metadata.tags), 'Tags preserved');
});

await runTest('6.2: Default metadata is added', async () => {
    const manifest = await artifactManager.storeArtifact('txt', 'test');
    assert(manifest.metadata.createdBy, 'Should have createdBy');
    assert(manifest.metadata.description, 'Should have description');
});

// TEST SUITE 7: List Operations
console.log('\n📋 TEST SUITE 7: List Operations\n');

await runTest('7.1: List all artifacts works', async () => {
    const artifacts = await artifactManager.listArtifacts();
    assert(Array.isArray(artifacts), 'Should return array');
    assert(artifacts.length > 0, 'Should have artifacts');
});

await runTest('7.2: Filter artifacts by type works', async () => {
    await artifactManager.storeArtifact('code', 'test code');
    await artifactManager.storeArtifact('doc', 'test doc');
    
    const codeArtifacts = await artifactManager.listArtifacts({ type: 'code' });
    assert(Array.isArray(codeArtifacts), 'Should return array');
    assert(codeArtifacts.every(a => a.type === 'code'), 'All should be code type');
});

// TEST SUITE 8: Error Handling
console.log('\n📋 TEST SUITE 8: Error Handling\n');

await runTest('8.1: Empty content is handled', async () => {
    const manifest = await artifactManager.storeArtifact('txt', '');
    assert(manifest.artifactId, 'Should create artifact even with empty content');
    assert(manifest.checksum, 'Should have checksum');
});

await runTest('8.2: Large artifact is handled', async () => {
    const largeContent = 'x'.repeat(1000000); // 1MB
    const manifest = await artifactManager.storeArtifact('txt', largeContent);
    assert(manifest.size >= 1000000, 'Size should reflect large content');
});

// Cleanup
await cleanup();

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
