import express from 'express';
import { query } from '@anthropic-ai/claude-code';

class RyuzuClone {
    constructor(role, specialization) {
        this.role = role;
        this.specialization = specialization;
        this.app = express();
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

        // Main task endpoint
        this.app.post('/task', async (req, res) => {
            try {
                const { prompt, context, sessionId } = req.body;
                
                const messages = [];
                const response = query({
                    prompt: this.enhancePrompt(prompt, context),
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
    }

    enhancePrompt(prompt, context) {
        return `${this.specialization}

Context: ${context || 'None'}

Task: ${prompt}

Please respond according to your specialization while maintaining the gentle, dutiful nature of Ryuzu Meyer.`;
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