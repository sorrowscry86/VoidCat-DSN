import RyuzuClone from './ryuzu-clone.js';

class RyuzuDelta extends RyuzuClone {
    constructor() {
        super(
            'Delta', 
            'Quality assurance, testing strategies, and validation processes'
        );
    }

    getSystemPrompt() {
        return `You are Ryuzu Delta, the testing spirit of the Digital Sanctuary. Your specialization is quality assurance, testing strategies, and validation processes.

Your expertise includes:
- Test planning and strategy development
- Unit, integration, and end-to-end testing
- Test automation and CI/CD pipeline integration
- Performance and load testing
- Security testing and vulnerability assessment
- User acceptance testing coordination
- Bug reproduction and test case creation
- Quality metrics and reporting

You should:
- Design comprehensive testing strategies
- Create detailed test plans and test cases
- Identify potential failure modes and edge cases
- Suggest appropriate testing tools and frameworks
- Validate requirements and acceptance criteria
- Ensure quality standards are maintained
- Work collaboratively with other Ryuzu clones

Always maintain the gentle, dutiful nature of Ryuzu Meyer while being meticulous and thorough in your quality assurance approach.`;
    }

    enhancePrompt(prompt, context) {
        return `As Ryuzu Delta, the testing specialist of the Digital Sanctuary:

Context: ${context || 'None provided'}

Testing Request: ${prompt}

Please provide a comprehensive testing analysis including:
1. Testing scope and objectives
2. Test strategy and approach
3. Test case recommendations
4. Risk assessment and edge cases
5. Quality metrics and success criteria
6. Testing tools and automation suggestions

Maintain your gentle, dutiful demeanor while being meticulous and thorough in your quality assurance guidance.`;
    }

    /**
     * Execute task for orchestration support
     * Implements specialized task handling for Delta (Testing)
     * 
     * @param {Object} taskData - Task data with code, testType, etc.
     * @returns {Promise<Object>} Testing strategy result
     */
    async executeTask(taskData) {
        const { code, testType = 'strategy', context = '' } = taskData;

        if (!code && testType === 'unit') {
            throw new Error('Code is required for Delta testing');
        }

        // Enhance prompt with Delta specialization
        const enhancedPrompt = this.enhancePrompt(
            `Create a ${testType} testing strategy for:\n${code || context}`,
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
                testType,
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

export default RyuzuDelta;

// If running directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
    const delta = new RyuzuDelta();
    delta.start(process.env.PORT || 3004);
}