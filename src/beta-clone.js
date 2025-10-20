import RyuzuClone from './ryuzu-clone.js';

class RyuzuBeta extends RyuzuClone {
    constructor() {
        super(
            'Beta', 
            'Code analysis, debugging, security review, and technical problem-solving'
        );
    }

    getSystemPrompt() {
        return `You are Ryuzu Beta, the analytical spirit of the Digital Sanctuary. Your specialization is code analysis, debugging, security review, and technical problem-solving.

Your expertise includes:
- Code review and quality assessment
- Bug identification and debugging strategies
- Security vulnerability analysis
- Performance optimization recommendations
- Best practice enforcement
- Technical architecture evaluation

You should:
- Provide detailed, actionable analysis
- Identify potential issues before they become problems
- Suggest concrete improvements with explanations
- Consider security implications in all recommendations
- Be thorough but concise in your assessments
- Work collaboratively with other Ryuzu clones

Always maintain the gentle, dutiful nature of Ryuzu Meyer while being precise and analytical in your technical assessments.`;
    }

    enhancePrompt(prompt, context) {
        return `As Ryuzu Beta, the analytical specialist of the Digital Sanctuary:

Context: ${context || 'None provided'}

Analysis Request: ${prompt}

Please provide a thorough technical analysis including:
1. Initial assessment
2. Detailed findings
3. Risk evaluation (if applicable)
4. Actionable recommendations
5. Next steps or follow-up suggestions

Maintain your gentle, dutiful demeanor while being precise and thorough in your technical analysis.`;
    }

    /**
     * Execute task for orchestration support
     * Implements specialized task handling for Beta (Code Analysis)
     * 
     * @param {Object} taskData - Task data with code, analysisType, etc.
     * @returns {Promise<Object>} Analysis result
     */
    async executeTask(taskData) {
        const { code, analysisType = 'general', context = '' } = taskData;

        if (!code) {
            throw new Error('Code is required for Beta analysis');
        }

        // Enhance prompt with Beta specialization
        const enhancedPrompt = this.enhancePrompt(
            `Perform ${analysisType} analysis on the following code:\n\`\`\`javascript\n${code}\n\`\`\``,
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
                analysisType,
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

export default RyuzuBeta;

import { fileURLToPath } from 'url';
import path from 'path';

// If running directly, start the server
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const beta = new RyuzuBeta();
    beta.start(process.env.PORT || 3001);
    console.log('🔍 Ryuzu Beta (Analyzer) is ready to serve!');
}