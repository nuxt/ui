---
title: LLMs.txt
description: 'How to get AI tools like Cursor, Windsurf, GitHub Copilot, ChatGPT, and Claude to understand Nuxt UI components, theming, and best practices.'
navigation.icon: i-lucide-bot
---

## What is LLMs.txt?

LLMs.txt is a structured documentation format specifically designed for large language models (LLMs). Nuxt UI provides LLMs.txt files that contain comprehensive information about our component library, making it easy for AI tools to understand and assist with Nuxt UI development.

These files are optimized for AI consumption and contain structured information about components, APIs, usage patterns, and best practices.

## Available Routes

We provide LLMs.txt routes to help AI tools access our documentation:

- **`/llms.txt`** - Contains a structured overview of all components and their documentation links
- **`/llms-full.txt`** - Provides comprehensive documentation including implementation details, examples, theming, composables, and migration guidance

## Usage with AI Tools

### Cursor

Nuxt UI provides specialized LLMs.txt files that you can reference in Cursor for better AI assistance with component development.

#### Available LLMs.txt files:

- `https://ui.nuxt.com/llms.txt` - Component overview and links
- `https://ui.nuxt.com/llms-full.txt` - Comprehensive documentation with examples

#### How to use:

1. **Direct reference**: Mention the LLMs.txt URLs when asking questions
2. **@Docs**: Add these specific URLs to your project context using @Docs

#### Example:

```
Using Nuxt UI documentation from @https://ui.nuxt.com/llms-full.txt, how do I create a modal component?
```

### Windsurf

Windsurf can directly access the Nuxt UI LLMs.txt files to understand component usage and best practices.

#### Using LLMs.txt with Windsurf:

- Use `@docs` to reference specific LLMs.txt URLs:
  - `@https://ui.nuxt.com/llms.txt` for component overview
  - `@https://ui.nuxt.com/llms-full.txt` for comprehensive documentation
- Create persistent rules referencing these URLs in your workspace

#### Example usage:

```
@https://ui.nuxt.com/llms-full.txt
How do I create a modal with Nuxt UI v4?
```

[Read more about Windsurf Web and Docs Search](https://docs.windsurf.com/windsurf/cascade/web-search)

### Other AI Tools

Any AI tool that supports LLMs.txt can use these routes to better understand Nuxt UI. Simply point your tool to any of the routes above based on your needs:

- `https://ui.nuxt.com/llms.txt` for component overview
- `https://ui.nuxt.com/llms-full.txt` for comprehensive documentation

#### Examples for ChatGPT, Claude, or other LLMs:

- "Using Nuxt UI documentation from https://ui.nuxt.com/llms.txt"
- "Follow complete Nuxt UI guidelines from https://ui.nuxt.com/llms-full.txt"
