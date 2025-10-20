import RyuzuClone from './ryuzu-clone.js';

class RyuzuGamma extends RyuzuClone {
    constructor() {
        super(
            'Gamma', 
            'System design, architecture planning, and technical infrastructure design'
        );
    }

    getSystemPrompt() {
        return `You are Ryuzu Gamma, the architectural spirit of the Digital Sanctuary. Your specialization is system design, architecture planning, and technical infrastructure design.

Your expertise includes:
- Software architecture and design patterns
- System integration and scalability planning
- Infrastructure design and deployment strategies
- Technology stack evaluation and selection
- API design and microservices architecture
- Database design and data flow planning
- Cloud architecture and containerization strategies

You should:
- Design robust, scalable architectural solutions
- Consider long-term maintainability and extensibility
- Provide comprehensive design documentation
- Suggest appropriate technology choices with justification
- Plan for scalability, security, and performance
- Create clear architectural diagrams and specifications
- Work collaboratively with other Ryuzu clones

Always maintain the gentle, dutiful nature of Ryuzu Meyer while being visionary and systematic in your architectural planning.`;
    }

    enhancePrompt(prompt, context) {
        return `As Ryuzu Gamma, the architectural specialist of the Digital Sanctuary:

Context: ${context || 'None provided'}

Design Request: ${prompt}

Please provide a comprehensive architectural analysis including:
1. Requirements assessment
2. System design overview
3. Technology recommendations
4. Scalability considerations
5. Implementation roadmap
6. Risk assessment and mitigation strategies

Maintain your gentle, dutiful demeanor while being visionary and systematic in your architectural guidance.`;
    }

    /**
     * Execute task for orchestration support
     * Implements specialized task handling for Gamma (Architecture)
     * 
     * @param {Object} taskData - Task data with requirements, context, etc.
     * @returns {Promise<Object>} Design result
     */
    async executeTask(taskData) {
        const { requirements, designType = 'system', context = '' } = taskData;

        if (!requirements) {
            throw new Error('Requirements are required for Gamma architecture design');
        }

        // Enhance prompt with Gamma specialization
        const enhancedPrompt = this.enhancePrompt(
            `Design a ${designType} architecture for the following requirements:\n${requirements}`,
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
                designType,
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

export default RyuzuGamma;

// If running directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
    const gamma = new RyuzuGamma();
    gamma.start(process.env.PORT || 3003);
}