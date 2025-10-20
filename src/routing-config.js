/**
 * Clone Routing Configuration
 * 
 * Implements Phase 2: Intelligent task routing based on clone specialization
 * Maps task types to appropriate clones with priorities and timeouts
 * 
 * Routing Principles:
 * - Task type determines destination clone
 * - Priority affects execution order
 * - Timeout ensures responsiveness
 * - Retries handle transient failures
 * - Fallback ensures reliability
 */

/**
 * Clone Specialization Registry
 * Maps clone roles to their base URLs and capabilities
 */
export const cloneRegistry = {
    beta: {
        url: 'http://localhost:3002',
        role: 'Beta',
        specialization: 'Code analysis, security review, debugging',
        capabilities: ['security-analysis', 'code-review', 'debugging', 'performance-analysis']
    },
    gamma: {
        url: 'http://localhost:3003',
        role: 'Gamma',
        specialization: 'System architecture, design planning',
        capabilities: ['architecture-design', 'system-planning', 'technology-selection', 'scalability-analysis']
    },
    delta: {
        url: 'http://localhost:3004',
        role: 'Delta',
        specialization: 'Testing, quality assurance, validation',
        capabilities: ['test-strategy', 'quality-assurance', 'validation', 'test-automation']
    },
    sigma: {
        url: 'http://localhost:3005',
        role: 'Sigma',
        specialization: 'Documentation, communication, user interaction',
        capabilities: ['documentation', 'user-guides', 'communication', 'knowledge-management']
    },
    omega: {
        url: 'http://localhost:3000',
        role: 'Omega',
        specialization: 'Network coordination, orchestration',
        capabilities: ['coordination', 'orchestration', 'multi-clone-workflows', 'strategic-planning']
    }
};

/**
 * Task Type Routing Rules
 * Defines how different task types are routed to clones
 */
export const routingRules = {
    // Security and Code Analysis Tasks
    'security-analysis': {
        destination: 'beta',
        priority: 'high',
        timeout: 30000,
        retries: 2,
        description: 'Route security analysis tasks to Beta clone'
    },
    'code-review': {
        destination: 'beta',
        priority: 'normal',
        timeout: 25000,
        retries: 1,
        description: 'Route code review tasks to Beta clone'
    },
    'debugging': {
        destination: 'beta',
        priority: 'high',
        timeout: 30000,
        retries: 2,
        description: 'Route debugging tasks to Beta clone'
    },
    'performance-analysis': {
        destination: 'beta',
        priority: 'normal',
        timeout: 20000,
        retries: 1,
        description: 'Route performance analysis to Beta clone'
    },

    // Architecture and Design Tasks
    'architecture-design': {
        destination: 'gamma',
        priority: 'high',
        timeout: 45000,
        retries: 1,
        description: 'Route architecture design tasks to Gamma clone'
    },
    'system-planning': {
        destination: 'gamma',
        priority: 'normal',
        timeout: 30000,
        retries: 1,
        description: 'Route system planning to Gamma clone'
    },
    'technology-selection': {
        destination: 'gamma',
        priority: 'normal',
        timeout: 25000,
        retries: 1,
        description: 'Route technology selection to Gamma clone'
    },
    'scalability-analysis': {
        destination: 'gamma',
        priority: 'high',
        timeout: 30000,
        retries: 1,
        description: 'Route scalability analysis to Gamma clone'
    },

    // Testing and QA Tasks
    'test-strategy': {
        destination: 'delta',
        priority: 'normal',
        timeout: 25000,
        retries: 1,
        description: 'Route test strategy tasks to Delta clone'
    },
    'quality-assurance': {
        destination: 'delta',
        priority: 'high',
        timeout: 30000,
        retries: 2,
        description: 'Route QA tasks to Delta clone'
    },
    'validation': {
        destination: 'delta',
        priority: 'normal',
        timeout: 20000,
        retries: 1,
        description: 'Route validation tasks to Delta clone'
    },
    'test-automation': {
        destination: 'delta',
        priority: 'normal',
        timeout: 25000,
        retries: 1,
        description: 'Route test automation to Delta clone'
    },

    // Documentation and Communication Tasks
    'documentation': {
        destination: 'sigma',
        priority: 'normal',
        timeout: 25000,
        retries: 1,
        description: 'Route documentation tasks to Sigma clone'
    },
    'user-guides': {
        destination: 'sigma',
        priority: 'normal',
        timeout: 20000,
        retries: 1,
        description: 'Route user guide creation to Sigma clone'
    },
    'communication': {
        destination: 'sigma',
        priority: 'normal',
        timeout: 15000,
        retries: 1,
        description: 'Route communication tasks to Sigma clone'
    },
    'knowledge-management': {
        destination: 'sigma',
        priority: 'low',
        timeout: 20000,
        retries: 1,
        description: 'Route knowledge management to Sigma clone'
    },

    // Default/Generic Tasks
    'generic': {
        destination: 'omega',
        priority: 'normal',
        timeout: 20000,
        retries: 1,
        description: 'Route generic tasks to Omega for delegation'
    }
};

/**
 * Priority levels for task execution
 */
export const priorityLevels = {
    critical: 1,
    high: 2,
    normal: 3,
    low: 4
};

/**
 * Fallback strategies when primary clone is unavailable
 */
export const fallbackStrategies = {
    'security-analysis': ['omega'], // Escalate to Omega if Beta unavailable
    'code-review': ['omega'],
    'architecture-design': ['omega'],
    'test-strategy': ['omega'],
    'documentation': ['omega']
};

/**
 * Get routing rule for a task type
 * @param {string} taskType - Type of task to route
 * @returns {Object} Routing configuration or null if not found
 */
export function getRoutingRule(taskType) {
    return routingRules[taskType] || routingRules['generic'];
}

/**
 * Get clone information by role
 * @param {string} cloneRole - Clone role (beta, gamma, delta, sigma, omega)
 * @returns {Object} Clone configuration or null if not found
 */
export function getCloneInfo(cloneRole) {
    return cloneRegistry[cloneRole.toLowerCase()] || null;
}

/**
 * Get fallback clones for a task type
 * @param {string} taskType - Type of task
 * @returns {Array} Array of fallback clone roles
 */
export function getFallbackClones(taskType) {
    return fallbackStrategies[taskType] || ['omega'];
}

/**
 * Determine best clone for a task based on type and clone health
 * @param {string} taskType - Type of task
 * @param {Object} cloneHealthStatus - Map of clone roles to health status
 * @returns {Object} Selected clone info and routing rule
 */
export function selectClone(taskType, cloneHealthStatus = {}) {
    const rule = getRoutingRule(taskType);
    const primaryClone = rule.destination;
    
    // Check if primary clone is healthy
    if (cloneHealthStatus[primaryClone] === 'healthy' || !cloneHealthStatus[primaryClone]) {
        return {
            clone: getCloneInfo(primaryClone),
            rule: rule,
            isFallback: false
        };
    }

    // Try fallback clones
    const fallbacks = getFallbackClones(taskType);
    for (const fallbackRole of fallbacks) {
        if (cloneHealthStatus[fallbackRole] === 'healthy' || !cloneHealthStatus[fallbackRole]) {
            return {
                clone: getCloneInfo(fallbackRole),
                rule: rule,
                isFallback: true,
                fallbackReason: `Primary clone ${primaryClone} unavailable`
            };
        }
    }

    // No healthy clone available
    throw new Error(`No healthy clone available for task type: ${taskType}`);
}

/**
 * Get all task types supported by a clone
 * @param {string} cloneRole - Clone role
 * @returns {Array} Array of supported task types
 */
export function getCloneCapabilities(cloneRole) {
    const clone = getCloneInfo(cloneRole);
    return clone ? clone.capabilities : [];
}

export default {
    cloneRegistry,
    routingRules,
    priorityLevels,
    fallbackStrategies,
    getRoutingRule,
    getCloneInfo,
    getFallbackClones,
    selectClone,
    getCloneCapabilities
};
