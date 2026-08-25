# 🧠 Lessons Learned

This document serves as a Knowledge Base for the `ticket-flow` project, recording technical challenges, architectural decisions, and bug resolutions encountered during development.

## Sprint 2: Dashboard & Ticket CRUD

### TypeScript LTS: `FormEvent` Deprecation
* **Context:** When upgrading to recent Long Term Support (LTS) versions of `@types/react`, traditional form typing practices throw warnings.
* **Issue:** Utilizing `React.FormEvent<HTMLFormElement>` triggers a deprecation warning (`ts(6385)`), as the native `FormEvent` does not accurately represent the underlying browser DOM event (which is actually a `SubmitEvent`).
* **Solution:** Replaced the deprecated type with `React.SyntheticEvent<HTMLFormElement>`, strictly aligning with the latest React type definitions and ensuring a warning-free compilation.

### UI/UX: App-like Dashboard Layouts & Box Model
* **Context:** Building a dashboard requires a locked-screen approach, preventing global window scrolling while allowing inner content to scroll.
* **Issue:** Combining `height: 100vh` with container paddings caused Box Model overflow, pushing critical UI elements (like the Logout button) out of the viewport.
* **Solution:** 
  1. Enforced a strict CSS reset using `box-sizing: border-box`.
  2. Locked the root elements (`html, body, #root`) with `height: 100%` and `overflow: hidden`.
  3. Applied `flex: 1` and `overflow-y: auto` exclusively to the `mainContent` wrapper.

---

## Sprint 1: Foundation & Auth

### TypeScript: `verbatimModuleSyntax` and Type Imports
* **Context:** The Vite React-TypeScript template enforces strict module resolution using `verbatimModuleSyntax` in `tsconfig.json`.
* **Issue:** When importing types or interfaces (like `Session` from `@supabase/supabase-js`), standard import statements cause a compilation error.
* **Solution:** Explicitly use `type-only` imports. This allows the compiler to strip these declarations safely during the build process, optimizing the final bundle.