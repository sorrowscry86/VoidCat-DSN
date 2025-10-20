# ⚡ Research Infrastructure - Quick Reference Card

**Print this page for quick access during research sessions**

---

## 🚀 Start Monitoring (5 seconds)

```bash
cd research\tools\monitoring
node performance-monitor.js        # Terminal 1
node interaction-logger.js         # Terminal 2
```

**What happens**: 
- Live dashboards appear
- Continuous data collection begins
- Files saved to `../data/performance/` and `../data/interactions/`

---

## 🧪 Run an Experiment (2 seconds)

```bash
cd research\tools\monitoring
node experiment-runner.js ../../templates/EXP-001.json
```

**Note**: Monitoring should be running in another terminal

---

## 📊 Analyze Results (1 second)

```bash
cd research\tools\analysis
node performance-analyzer.js
```

**Output**: `performance-analysis.json` with statistics

---

## 📁 Directory Quick Reference

```
research/
├── data/
│   ├── performance/      ← Performance metrics
│   ├── interactions/     ← Clone communication
│   ├── experiments/      ← Experiment results
│   └── benchmarks/       ← Baseline data
├── tools/
│   ├── monitoring/       ← Data collection tools
│   └── analysis/         ← Analysis tools
├── templates/            ← Experiment configs
├── docs/                 ← Documentation
└── README.md             ← Main guide
```

---

## 🔧 Common Tasks

### Check if Clones are Running
```bash
# PowerShell
docker ps | Select-String ryuzu

# Or curl health
curl http://localhost:3002/health     # Beta
curl http://localhost:3003/health     # Gamma
curl http://localhost:3004/health     # Delta
curl http://localhost:3005/health     # Sigma
curl http://localhost:3000/health     # Omega
```

### View Latest Data
```bash
# Recent performance data
Get-Content research\data\performance\performance-*.jsonl -Tail 10

# Recent interactions
Get-Content research\data\interactions\interactions-*.jsonl -Tail 10

# Experiment results
Get-ChildItem research\data\experiments\ -Recurse | Sort -Descending
```

### Create New Experiment
```bash
# Copy template
Copy-Item templates\EXPERIMENT-TEMPLATE.md templates\EXP-002.json

# Edit in VS Code
code templates\EXP-002.json

# Run it
node tools\monitoring\experiment-runner.js templates\EXP-002.json
```

---

## 📊 Monitoring Dashboard Output

```
╔════════════════════════════════════════════════════════════════╗
║   VoidCat RDC - Performance Monitor                           ║
╚════════════════════════════════════════════════════════════════╝

Omega (Coordinator)
─────────────────────────────────────────────
  Status:              ✅ HEALTHY
  Response Time (avg): 45.23ms
  Success Rate:        100%
  Total Requests:      245

Beta (Analyzer)
─────────────────────────────────────────────
  Status:              ✅ HEALTHY
  Response Time (avg): 67.45ms
  Success Rate:        99.8%
  Total Requests:      234
```

---

## 📈 Analysis Report Output

```
Performance Analysis Report
════════════════════════════════════════════

Clone          Min    Mean    Median   P95    P99
────────────────────────────────────────────────
beta           32     67.45   65       120    245
gamma          41     89.23   87       156    312
delta          28     54.67   52       98     187
sigma          45     76.34   74       132    298
omega          22     45.23   43       78     156
```

---

## ⚙️ Tool Parameters

### performance-monitor.js
```bash
--interval 1000        # Update every 1 second (default)
--logdir ./logs        # Save to custom directory
```

### interaction-logger.js
```bash
--intercept-port 9000  # Listen on port 9000 (default)
--logdir ./logs        # Save to custom directory
```

### experiment-runner.js
```bash
EXP-001.json                    # Config file (required)
--output-dir ../data/experiments # Save results here
```

### performance-analyzer.js
```bash
--input-dir ../data/performance # Read from directory
--output report.json            # Save analysis to file
```

---

## 🔍 Data File Formats

### Performance Data (JSONL)
```json
{"timestamp":"2025-10-18T10:30:00Z","metrics":{"beta":{"responseTimeAvg":"67.45","successRate":0.998}}}
```

### Experiment Results (JSON)
```json
{
  "config": { "experimentId": "EXP-001", ... },
  "results": {
    "tasks": [ { "clone": "beta", "successful": 48, ... } ],
    "summary": { "overallSuccessRate": "98.5%", ... }
  }
}
```

---

## ⚠️ Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Monitor shows "❌ UNHEALTHY" | `docker restart ryuzu-beta-sanctuary` |
| No data being collected | Check `docker ps \| Select-String ryuzu` |
| Port 9000 already in use | Use `--intercept-port 9001` |
| Analysis shows no results | Monitor must be running, check `data/performance/` exists |
| Experiment hangs | Check clone logs: `docker logs ryuzu-beta-sanctuary` |

---

## 📋 Data Collection Cycle

**Typical Research Day**:

```
09:00 - Start monitoring
          node performance-monitor.js
          node interaction-logger.js

10:00 - Run baseline experiment
          node experiment-runner.js EXP-001.json

11:00 - Run specialization test
          node experiment-runner.js EXP-002.json

12:00 - Run load test
          node experiment-runner.js EXP-003.json

13:00 - Analyze results
          node performance-analyzer.js

14:00 - Review findings, plan next experiments

17:00 - Stop monitoring (Ctrl+C in both terminals)
```

---

## 🎯 Key Metrics to Track

- **Response Time**: Min, max, mean, P95, P99
- **Success Rate**: Percentage of successful requests
- **Throughput**: Requests per second
- **Error Rate**: Failed requests per total
- **Uptime**: Clone availability percentage

---

## 📞 When Things Go Wrong

**Monitor won't start?**
1. Check clones running: `docker ps`
2. Try manually: `curl http://localhost:3002/health`
3. Check ports available: `netstat -ano | findstr 3002`

**No data files created?**
1. Check directory exists: `ls research\data\performance\`
2. Check permissions: Can you write to directory?
3. Check monitor is actually running

**Experiment fails?**
1. Check experiment JSON is valid
2. Try manually calling endpoint: `curl -X POST http://localhost:3002/task`
3. Review clone logs: `docker logs ryuzu-beta-sanctuary`

---

## 🔒 Important Reminders

✅ Monitor is confidential - keep raw data in `research/` directory  
✅ NEVER commit `.json` data files to git (`.gitignore` prevents this)  
✅ Back up important results before deleting  
✅ Keep `.gitignore` intact to protect pre-publication data  

---

## 📚 Learn More

- **Full Guide**: `research/docs/USAGE-GUIDE.md`
- **Experiments**: `research/templates/EXPERIMENT-TEMPLATE.md`
- **Publication**: `research/docs/PUBLICATION-CHECKLIST.md`
- **Overview**: `research/README.md`

---

## 🎓 Research Workflow

```
1. COLLECT
   ↓
   Start monitoring → Run experiments → Gather data
   
2. ORGANIZE
   ↓
   Review data files → Verify completeness → Archive backups
   
3. ANALYZE
   ↓
   Statistical analysis → Identify trends → Extract findings
   
4. DOCUMENT
   ↓
   Write findings → Create visualizations → Prepare for publication
```

---

**Quick Reference v1.0** | October 18, 2025  
**Print this page for fastest research workflow**
