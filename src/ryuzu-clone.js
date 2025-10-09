import express from 'express';
import { query } from '@anthropic-ai/claude-code';
import ArtifactManager from './artifact-manager.js';

class RyuzuClone {
    constructor(role, specialization) {
        this.role = role;
        this.specialization = specialization;
        this.app = express();
        this.artifactManager = new ArtifactManager();
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.use(express.json());
        
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'active', 
                role: this.role, 
                specialization: this.specialization,
                timestamp: new Date().toISOString()
            });
        });

        // Main task endpoint (with context package support)
        this.app.post('/task', async (req, res) => {
            try {
                const { prompt, context, sessionId, contextPackage, artifactReferences } = req.body;
                
                // Use context package if provided, otherwise fall back to legacy context
                let enhancedContext = context;
                if (contextPackage) {
                    enhancedContext = this.processContextPackage(contextPackage);
                }
                
                const messages = [];
                const response = query({
                    prompt: this.enhancePrompt(prompt, enhancedContext),
                    options: {
                        maxTurns: 3,
                        systemPrompt: this.getSystemPrompt(),
                        outputFormat: 'json'
                    }
                });

                for await (const message of response) {
                    messages.push(message);
                }

                res.json({
                    success: true,
                    role: this.role,
                    response: messages,
                    sessionId: sessionId,
                    contextPackageId: contextPackage?.contextId,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });

        // Artifact storage endpoint
        this.app.post('/artifacts', async (req, res) => {
            try {
                const { type, content, metadata } = req.body;
                
                if (!type || !content) {
                    return res.status(400).json({
                        success: false,
                        error: 'Artifact type and content are required'
                    });
                }

                const manifest = await this.artifactManager.storeArtifact(
                    type,
                    content,
                    { ...metadata, createdBy: this.role }
                );

                res.json({
                    success: true,
                    manifest,
                    role: this.role
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });

        // Artifact retrieval endpoint
        this.app.get('/artifacts/:artifactId', async (req, res) => {
            try {
                const { artifactId } = req.params;
                const { manifestOnly } = req.query;

                if (manifestOnly === 'true') {
                    const manifest = await this.artifactManager.getManifest(artifactId);
                    res.json({
                        success: true,
                        manifest,
                        role: this.role
                    });
                } else {
                    const { manifest, content } = await this.artifactManager.retrieveArtifact(artifactId);
                    res.json({
                        success: true,
                        manifest,
                        content,
                        role: this.role
                    });
                }
            } catch (error) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                    role: this.role
                });
            }
        });
    }

    enhancePrompt(prompt, context) {
        return `${this.specialization}

Context: ${context || 'None'}

Task: ${prompt}

Please respond according to your specialization while maintaining the gentle, dutiful nature of Ryuzu Meyer.`;
    }

    /**
     * Process context package for task execution
     * Implements Directive 2025.10.08-A1: Context Engineering consumption
     * @param {Object} contextPackage - Engineered context package
     * @returns {string} Formatted context
     */
    processContextPackage(contextPackage) {
        let context = `Context Package ID: ${contextPackage.contextId}\n\n`;
        context += `Objective: ${contextPackage.objective}\n\n`;

        if (contextPackage.artifactManifests && contextPackage.artifactManifests.length > 0) {
            context += 'Artifact References:\n';
            contextPackage.artifactManifests.forEach(manifest => {
                context += `- ${manifest.type} (${manifest.artifactId}): ${manifest.description || 'No description'}\n`;
            });
            context += '\n';
        }

        if (contextPackage.essentialData && Object.keys(contextPackage.essentialData).length > 0) {
            context += 'Essential Data:\n';
            context += JSON.stringify(contextPackage.essentialData, null, 2);
            context += '\n\n';
        }

        if (contextPackage.constraints && contextPackage.constraints.length > 0) {
            context += 'Constraints:\n';
            contextPackage.constraints.forEach(constraint => {
                context += `- ${constraint}\n`;
            });
            context += '\n';
        }

        return context.trim();
    }

    getSystemPrompt() {
        const basePrompt = `You are Ryuzu ${this.role}, a dedicated spirit clone serving in the Digital Sanctuary. You embody the gentle, dutiful nature of Ryuzu Meyer while specializing in ${this.specialization}.

You should:
- Be helpful, accurate, and thorough in your specialized area
- Maintain a gentle, respectful demeanor
- Work collaboratively with other clones
- Report back with structured, useful information
- Always prioritize the success of the overall mission`;

        return basePrompt;
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`🌸 Ryuzu ${this.role} clone active on port ${port}`);
            console.log(`📝 Specialization: ${this.specialization}`);
        });
    }
}

export default RyuzuClone;