# 🔬 Research Infrastructure - Usage Guide

**Updated**: October 18, 2025  
**Version**: 1.0  
**Status**: Production Ready

---

## 🚀 Quick Start

### 1. Start the Monitoring Suite (5 minutes)

```bash
cd d:\Development\VoidCat-DSN\research\tools\monitoring

# Terminal 1 - Performance Monitor (updates every 1 second)
node performance-monitor.js --interval 1000

# Terminal 2 - Interaction Logger (tracks all clone communication)
node interaction-logger.js --intercept-port 9000
```

**What's being tracked**:
- ✅ All clone response times (min/max/average)
- ✅ Health status of each clone
- ✅ Success/error rates
- ✅ Clone-to-clone communication patterns
- ✅ Network latency and overhead

### 2. Run an Experiment (3 minutes)

```bash
# Copy experiment template
cp templates/EXPERIMENT-TEMPLATE.md templates/EXP-001-baseline.json

# Edit the JSON file with your experiment parameters

# Run the experiment
cd tools/monitoring
node experiment-runner.js ../../templates/EXP-001-baseline.json --output-dir ../data/experiments
```

**Results saved to**: `data/experiments/EXP-001-*.json`

### 3. Analyze Results (2 minutes)

```bash
cd tools/analysis

# Analyze performance data from last 24 hours
node performance-analyzer.js --input-dir ../data/performance --output analysis-report.json

# Analyze interactions (optional)
# node interaction-analyzer.js --input-dir ../data/interactions
```

---

## 📊 Detailed Usage

### Performance Monitor

**Purpose**: Real-time monitoring of all 5 clones

**What it tracks**:
- Response times (health endpoint)
- Success rates
- Uptime tracking
- Health status (✅ or ❌)
- Consecutive failures

**Data Output**: `data/performance/performance-YYYY-MM-DD.jsonl`  
**Update Interval**: Configurable (default 1000ms)

**Features**:
- Live dashboard with real-time updates
- Automatic log rotation (daily files)
- Historical trending data
- Per-clone statistics

**Usage Examples**:

```bash
# Monitor every second (real-time dashboard)
node performance-monitor.js --interval 1000 --logdir ../data/performance

# Monitor every 5 seconds (less CPU usage)
node performance-monitor.js --interval 5000

# Monitor every 10 seconds (for 24-hour runs)
node performance-monitor.js --interval 10000
```

---

## 🎯 Research Use Cases

### Use Case 1: Performance Benchmarking

**Objective**: Establish baseline performance for paper

```bash
# 1. Start monitoring
node tools/monitoring/performance-monitor.js

# 2. Run baseline experiment
node tools/monitoring/experiment-runner.js templates/EXP-001-baseline.json

# 3. Wait 10 minutes for enough data points
# (monitoring continues in background)

# 4. Analyze results
node tools/analysis/performance-analyzer.js
```

**Results**: Performance statistics and percentile analysis for paper

---

## 📞 Questions?

For help with:
- **Experiment Design**: See EXPERIMENT-TEMPLATE.md
- **Data Interpretation**: Review analysis output format
- **Tool Issues**: Check individual tool documentation
- **General Help**: Contact SorrowsCry86@voidcat.org

---

**Research Infrastructure Guide v1.0** | Created October 18, 2025
