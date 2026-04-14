---
name: Always give maximally accurate commands
description: User expects shell commands to use full paths, exact flags, and work copy-paste without modification
type: feedback
originSessionId: 3edd2e77-56f9-4e78-9448-a973558947cc
---
Always give the most precise, copy-paste-ready commands possible.

**Why:** User explicitly asked for this after receiving commands that used shortcuts like `cd ~/fittrack` instead of absolute paths.

**How to apply:**
- Use full absolute paths (e.g. `/Users/ramy/fittrack/apps/mobile` not `~/fittrack/apps/mobile`)
- Chain commands with `&&` so they run sequentially and fail fast
- Never use relative paths in commands given to the user
- Include the exact working directory for every command
