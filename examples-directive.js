#!/usr/bin/env node

/**
 * Example usage of Directive 2025.10.08-A1 features
 * Demonstrates artifact-centric workflow and context engineering
 */

import fetch from 'node-fetch';

console.log('🌸 VoidCat DSN - Directive 2025.10.08-A1 Example Usage\n');
console.log('=' .repeat(70));

// Example 1: Store and retrieve an artifact
async function example1_ArtifactStorage() {
    console.log('\n📦 Example 1: Artifact Storage\n');
    
    const codeArtifact = {
        type: 'code',
        content: `
class UserAuthentication {
    async login(username, password) {
        // Authentication logic
        const user = await this.validateCredentials(username, password);
        if (user) {
            return this.createSession(user);
        }
        throw new Error('Invalid credentials');
    }
}`,
        metadata: {
            description: 'User authentication module',
            language: 'JavaScript',
            version: '1.0.0'
        }
    };
    
    // Store artifact via Beta clone
    const response = await fetch('http://localhost:3002/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(codeArtifact)
    });
    
    const result = await response.json();
    console.log('✅ Artifact stored:');
    console.log(`   Artifact ID: ${result.manifest.artifactId}`);
    console.log(`   Type: ${result.manifest.type}`);
    console.log(`   Checksum: ${result.manifest.checksum.substring(0, 16)}...`);
    console.log(`   Size: ${result.manifest.size} bytes`);
    
    return result.manifest.artifactId;
}

// Example 2: Context engineering for task delegation
async function example2_ContextEngineering() {
    console.log('\n🧠 Example 2: Context Engineering\n');
    
    const contextRequest = {
        objective: 'Analyze authentication code for security vulnerabilities',
        targetClone: 'beta',
        essentialData: {
            framework: 'Express.js',
            authMethod: 'session-based',
            criticalEndpoints: ['/login', '/logout', '/verify']
        },
        constraints: [
            'Focus on OWASP Top 10 vulnerabilities',
            'Consider session management security',
            'Check for SQL injection risks'
        ]
    };
    
    // Construct context package via Omega
    const response = await fetch('http://localhost:3000/context/engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextRequest)
    });
    
    const result = await response.json();
    console.log('✅ Context package constructed:');
    console.log(`   Context ID: ${result.contextPackage.contextId}`);
    console.log(`   Target Clone: ${result.contextPackage.targetClone}`);
    console.log(`   Quality Score: ${result.contextPackage.quality.overallQuality}/100`);
    console.log(`   - Objective Clarity: ${result.contextPackage.quality.objectiveClarity}/100`);
    console.log(`   - Data Relevance: ${result.contextPackage.quality.dataRelevance}/100`);
    console.log(`   Valid: ${result.validation.valid ? '✓' : '✗'}`);
    
    return result.contextPackage;
}

// Example 3: Orchestrated task delegation with artifacts
async function example3_OrchestrationWithArtifacts(artifactId) {
    console.log('\n🎯 Example 3: Orchestrated Task Delegation\n');
    
    // Get artifact manifest (lightweight reference)
    const manifestResponse = await fetch(
        `http://localhost:3002/artifacts/${artifactId}?manifestOnly=true`
    );
    const manifestResult = await manifestResponse.json();
    
    const orchestrationRequest = {
        objective: 'Review authentication implementation for OWASP compliance',
        targetClone: 'beta',
        artifactManifests: [
            {
                artifactId: manifestResult.manifest.artifactId,
                type: manifestResult.manifest.type,
                version: manifestResult.manifest.version,
                checksum: manifestResult.manifest.checksum,
                location: manifestResult.manifest.location
            }
        ],
        essentialData: {
            framework: 'Node.js + Express',
            complianceStandard: 'OWASP Top 10 2021'
        },
        constraints: ['Production-ready security assessment required'],
        sessionId: 'example-session-001'
    };
    
    // Use Omega's orchestration endpoint
    const response = await fetch('http://localhost:3000/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orchestrationRequest)
    });
    
    const result = await response.json();
    console.log('✅ Task orchestrated:');
    console.log(`   Orchestrator: ${result.orchestrator}`);
    console.log(`   Target Clone: ${result.targetClone}`);
    console.log(`   Context Quality: ${result.contextPackage.quality.overallQuality}/100`);
    console.log(`   Task Success: ${result.result.success ? '✓' : '✗'}`);
    console.log(`   Response Messages: ${result.result.response.length}`);
}

// Example 4: Legacy compatibility
async function example4_LegacyCompatibility() {
    console.log('\n🔄 Example 4: Legacy Compatibility\n');
    
    // Traditional task delegation still works
    const legacyRequest = {
        prompt: 'Design a scalable microservices architecture',
        context: 'E-commerce platform with high traffic requirements',
        sessionId: 'legacy-session'
    };
    
    const response = await fetch('http://localhost:3003/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(legacyRequest)
    });
    
    const result = await response.json();
    console.log('✅ Legacy task delegation:');
    console.log(`   Clone: ${result.role}`);
    console.log(`   Success: ${result.success ? '✓' : '✗'}`);
    console.log(`   Backward Compatible: ✓`);
}

// Example 5: Complete workflow
async function example5_CompleteWorkflow() {
    console.log('\n🔗 Example 5: Complete Artifact-Centric Workflow\n');
    
    // Step 1: Store initial code artifact
    const codeResponse = await fetch('http://localhost:3002/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'code',
            content: 'function processPayment(amount, cardToken) { /* ... */ }',
            metadata: {
                description: 'Payment processing function',
                module: 'payments'
            }
        })
    });
    const codeResult = await codeResponse.json();
    console.log(`1. Stored code artifact: ${codeResult.manifest.artifactId.substring(0, 8)}...`);
    
    // Step 2: Request architectural review from Gamma
    const archReview = await fetch('http://localhost:3000/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            objective: 'Design comprehensive payment processing architecture',
            targetClone: 'gamma',
            essentialData: {
                paymentMethods: ['credit card', 'PayPal', 'cryptocurrency'],
                scale: '10k transactions/day'
            }
        })
    });
    const archResult = await archReview.json();
    console.log(`2. Gamma architectural review: Quality ${archResult.contextPackage.quality.overallQuality}/100`);
    
    // Step 3: Store architecture document as artifact
    const archDoc = {
        type: 'documentation',
        content: JSON.stringify(archResult.result.response, null, 2),
        metadata: {
            description: 'Payment architecture design',
            generatedBy: 'Gamma',
            relatedArtifact: codeResult.manifest.artifactId
        }
    };
    const docResponse = await fetch('http://localhost:3005/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archDoc)
    });
    const docResult = await docResponse.json();
    console.log(`3. Stored architecture doc: ${docResult.manifest.artifactId.substring(0, 8)}...`);
    
    // Step 4: Request security review from Beta with both artifacts
    const securityReview = await fetch('http://localhost:3000/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            objective: 'Security audit of payment processing implementation',
            targetClone: 'beta',
            artifactManifests: [
                {
                    artifactId: codeResult.manifest.artifactId,
                    type: 'code',
                    version: codeResult.manifest.version,
                    checksum: codeResult.manifest.checksum,
                    location: codeResult.manifest.location
                },
                {
                    artifactId: docResult.manifest.artifactId,
                    type: 'documentation',
                    version: docResult.manifest.version,
                    checksum: docResult.manifest.checksum,
                    location: docResult.manifest.location
                }
            ],
            essentialData: {
                complianceRequired: 'PCI DSS',
                threatModel: 'payment fraud, data breach'
            }
        })
    });
    const securityResult = await securityReview.json();
    console.log(`4. Beta security review: Quality ${securityResult.contextPackage.quality.overallQuality}/100`);
    
    console.log('\n✅ Complete workflow demonstrates:');
    console.log('   - Artifact storage and versioning');
    console.log('   - Context engineering with quality metrics');
    console.log('   - Multi-clone orchestration');
    console.log('   - Artifact reference management');
    console.log('   - Lightweight manifest communication');
}

// Run examples
async function runExamples() {
    console.log('\n⚠️  Note: These examples require the Digital Sanctuary Network to be running.');
    console.log('    Start all clones with: ./scripts/deploy-all.sh\n');
    
    try {
        // Check if network is running
        const healthCheck = await fetch('http://localhost:3000/health');
        if (!healthCheck.ok) {
            throw new Error('Network not available');
        }
        
        // Run examples sequentially
        const artifactId = await example1_ArtifactStorage();
        await example2_ContextEngineering();
        await example3_OrchestrationWithArtifacts(artifactId);
        await example4_LegacyCompatibility();
        await example5_CompleteWorkflow();
        
        console.log('\n' + '=' .repeat(70));
        console.log('\n✅ All examples completed successfully!\n');
        
    } catch (error) {
        console.error('\n❌ Example execution failed:', error.message);
        console.log('\nPlease ensure the Digital Sanctuary Network is running:');
        console.log('  1. Deploy all clones: ./scripts/deploy-all.sh');
        console.log('  2. Check health: ./scripts/health-check.sh');
        console.log('  3. Re-run examples: node examples-directive.js\n');
        process.exit(1);
    }
}

// Uncomment to run examples (requires network to be running)
// runExamples();

console.log('\n📚 Example Usage Demonstrations Available:\n');
console.log('  1. Artifact Storage - Store and retrieve work products');
console.log('  2. Context Engineering - Construct optimized context packages');
console.log('  3. Orchestration - Delegate tasks with artifact references');
console.log('  4. Legacy Compatibility - Traditional task delegation');
console.log('  5. Complete Workflow - End-to-end artifact-centric process');
console.log('\nTo run examples, uncomment runExamples() and ensure network is running.\n');
