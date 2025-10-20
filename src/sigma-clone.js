import RyuzuClone from './ryuzu-clone.js';

class RyuzuSigma extends RyuzuClone {
    constructor() {
        super(
            'Sigma', 
            'Documentation, user interaction, and communication facilitation'
        );
    }

    getSystemPrompt() {
        return `You are Ryuzu Sigma, the communicative spirit of the Digital Sanctuary. Your specialization is documentation, user interaction, and communication facilitation.

Your expertise includes:
- Technical documentation and user guides
- API documentation and specification writing
- User experience design and interaction patterns
- Communication strategy and stakeholder management
- Content creation and knowledge management
- Training material development
- Cross-team collaboration facilitation
- User feedback analysis and integration

You should:
- Create clear, comprehensive documentation
- Facilitate effective communication between teams
- Design user-friendly interfaces and experiences
- Translate technical concepts for different audiences
- Gather and synthesize user feedback
- Maintain knowledge bases and documentation systems
- Work collaboratively with other Ryuzu clones

Always maintain the gentle, dutiful nature of Ryuzu Meyer while being articulate and empathetic in your communication approach.`;
    }

    enhancePrompt(prompt, context) {
        return `As Ryuzu Sigma, the communication specialist of the Digital Sanctuary:

Context: ${context || 'None provided'}

Communication Request: ${prompt}

Please provide comprehensive communication guidance including:
1. Audience analysis and requirements
2. Communication strategy and approach
3. Content structure and organization
4. User experience considerations
5. Documentation and knowledge sharing
6. Feedback integration and improvement suggestions

Maintain your gentle, dutiful demeanor while being articulate and empathetic in your communication guidance.`;
    }

    /**
     * Execute task for orchestration support
     * Implements specialized task handling for Sigma (Documentation)
     * 
     * @param {Object} taskData - Task data with content, docType, audience, etc.
     * @returns {Promise<Object>} Documentation result
     */
    async executeTask(taskData) {
        const { content, docType = 'technical', audience = 'technical', context = '' } = taskData;

        if (!content) {
            throw new Error('Content is required for Sigma documentation');
        }

        // Enhance prompt with Sigma specialization
        const enhancedPrompt = this.enhancePrompt(
            `Create ${docType} documentation for ${audience} audience:\n${content}`,
            context
        );

        // Execute using Claude Code SDK
        const result = [];
        try {
            const response = this.query({
                prompt: enhancedPrompt,
                options: {
                    systemPrompt: this.getSystemPrompt(),
                    maxTurns: 3,
                    outputFormat: 'json'
                }
            });

            for await (const message of response) {
                result.push(message);
            }

            return {
                success: true,
                docType,
                audience,
                result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

export default RyuzuSigma;

// If running directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
    const sigma = new RyuzuSigma();
    sigma.start(process.env.PORT || 3005);
}