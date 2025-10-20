import { randomUUID } from 'crypto';
import { createHash } from 'crypto';
import { mkdir, writeFile, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Artifact Manager - Centralized version-controlled artifact storage
 * Implements Directive 2025.10.08-A1: Artifact-Centric Workflow
 * 
 * Manages discrete work products (artifacts) with metadata manifests
 * Authored by: Beatrice, Director of the Forbidden Library
 */
class ArtifactManager {
    constructor(workspacePath = '/tmp/sanctuary-workspace') {
        this.workspacePath = workspacePath;
        this.artifactsPath = join(workspacePath, 'artifacts');
        this.manifestsPath = join(workspacePath, 'manifests');
        this.initialized = false;
    }

    /**
     * Initialize the workspace directory structure
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Create workspace directories
            await mkdir(this.artifactsPath, { recursive: true });
            await mkdir(this.manifestsPath, { recursive: true });
            this.initialized = true;
            console.log('🗄️ Artifact workspace initialized at:', this.workspacePath);
        } catch (error) {
            console.error('Failed to initialize artifact workspace:', error.message);
            throw error;
        }
    }

    /**
     * Calculate checksum for data integrity verification
     * @param {string|Buffer} data - The data to checksum
     * @returns {string} SHA-256 checksum
     */
    calculateChecksum(data) {
        return createHash('sha256').update(data).digest('hex');
    }

    /**
     * Store an artifact with automatic manifest generation
     * @param {string} artifactType - Type of artifact (e.g., 'code', 'documentation', 'schema')
     * @param {string|Object} content - The artifact content
     * @param {Object} metadata - Additional metadata
     * @returns {Object} Artifact manifest
     */
    async storeArtifact(artifactType, content, metadata = {}) {
        await this.initialize();

        // Generate unique identifier
        const artifactId = randomUUID();
        const version = metadata.version || '1.0.0';
        const timestamp = new Date().toISOString();

        // Convert content to string if object
        const artifactContent = typeof content === 'object' 
            ? JSON.stringify(content, null, 2)
            : content;

        // Calculate checksum
        const checksum = this.calculateChecksum(artifactContent);

        // Store artifact file
        const artifactFileName = `${artifactId}.${artifactType}`;
        const artifactPath = join(this.artifactsPath, artifactFileName);
        await writeFile(artifactPath, artifactContent, 'utf8');

        // Get file stats
        const stats = await stat(artifactPath);

        // Create artifact manifest
        const manifest = {
            artifactId,
            type: artifactType,
            version,
            checksum,
            timestamp,
            location: {
                uri: `file://${artifactPath}`,
                relativePath: `artifacts/${artifactFileName}`,
                fileName: artifactFileName
            },
            size: stats.size,
            metadata: {
                ...metadata,
                createdBy: metadata.createdBy || 'Digital Sanctuary Network',
                description: metadata.description || `${artifactType} artifact`
            }
        };

        // Store manifest
        const manifestPath = join(this.manifestsPath, `${artifactId}.manifest.json`);
        await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

        console.log(`📦 Artifact stored: ${artifactId} (${artifactType})`);
        
        return manifest;
    }

    /**
     * Retrieve an artifact by its ID
     * @param {string} artifactId - The artifact identifier
     * @returns {Object} { manifest, content }
     */
    async retrieveArtifact(artifactId) {
        await this.initialize();

        // Load manifest
        const manifestPath = join(this.manifestsPath, `${artifactId}.manifest.json`);
        
        if (!existsSync(manifestPath)) {
            throw new Error(`Artifact not found: ${artifactId}`);
        }

        const manifestContent = await readFile(manifestPath, 'utf8');
        const manifest = JSON.parse(manifestContent);

        // Load artifact content
        const artifactPath = join(this.workspacePath, manifest.location.relativePath);
        const content = await readFile(artifactPath, 'utf8');

        // Verify checksum
        const currentChecksum = this.calculateChecksum(content);
        if (currentChecksum !== manifest.checksum) {
            console.warn(`⚠️ Checksum mismatch for artifact ${artifactId}`);
        }

        return {
            manifest,
            content
        };
    }

    /**
     * Get artifact manifest without loading full content
     * @param {string} artifactId - The artifact identifier
     * @returns {Object} Artifact manifest
     */
    async getManifest(artifactId) {
        await this.initialize();

        const manifestPath = join(this.manifestsPath, `${artifactId}.manifest.json`);
        
        if (!existsSync(manifestPath)) {
            throw new Error(`Manifest not found for artifact: ${artifactId}`);
        }

        const manifestContent = await readFile(manifestPath, 'utf8');
        return JSON.parse(manifestContent);
    }

    /**
     * Update an artifact, creating a new version
     * @param {string} artifactId - The original artifact identifier
     * @param {string|Object} newContent - Updated content
     * @param {Object} metadata - Additional metadata
     * @returns {Object} New artifact manifest
     */
    async updateArtifact(artifactId, newContent, metadata = {}) {
        // Get original manifest for type and version info
        const originalManifest = await this.getManifest(artifactId);
        
        // Increment version
        const versionParts = originalManifest.version.split('.');
        versionParts[versionParts.length - 1] = String(parseInt(versionParts[versionParts.length - 1]) + 1);
        const newVersion = versionParts.join('.');

        // Store as new artifact with updated version
        return await this.storeArtifact(
            originalManifest.type,
            newContent,
            {
                ...metadata,
                version: newVersion,
                previousVersion: artifactId,
                updatedFrom: originalManifest.version
            }
        );
    }

    /**
     * Create a lightweight artifact reference for communication
     * @param {string} artifactId - The artifact identifier
     * @returns {Object} Lightweight manifest for inter-clone communication
     */
    async createArtifactReference(artifactId) {
        const manifest = await this.getManifest(artifactId);
        
        return {
            artifactId: manifest.artifactId,
            type: manifest.type,
            version: manifest.version,
            checksum: manifest.checksum,
            location: manifest.location,
            timestamp: manifest.timestamp
        };
    }

    /**
     * List all artifacts, optionally filtered by type
     * @param {Object} options - Filter options { type: string }
     * @returns {Array} List of artifact manifests
     */
    async listArtifacts(options = {}) {
        await this.initialize();
        
        const { readdirSync } = await import('fs');
        const manifestFiles = readdirSync(this.manifestsPath).filter(f => f.endsWith('.manifest.json'));
        
        const manifests = [];
        for (const file of manifestFiles) {
            const manifestPath = join(this.manifestsPath, file);
            const content = await readFile(manifestPath, 'utf8');
            const manifest = JSON.parse(content);
            
            // Apply type filter if specified
            if (!options.type || manifest.type === options.type) {
                manifests.push(manifest);
            }
        }
        
        return manifests;
    }

    /**
     * List all versions of an artifact
     * @param {string} artifactId - The artifact identifier
     * @returns {Array} List of versions
     */
    async listVersions(artifactId) {
        const artifacts = await this.listArtifacts();
        const versions = artifacts.filter(a => 
            a.artifactId === artifactId || a.metadata.previousVersion === artifactId
        );
        
        return versions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
}

export default ArtifactManager;
