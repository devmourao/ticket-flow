# 🧠 Lessons Learned

This document serves as a Knowledge Base for the `ticket-flow` project, recording technical challenges, architectural decisions, and bug resolutions encountered during development.

## Sprint 1: Foundation & Auth

### TypeScript: `verbatimModuleSyntax` and Type Imports
* **Context:** The Vite React-TypeScript template enforces strict module resolution using `verbatimModuleSyntax` in `tsconfig.json`.
* **Issue:** When importing types or interfaces (like `Session` from `@supabase/supabase-js`), standard import statements cause a compilation error.
* **Solution:** Explicitly use `type-only` imports. This allows the compiler to strip these declarations safely during the build process, optimizing the final bundle.

**Incorrect:**
\`\`\`typescript
import { Session } from '@supabase/supabase-js';
\`\`\`

**Correct:**
\`\`\`typescript
import type { Session } from '@supabase/supabase-js';
\`\`\`