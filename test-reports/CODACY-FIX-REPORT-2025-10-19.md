# Codacy Error Investigation & Resolution Report

**Date**: October 19, 2025

**Issue**: CodacyError - Line Ending Problem in CLI Scripts

## Problem Analysis

### Error Messages

```text
/usr/bin/env: 'bash\r': No such file or directory
/usr/bin/env: use -[v]S to pass options in shebang lines
```

### Root Cause

The `.codacy/cli.sh` script and other shell scripts were created/edited on Windows with **CRLF line endings** (`\r\n`) instead of Unix **LF line endings** (`\n`).

When Codacy CLI attempts to execute via WSL (Windows Subsystem for Linux), the shebang line is interpreted incorrectly.

**Incorrect**: `#!/usr/bin/env bash\r` ❌

**Expected**: `#!/usr/bin/env bash` ✅

### Why This Happens

1. VS Code defaults to CRLF line endings on Windows
2. Shell scripts MUST use LF line endings to be executable in Unix/Linux environments
3. WSL cannot parse the malformed shebang with trailing carriage return

## Resolution Steps

### 1. Fixed Line Endings on All Shell Scripts

Converted all `.sh` files from CRLF to LF:

- ✅ `.codacy/cli.sh`
- ✅ `scripts/health-check.sh`
- ✅ `scripts/deploy-all.sh`
- ✅ `mcp-server/validate-setup.sh`
- ✅ `mcp-server/test-integration.sh`
- ✅ `mcp-server/setup.sh`

### 2. Verified Syntax

Ran bash syntax check on the fixed script:

```bash
wsl bash -n .codacy/cli.sh
# Result: ✓ Syntax check passed
```

### 3. Added Git Configuration

Created `.gitattributes` file to prevent this issue in the future.

## Git Configuration (`.gitattributes`)

```gitattributes
# Auto detect text files and normalize line endings to LF
* text=auto

# Shell scripts - always use LF
*.sh text eol=lf
*.bash text eol=lf

# Other script types
*.py text eol=lf
*.js text eol=lf
*.ts text eol=lf

# Docker files
Dockerfile* text eol=lf

# Git files
.gitattributes text eol=lf
.gitignore text eol=lf

# Windows batch/PowerShell - use CRLF
*.bat text eol=crlf
*.cmd text eol=crlf
*.ps1 text eol=crlf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.zip binary
*.tar binary
*.gz binary
```

## Verification

The script is now:

- ✅ Syntactically correct
- ✅ Executable via WSL
- ✅ Properly formatted with Unix line endings

## Recommendations

### Immediate Actions (Completed)

- [x] Fix all `.sh` files to use LF
- [x] Add `.gitattributes` for automatic line ending normalization
- [x] Verify CLI script passes syntax check

### For Future Development

1. **Configure VS Code** to use LF line endings by default
   - Set `files.eol: "\n"` in workspace settings
   - Or use `.editorconfig` file with `end_of_line = lf`

2. **Git Configuration** (now automated via `.gitattributes`)
   - Git will automatically convert line endings on commit/checkout
   - Developers always see correct line endings in their editor

3. **CI/CD Validation**
   - Add pre-commit hook to validate shell script syntax
   - Include lint check: `shellcheck *.sh`

## Files Modified

- `.codacy/cli.sh` - Regenerated with proper LF endings
- `scripts/health-check.sh` - Fixed line endings
- `scripts/deploy-all.sh` - Fixed line endings
- `mcp-server/validate-setup.sh` - Fixed line endings
- `mcp-server/test-integration.sh` - Fixed line endings
- `mcp-server/setup.sh` - Fixed line endings
- `.gitattributes` - **NEW** (prevents future occurrences)

## Status

✅ **RESOLVED** - Codacy CLI should now execute without line ending errors
