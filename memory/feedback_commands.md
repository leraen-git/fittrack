---
name: Always give maximally accurate commands
description: User expects shell commands to use full paths, exact flags, and work copy-paste without modification
type: feedback
---
Always give the most precise, copy-paste-ready commands possible.

**Why:** User explicitly asked for this after receiving commands that used shortcuts instead of absolute paths.

**How to apply:**
- Use full absolute paths (e.g. `/Users/ramy/Documents/AppClaude/Tanren/apps/mobile` not `~/Tanren/apps/mobile`)
- Chain commands with `&&` so they run sequentially and fail fast
- Never use relative paths in commands given to the user
- Include the exact working directory for every command
