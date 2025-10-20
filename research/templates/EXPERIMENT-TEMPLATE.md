# Experiment Configuration Template

Use this template to define standardized experiments for the research infrastructure.
Save as `EXP-###-NAME.json` in the `data/experiments/` directory.

## Example Configurations

### Baseline Performance Test
```json
{
  "experimentId": "EXP-001",
  "title": "Baseline Performance - Single Clone Health Checks",
  "objective": "Establish baseline response times for all 5 clones under normal conditions",
  "description": "Health check endpoints are hit 100 times per clone to establish baseline latency distribution",
  "methodology": "Sequential health checks, 100ms spacing between requests",
  "duration": "~120 seconds",
  "tasks": [
    {
      "clone": "beta",
      "endpoint": "/health",
      "method": "GET",
      "count": 100,
      "description": "Beta clone health checks"
    },
    {
      "clone": "gamma",
      "endpoint": "/health",
      "method": "GET",
      "count": 100,
      "description": "Gamma clone health checks"
    },
    {
      "clone": "delta",
      "endpoint": "/health",
      "method": "GET",
      "count": 100,
      "description": "Delta clone health checks"
    },
    {
      "clone": "sigma",
      "endpoint": "/health",
      "method": "GET",
      "count": 100,
      "description": "Sigma clone health checks"
    },
    {
      "clone": "omega",
      "endpoint": "/health",
      "method": "GET",
      "count": 100,
      "description": "Omega clone health checks"
    }
  ]
}
```

### Task Processing Load Test
```json
{
  "experimentId": "EXP-002",
  "title": "Task Processing Under Load",
  "objective": "Measure clone performance when processing concurrent task requests",
  "description": "Each clone receives multiple task requests to test response degradation under load",
  "methodology": "Concurrent task requests with varying payload sizes",
  "duration": "~180 seconds",
  "tasks": [
    {
      "clone": "beta",
      "endpoint": "/task",
      "method": "POST",
      "count": 50,
      "payload": {
        "prompt": "Analyze this code for vulnerabilities and performance issues",
        "context": "Production backend microservice handling payment processing"
      },
      "description": "Beta: Security analysis task"
    },
    {
      "clone": "gamma",
      "endpoint": "/task",
      "method": "POST",
      "count": 50,
      "payload": {
        "prompt": "Design scalable architecture for 1M concurrent users",
        "context": "Real-time collaboration platform with persistent connections"
      },
      "description": "Gamma: Architectural design task"
    },
    {
      "clone": "delta",
      "endpoint": "/task",
      "method": "POST",
      "count": 50,
      "payload": {
        "prompt": "Develop comprehensive testing strategy",
        "context": "Distributed system with microservices and event streaming"
      },
      "description": "Delta: Testing strategy task"
    }
  ]
}
```

### Artifact Management Test
```json
{
  "experimentId": "EXP-003",
  "title": "Artifact System Performance",
  "objective": "Measure artifact storage, retrieval, and versioning performance",
  "description": "Test artifact endpoint performance with varying payload sizes",
  "methodology": "Store and retrieve artifacts, measure response times",
  "duration": "~90 seconds",
  "tasks": [
    {
      "clone": "omega",
      "endpoint": "/artifacts",
      "method": "POST",
      "count": 50,
      "payload": {
        "type": "code",
        "content": "// Large code sample\nfunction* complexAlgorithm() { /* ... */ }",
        "metadata": {
          "description": "Test artifact",
          "language": "JavaScript"
        }
      },
      "description": "Omega: Artifact storage"
    }
  ]
}
```

## Template Fields

- `experimentId` (string): Unique identifier (EXP-###)
- `title` (string): Human-readable experiment name
- `objective` (string): What question does this experiment answer?
- `description` (string): Detailed description
- `methodology` (string): How is the experiment conducted?
- `duration` (string): Expected runtime
- `tasks` (array): List of tasks to execute

## Task Fields

- `clone` (string): Target clone name (beta, gamma, delta, sigma, omega)
- `endpoint` (string): API endpoint path (e.g., /health, /task)
- `method` (string): HTTP method (GET, POST) - defaults to POST
- `count` (number): How many times to execute this task
- `payload` (object): Request body for POST requests
- `description` (string): What does this task measure?

## Usage

```bash
# Run experiment
node ../../tools/monitoring/experiment-runner.js EXP-001-baseline.json

# Results saved to: data/experiments/EXP-001-[timestamp].json
```

## Best Practices

1. **One Experiment = One Research Question**: Each experiment should answer a specific question
2. **Reproducible**: Document exact parameters so experiment can be repeated
3. **Isolated**: Avoid mixing different concerns in one experiment
4. **Observable**: Collect enough data to spot patterns
5. **Documented**: Include methodology and expected outcomes

## Running Experiment Series

```bash
# Create experiment batch file
cat > run-experiments.sh << 'EOF'
#!/bin/bash
node tools/monitoring/experiment-runner.js data/experiments/EXP-001-baseline.json
node tools/monitoring/experiment-runner.js data/experiments/EXP-002-load-test.json
node tools/monitoring/experiment-runner.js data/experiments/EXP-003-artifacts.json
EOF

chmod +x run-experiments.sh
./run-experiments.sh
```

---

**Template Version**: 1.0  
**Created**: October 18, 2025
