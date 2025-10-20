"""
CrewAI Micro-Swarm Prototype: Hierarchical Framework Trial
VoidCat RDC – Forbidden Library – Directive #DSN-2025.10.19-AFT

Implementation of a 3-agent hierarchical swarm using CrewAI:
- Manager Agent (Orchestrator-Lite): Central coordination, task delegation
- Researcher Agent (Beta-Lite): Specialist with web search capability
- Writer Agent (Gamma-Lite): Formats output into deliverable

Test Mission: Research AutoGen vs CrewAI differences and provide three-bullet summary
"""

import asyncio
import json
import os
from datetime import datetime
from typing import Optional
from dataclasses import dataclass, asdict

# CrewAI imports
from crewai import Agent, Crew, Task, Process
from pydantic import BaseModel, Field

# External imports
import httpx


# ============================================================================
# Configuration & Constants
# ============================================================================

TRIAL_ID = "CREWAI_001"
TRIAL_TIMESTAMP = datetime.now().isoformat()
TEST_MISSION = "Research the key differences between Microsoft's AutoGen and CrewAI, and write a three-bullet summary on which to choose for a hierarchical agent system."

# Research data pool
RESEARCH_DATA = {
    "autogen_features": [
        "Explicit orchestration via GraphFlow and RoutedAgent patterns",
        "Native support for hierarchical agent delegation",
        "Deterministic workflow control with message filtering",
        "Multi-layer orchestration capabilities",
        "MCP server integration for tools",
        "Distributed runtime via SingleThreadedAgentRuntime",
    ],
    "crewai_features": [
        "Task-centric architecture with role-based agents",
        "Manager-coordinated hierarchical execution",
        "Conversational routing decisions via LLM",
        "Strong structured output (Pydantic) support",
        "YAML configuration support",
        "Enterprise tool integrations",
    ],
}


# ============================================================================
# Pydantic Models for Structured Output
# ============================================================================

class ResearchFindings(BaseModel):
    """Structured research findings"""
    autogen_summary: str = Field(description="Summary of AutoGen framework")
    crewai_summary: str = Field(description="Summary of CrewAI framework")
    key_differences: list = Field(description="Key differences between frameworks")


class ThreeBulletSummary(BaseModel):
    """Structured three-bullet summary"""
    bullet_one: str = Field(description="First recommendation bullet")
    bullet_two: str = Field(description="Second recommendation bullet")
    bullet_three: str = Field(description="Third recommendation bullet")
    recommendation: str = Field(description="Final recommendation text")


@dataclass
class TrialResult:
    """Final result of the trial"""
    trial_id: str
    timestamp: str
    mission: str
    three_bullet_summary: str
    execution_log: list


# ============================================================================
# Web Search Tool (Simulated)
# ============================================================================

def web_search_tool(query: str) -> str:
    """
    Simulated web search tool.
    In production, would call actual API (SerperDev, etc.)
    """
    print(f"[TOOL] Web Search: {query}")
    
    # Simulate search results based on query
    if "AutoGen" in query and "CrewAI" in query:
        results = f"""
        Search Results for: {query}
        
        1. AutoGen is Microsoft's framework emphasizing explicit orchestration patterns
           - Supports GraphFlow for deterministic workflows
           - Native hierarchical agent delegation
           - Message-based routing and control
        
        2. CrewAI is a task-centric framework with role-based agents
           - Manager coordinates task execution
           - LLM-based routing decisions
           - Strong structured output support
        
        3. Key Difference: AutoGen prioritizes deterministic control while 
           CrewAI emphasizes conversational collaboration patterns
        """
    elif "AutoGen" in query:
        results = "\n".join(RESEARCH_DATA["autogen_features"])
    elif "CrewAI" in query:
        results = "\n".join(RESEARCH_DATA["crewai_features"])
    else:
        results = "No relevant search results found"
    
    return results


# ============================================================================
# CrewAI Agent Definitions
# ============================================================================

def create_manager_agent() -> Agent:
    """Create manager agent for hierarchical coordination"""
    return Agent(
        role="Research Project Manager",
        goal="Efficiently coordinate research and writing tasks to deliver high-quality three-bullet summary on agent frameworks",
        backstory="""You are an experienced research coordinator at a leading technology think tank.
        Your role is to oversee the research and analysis of emerging frameworks.
        You coordinate with specialists to gather information and synthesize findings into clear recommendations.
        You ensure all tasks are completed with precision and the final output meets quality standards.""",
        allow_delegation=True,
        verbose=True,
    )


def create_researcher_agent() -> Agent:
    """Create researcher agent with web search capability"""
    return Agent(
        role="Framework Research Specialist",
        goal="Conduct thorough research on AutoGen and CrewAI frameworks, gathering comprehensive technical information",
        backstory="""You are a meticulous technical researcher specializing in AI agent frameworks.
        Your expertise is in finding reliable information, comparing technologies, and documenting findings.
        You have deep knowledge of both AutoGen and CrewAI and understand their architectural differences.
        You provide well-researched, factual summaries of technical capabilities.""",
        allow_delegation=False,
        verbose=True,
    )


def create_writer_agent() -> Agent:
    """Create writer agent for formatting deliverables"""
    return Agent(
        role="Technical Writer",
        goal="Transform research findings into clear, concise three-bullet recommendations on framework selection",
        backstory="""You are an expert technical writer skilled at synthesizing complex information into clear recommendations.
        You excel at creating compelling, well-structured content that guides decision-making.
        You have a talent for identifying key insights and presenting them in an actionable format.
        Your writing is always precise, professional, and tailored to the audience's needs.""",
        allow_delegation=False,
        verbose=True,
    )


# ============================================================================
# CrewAI Task Definitions
# ============================================================================

def create_research_task(researcher: Agent) -> Task:
    """Create research task"""
    return Task(
        description="""Conduct comprehensive research on Microsoft's AutoGen and CrewAI frameworks.
        
        Focus on:
        1. Orchestration models and hierarchical support
        2. Control mechanisms (deterministic vs conversational)
        3. API and tool integration capabilities
        4. State management and error handling
        5. Deployment complexity
        
        Use web search tools to gather current information about both frameworks.
        Compile your findings into a structured research summary.""",
        expected_output="Comprehensive research findings comparing AutoGen and CrewAI across key dimensions",
        agent=researcher,
    )


def create_writing_task(writer: Agent, context_task: Task) -> Task:
    """Create writing task with context from research"""
    return Task(
        description="""Based on the research findings provided, create a three-bullet summary 
        recommending which framework (AutoGen or CrewAI) is better suited for hierarchical agent systems.
        
        Each bullet should:
        1. Address a key difference between the frameworks
        2. Explain the implication for hierarchical systems
        3. Build toward a clear recommendation
        
        The summary should conclude with a definitive recommendation and rationale.
        Format the output as clear, professional bullet points.""",
        expected_output="Three clear bullet points with final recommendation on framework selection",
        agent=writer,
        context=[context_task],  # Get context from research task
    )


# ============================================================================
# Trial Execution
# ============================================================================

def run_crewai_trial() -> TrialResult:
    """Execute the CrewAI micro-swarm trial"""
    
    print("\n" + "="*80)
    print("CREWAI MICRO-SWARM TRIAL - EXECUTION START")
    print("="*80)
    print(f"Trial ID: {TRIAL_ID}")
    print(f"Timestamp: {TRIAL_TIMESTAMP}")
    print("="*80 + "\n")
    
    execution_log = []
    
    def log_event(message: str):
        """Log execution events"""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] {message}"
        execution_log.append(log_entry)
        print(log_entry)
    
    log_event(f"MISSION RECEIVED: {TEST_MISSION}")
    log_event(f"Trial ID: {TRIAL_ID}")
    
    # Create agents
    log_event("MANAGER: Creating agent team")
    manager = create_manager_agent()
    researcher = create_researcher_agent()
    writer = create_writer_agent()
    log_event("MANAGER: Agent team created")
    
    # Create tasks
    log_event("MANAGER: Defining tasks")
    research_task = create_research_task(researcher)
    writing_task = create_writing_task(writer, research_task)
    log_event("MANAGER: Tasks defined")
    
    # Create hierarchical crew
    log_event("MANAGER: Assembling hierarchical crew")
    crew = Crew(
        agents=[manager, researcher, writer],
        tasks=[research_task, writing_task],
        process=Process.hierarchical,
        manager_agent=manager,
        verbose=True,
    )
    log_event("MANAGER: Hierarchical crew assembled with manager coordination")
    
    # Execute crew
    log_event("MANAGER: Initiating task execution")
    result = crew.kickoff(inputs={"mission": TEST_MISSION})
    log_event("MANAGER: Task execution complete")
    
    # Extract final output
    final_output = str(result)
    log_event("MANAGER: Extracting and validating final output")
    
    print("\n" + "="*80)
    print("CREWAI MICRO-SWARM TRIAL - EXECUTION COMPLETE")
    print("="*80)
    print("\nFINAL OUTPUT:")
    print("-"*80)
    print(final_output)
    print("-"*80)
    
    # Create trial result
    trial_result = TrialResult(
        trial_id=TRIAL_ID,
        timestamp=TRIAL_TIMESTAMP,
        mission=TEST_MISSION,
        three_bullet_summary=final_output,
        execution_log=execution_log,
    )
    
    return trial_result


# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    """Main entry point"""
    try:
        result = run_crewai_trial()
        
        # Save results
        output_file = f"crewai_trial_result_{TRIAL_ID}.json"
        with open(output_file, "w") as f:
            json.dump({
                "trial_id": result.trial_id,
                "timestamp": result.timestamp,
                "mission": result.mission,
                "three_bullet_summary": result.three_bullet_summary,
                "execution_log": result.execution_log,
            }, f, indent=2)
        
        print(f"\n✓ Results saved to: {output_file}")
        
    except Exception as e:
        print(f"\n✗ Trial failed with error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
