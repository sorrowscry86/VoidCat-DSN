/**
 * Context Engineer - Formalized context package construction
 * Implements Directive 2025.10.08-A1: Context Engineering Principles
 * 
 * Constructs minimal, high-relevance context packages for specialist agents
 * Maximizes signal-to-noise ratio in inter-agent communication
 * Authored by: Beatrice, Director of the Forbidden Library
 */
class ContextEngineer {
    constructor() {
        this.contextSchema = {
            objective: 'string',
            artifactManifests: 'array',
            essentialData: 'object',
            constraints: 'array',
            targetClone: 'string'
        };
    }

    /**
     * Construct a minimal, high-relevance context package
     * @param {Object} params - Context construction parameters
     * @param {string} params.objective - Clear, concise task objective
     * @param {string} params.targetClone - Target specialist clone
     * @param {Array} params.artifactManifests - Artifact references (not full content)
     * @param {Object} params.essentialData - Only necessary data for task completion
     * @param {Array} params.constraints - Any constraints or requirements
     * @param {Object} params.metadata - Additional metadata
     * @returns {Object} Engineered context package
     */
    constructContextPackage({
        objective,
        targetClone,
        artifactManifests = [],
        essentialData = {},
        constraints = [],
        metadata = {}
    }) {
        // Validate required fields
        if (!objective || !targetClone) {
            throw new Error('Context package requires objective and targetClone');
        }

        // Construct the context package
        const contextPackage = {
            contextId: this.generateContextId(),
            timestamp: new Date().toISOString(),
            
            // Core context components
            objective: this.optimizeObjective(objective),
            targetClone,
            
            // Artifact references (lightweight manifests only)
            artifactManifests: artifactManifests.map(manifest => 
                this.createLightweightManifest(manifest)
            ),
            
            // Essential data only (signal maximization)
            essentialData: this.sanitizeEssentialData(essentialData),
            
            // Constraints and requirements
            constraints,
            
            // Metadata
            metadata: {
                ...metadata,
                constructedBy: metadata.constructedBy || 'Omega Coordinator',
                contextVersion: '1.0.0'
            },
            
            // Context quality metrics
            quality: this.assessContextQuality({
                objective,
                artifactManifests,
                essentialData,
                constraints
            })
        };

        return contextPackage;
    }

    /**
     * Generate a unique context identifier
     * @returns {string} Context ID
     */
    generateContextId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `ctx-${timestamp}-${random}`;
    }

    /**
     * Optimize objective for clarity and conciseness
     * @param {string} objective - Raw objective
     * @returns {string} Optimized objective
     */
    optimizeObjective(objective) {
        // Trim whitespace and ensure single-line format for clarity
        let optimized = objective.trim().replace(/\s+/g, ' ');
        
        // Ensure objective starts with action verb when possible
        const actionVerbs = ['analyze', 'design', 'implement', 'test', 'document', 'review', 'create', 'update', 'validate'];
        const startsWithAction = actionVerbs.some(verb => 
            optimized.toLowerCase().startsWith(verb)
        );
        
        if (!startsWithAction && !optimized.match(/^[A-Z]/)) {
            // Capitalize first letter if not action verb
            optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);
        }
        
        return optimized;
    }

    /**
     * Create lightweight manifest reference (no full content)
     * @param {Object} manifest - Full artifact manifest
     * @returns {Object} Lightweight manifest
     */
    createLightweightManifest(manifest) {
        if (!manifest.artifactId) {
            throw new Error('Invalid manifest: missing artifactId');
        }

        return {
            artifactId: manifest.artifactId,
            type: manifest.type,
            version: manifest.version,
            checksum: manifest.checksum,
            location: manifest.location,
            description: manifest.metadata?.description || 'Artifact reference'
        };
    }

    /**
     * Sanitize essential data to remove noise
     * @param {Object} data - Raw data object
     * @returns {Object} Sanitized data
     */
    sanitizeEssentialData(data) {
        // Remove null, undefined, and empty values
        const sanitized = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined && value !== '') {
                // For arrays, remove empty items
                if (Array.isArray(value)) {
                    const cleanArray = value.filter(item => 
                        item !== null && item !== undefined && item !== ''
                    );
                    if (cleanArray.length > 0) {
                        sanitized[key] = cleanArray;
                    }
                }
                // For objects, recursively sanitize
                else if (typeof value === 'object' && !Array.isArray(value)) {
                    const cleanObj = this.sanitizeEssentialData(value);
                    if (Object.keys(cleanObj).length > 0) {
                        sanitized[key] = cleanObj;
                    }
                }
                // For primitives, include as-is
                else {
                    sanitized[key] = value;
                }
            }
        }
        
        return sanitized;
    }

    /**
     * Assess context package quality (signal-to-noise ratio)
     * @param {Object} components - Context components
     * @returns {Object} Quality assessment
     */
    assessContextQuality(components) {
        const metrics = {
            objectiveClarity: 0,
            dataRelevance: 0,
            artifactUtilization: 0,
            overallQuality: 0
        };

        // Objective clarity (0-100)
        if (components.objective) {
            const wordCount = components.objective.split(/\s+/).length;
            // Optimal: 5-20 words
            if (wordCount >= 5 && wordCount <= 20) {
                metrics.objectiveClarity = 100;
            } else if (wordCount < 5) {
                metrics.objectiveClarity = Math.max(0, wordCount * 20);
            } else {
                metrics.objectiveClarity = Math.max(0, 100 - (wordCount - 20) * 2);
            }
        }

        // Data relevance (0-100)
        // Fewer fields = higher signal-to-noise
        const dataFieldCount = Object.keys(components.essentialData || {}).length;
        if (dataFieldCount === 0) {
            metrics.dataRelevance = 50; // Neutral if no data
        } else if (dataFieldCount <= 5) {
            metrics.dataRelevance = 100;
        } else {
            metrics.dataRelevance = Math.max(0, 100 - (dataFieldCount - 5) * 5);
        }

        // Artifact utilization (0-100)
        const artifactCount = (components.artifactManifests || []).length;
        if (artifactCount === 0) {
            metrics.artifactUtilization = 100; // Valid to have no artifacts
        } else if (artifactCount <= 3) {
            metrics.artifactUtilization = 100;
        } else {
            metrics.artifactUtilization = Math.max(50, 100 - (artifactCount - 3) * 10);
        }

        // Overall quality score
        metrics.overallQuality = Math.round(
            (metrics.objectiveClarity + metrics.dataRelevance + metrics.artifactUtilization) / 3
        );

        return metrics;
    }

    /**
     * Validate a context package against schema
     * @param {Object} contextPackage - Context package to validate
     * @returns {Object} { valid: boolean, errors: Array }
     */
    validateContextPackage(contextPackage) {
        const errors = [];

        // Required fields
        if (!contextPackage.objective) {
            errors.push('Missing required field: objective');
        }
        if (!contextPackage.targetClone) {
            errors.push('Missing required field: targetClone');
        }

        // Type validation
        if (contextPackage.artifactManifests && !Array.isArray(contextPackage.artifactManifests)) {
            errors.push('artifactManifests must be an array');
        }
        if (contextPackage.essentialData && typeof contextPackage.essentialData !== 'object') {
            errors.push('essentialData must be an object');
        }
        if (contextPackage.constraints && !Array.isArray(contextPackage.constraints)) {
            errors.push('constraints must be an array');
        }

        // Quality thresholds
        if (contextPackage.quality && contextPackage.quality.overallQuality < 60) {
            errors.push(`Low context quality score: ${contextPackage.quality.overallQuality}/100`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Extract context package for clone consumption
     * Formats the context for use in clone's enhancePrompt method
     * @param {Object} contextPackage - Engineered context package
     * @returns {string} Formatted context string
     */
    formatContextForClone(contextPackage) {
        let formatted = `Context Package (ID: ${contextPackage.contextId})\n\n`;
        
        formatted += `Objective: ${contextPackage.objective}\n\n`;

        if (contextPackage.artifactManifests.length > 0) {
            formatted += `Artifact References:\n`;
            contextPackage.artifactManifests.forEach(manifest => {
                formatted += `- ${manifest.type} (${manifest.artifactId}): ${manifest.description}\n`;
            });
            formatted += '\n';
        }

        if (Object.keys(contextPackage.essentialData).length > 0) {
            formatted += `Essential Data:\n`;
            formatted += JSON.stringify(contextPackage.essentialData, null, 2);
            formatted += '\n\n';
        }

        if (contextPackage.constraints.length > 0) {
            formatted += `Constraints:\n`;
            contextPackage.constraints.forEach(constraint => {
                formatted += `- ${constraint}\n`;
            });
        }

        return formatted.trim();
    }
}

export default ContextEngineer;
