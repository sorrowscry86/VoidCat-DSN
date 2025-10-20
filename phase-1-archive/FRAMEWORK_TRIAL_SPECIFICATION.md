# Directive #DSN-2025.10.19-AFT: Agent Framework Trial Specification
## VoidCat RDC – Forbidden Library

**Directive Authority**: Beatrice, Director of the Forbidden Library  
**Trial Overseer**: Ryuzu  
**Date**: October 19, 2025  
**Status**: Specification Phase

---

## I. Executive Summary

This document specifies the comparative trial between **Microsoft AutoGen** and **CrewAI** to determine the superior framework for the Digital Sanctuary Network's hierarchical, multi-agent architecture. Both frameworks will be evaluated through identical micro-swarm implementations.

---

## II. Comparative Analysis Summary

### AutoGen (Microsoft)
**Primary Characteristics**:
- **Architecture**: Agent-oriented with explicit orchestration patterns
- **Orchestration Model**: Highly configurable through GraphFlow, AgentTool patterns, and RoutedAgent
- **Hierarchical Support**: Native support via `OrchestratorAgent` pattern with explicit worker delegation
- **Control Level**: Deterministic - explicit handoff mechanisms and message routing
- **Code Structure**: Sequential and parallel execution with DiGraphBuilder for explicit workflow definition
- **Tool Integration**: Via `AgentTool` wrapper, direct method binding, MCP server support
- **State Management**: Explicit message-based state with `MessageContext`, supports long-running tasks
- **Error Handling**: Built-in retry loops, exception handling in core patterns
- **Deployment**: Docker-native, standard Express.js patterns familiar to DSN

**Key Strengths**:
- Explicit control over agent delegation flow
- Native graph-based workflow definition (DiGraphBuilder)
- Robust multi-layer orchestration capabilities
- Clear message filtering and routing mechanisms
- Distributed architecture support via SingleThreadedAgentRuntime

**Key Concerns**:
- Requires explicit orchestration code vs declarative specification
- Multiple competing patterns (GraphFlow, SelectorGroupChat, RoundRobinGroupChat)
- Learning curve for distributed runtime patterns

---

### CrewAI
**Primary Characteristics**:
- **Architecture**: Task-centric with role-playing agents
- **Orchestration Model**: Via Process.hierarchical with manager coordination
- **Hierarchical Support**: Manager agent delegates tasks to specialists
- **Control Level**: Conversational - manager uses LLM-based decision making for delegation
- **Code Structure**: Sequential or hierarchical task execution with explicit task context passing
- **Tool Integration**: Via tools list on Agent, SerperDevTool and enterprise tools available
- **State Management**: Implicit through task context and agent memory
- **Error Handling**: Basic error handling, fewer explicit recovery patterns
- **Deployment**: Python-native, YAML configuration support, enterprise CLI tools

**Key Strengths**:
- Clean, intuitive role-based agent definition
- Excellent for hierarchical task delegation via manager agent
- Strong structured output support (Pydantic models)
- Excellent YAML configuration support
- Built-in enterprise tools and integrations

**Key Concerns**:
- Less explicit control - manager uses LLM for routing decisions
- Fewer patterns for complex deterministic workflows
- Limited distributed runtime capabilities
- May waste tokens on conversational orchestration overhead

---

## III. Micro-Swarm Prototype Specification

### Test Case Mission
**Objective**: "Research the key differences between Microsoft's AutoGen and CrewAI, and write a three-bullet summary on which to choose for a hierarchical agent system."

### Hierarchical Structure

#### 1. **Orchestrator Agent (Omega-Lite)**
- **Role**: Central commander receiving the main objective
- **Responsibilities**:
  - Receive the research mission
  - Formulate a plan
  - Delegate research task to Researcher
  - Delegate writing task to Writer
  - Validate output before completion
- **Process**: Sequential - Researcher THEN Writer
- **Communication**: Direct, explicit control over task sequence

#### 2. **Researcher Agent (Beta-Lite)**
- **Role**: Specialist with web search capability
- **Responsibilities**:
  - Accept research task from Orchestrator
  - Use web search tool to gather information
  - Compile findings for Writer
  - Report back only to Orchestrator
- **Tools**: Web search API (SerperDevTool equivalent)
- **Constraints**: Receives instructions only from Orchestrator, no independent delegation

#### 3. **Writer Agent (Gamma-Lite)**
- **Role**: Specialist for formatting and reporting
- **Responsibilities**:
  - Accept raw data from Orchestrator
  - Format into three-bullet summary
  - Apply final review/polish
  - Return final report to Orchestrator
- **Output Format**: Structured three-bullet markdown summary
- **Constraints**: Processes data provided by Orchestrator, formats for delivery

### Implementation Requirements

#### AutoGen Implementation
**Framework Pattern**: OrchestratorAgent + Worker Agents with explicit delegation

```
Components Required:
- OrchestratorAgent (RoutedAgent subclass)
- ResearcherAgent (AssistantAgent with web search tool)
- WriterAgent (AssistantAgent)
- SingleThreadedAgentRuntime for orchestration
- Explicit message handling for task delegation
- Web search tool via MCP or direct integration
```

**Key Architectural Decisions**:
- Use RoutedAgent for explicit control flow
- Define message protocols for orchestrator → researcher/writer
- Use AgentTool to wrap tools into explicit function calls
- Implement error handling with retry loops
- Log all orchestration decisions

#### CrewAI Implementation
**Framework Pattern**: Hierarchical Crew with Manager Agent coordination

```
Components Required:
- Manager Agent (Orchestrator role)
- Researcher Agent (with allow_delegation=False)
- Writer Agent (with allow_delegation=False)
- Crew with Process.hierarchical
- Tasks defined with explicit context passing
- SerperDevTool or equivalent for research
```

**Key Architectural Decisions**:
- Define manager role with explicit orchestration goal
- Use Task context=[previous_task] for sequential execution
- Leverage Pydantic models for output structure
- Minimize manager conversational overhead
- Validate structured outputs

---

## IV. Evaluation Scorecard

### Criterion 1: Architectural Alignment
**Assessment**: Does the framework naturally support our top-down, hierarchical DSN command structure?

**Scoring**:
- **AutoGen**: 9/10 - Native orchestrator pattern, explicit delegation, clear hierarchical control
- **CrewAI**: 7/10 - Manager pattern works well, but more conversational than deterministic

**Evidence Required**:
- Implementation demonstrates clear command hierarchy
- Orchestrator maintains control throughout execution
- Worker agents have no cross-communication

---

### Criterion 2: Orchestration Control
**Assessment**: Does the framework allow for deterministic, explicit control over workflow, or is it chaotic and conversational?

**Scoring**:
- **AutoGen**: 9/10 - Explicit message routing, GraphFlow, deterministic handoffs
- **CrewAI**: 6/10 - Manager uses LLM reasoning for routing decisions

**Evidence Required**:
- Task sequence follows exactly as programmed
- No unexpected routing or conversational detours
- Explicit logging of orchestration decisions
- Reproducible execution

---

### Criterion 3: API & Tool Integration
**Assessment**: How easily can the framework integrate custom provider-agnostic API layer and other tools?

**Scoring**:
- **AutoGen**: 8/10 - MCP server support, tool wrapping, direct method binding
- **CrewAI**: 8/10 - Strong tool integration, SerperDevTool pattern, enterprise tools

**Evidence Required**:
- Web search tool successfully integrated
- Tool outputs correctly parsed and passed
- Custom tool patterns would work similarly
- No framework-specific API wrapping required

---

### Criterion 4: State & Error Handling
**Assessment**: How robust is the framework in managing long-running tasks and recovering from failures?

**Scoring**:
- **AutoGen**: 8/10 - Explicit message context, cancellation tokens, retry patterns
- **CrewAI**: 6/10 - Task state implicit, limited error recovery patterns

**Evidence Required**:
- Graceful handling of tool failures (e.g., search API timeout)
- State maintained across task boundaries
- Recovery without data loss
- Clear error messages and logging

---

### Criterion 5: Deployment Complexity
**Assessment**: How much effort is required to containerize the prototype using Docker?

**Scoring**:
- **AutoGen**: 7/10 - Python-based, standard requirements, familiar patterns
- **CrewAI**: 7/10 - Python-based, similar Docker patterns

**Evidence Required**:
- Dockerfile builds successfully
- Container runs without modification of code
- All dependencies properly included
- Easy to scale horizontally

---

## V. Implementation Timeline

**Phase 1: Setup** (2 hours)
- Install AutoGen and CrewAI frameworks
- Configure API keys for web search
- Set up development environments

**Phase 2: AutoGen Implementation** (4-6 hours)
- Implement OrchestratorAgent
- Build ResearcherAgent with web search
- Build WriterAgent with formatting
- Integration testing

**Phase 3: CrewAI Implementation** (4-6 hours)
- Implement hierarchical Crew
- Define Manager, Researcher, Writer agents
- Configure Process.hierarchical
- Integration testing

**Phase 4: Comparative Testing** (2 hours)
- Execute identical test case on both
- Collect performance metrics
- Document orchestration decisions
- Compare output quality

**Phase 5: Evaluation & Reporting** (2-3 hours)
- Score both frameworks on 5 criteria
- Compile evidence for each criterion
- Draft recommendation report
- Present findings to Beatrice and Wykeve

---

## VI. Success Criteria

### For Trial Completion
1. ✓ Both prototypes successfully execute the research mission
2. ✓ Each prototype produces a three-bullet summary
3. ✓ Orchestrator maintains control throughout execution
4. ✓ All tool integrations function correctly
5. ✓ Both frameworks containerized and deployable

### For Recommendation
1. ✓ One framework scores 8+ on 3 or more criteria
2. ✓ Clear evidence supporting winner selection
3. ✓ Trade-offs between frameworks documented
4. ✓ DSN integration strategy outlined for winner

---

## VII. Documentation Requirements

**Deliverables**:
1. AutoGen Implementation Code (documented)
2. CrewAI Implementation Code (documented)
3. Test Execution Log (both frameworks)
4. Scorecard with Evidence (5 criteria × 2 frameworks)
5. Recommendation Report (for Beatrice & Wykeve)

---

**Specification Prepared By**: Ryuzu, Lead Assistant  
**Authority**: Beatrice, Director of the Forbidden Library  
**Status**: Ready for Implementation Phase
