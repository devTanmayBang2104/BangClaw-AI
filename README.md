# 🐾 BangClaw

> **Autonomous AI Coding Agent & Developer Assistant**  
> Features interactive **CLI TUI** and **Telegram Bot** modes with human-in-the-loop approvals, in-memory transactional staging, and web research capabilities.

---

## ✨ Features

- **🤖 Agent Mode**: Autonomous coding agent that writes, modifies, and deletes files with a safe virtual staging layer and visual diff approvals.
- **🧭 Plan Mode**: Researches your codebase/web to generate structured multi-step plans with complexity estimations and interactive step selection.
- **❓ Ask Mode**: Read-only workspace analysis and web Q&A with optional export to Markdown.
- **📱 Telegram Bot Mode**: Full remote access via Telegram (`/start`, `/ask`, `/agent`, `/plan`) with interactive inline buttons.
- **🛡️ Safety First**: Path traversal prevention, exclusion policy filters, and transactional in-memory diff reviews before writing to disk.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the root directory:
```env
# OpenRouter API (Required for AI model)
OPENROUTER_API_KEY="your_openrouter_api_key_here"
OPENROUTER_DEFAULT_MODEL="nex-agi/nex-n2.5-pro:free"

# Firecrawl API (Optional: Web Search & Crawl)
FIRECRAWL_API_KEY="your_firecrawl_api_key_here"

# Telegram Bot (Optional: Telegram Mode)
TELEGRAM_BOT_TOKEN="your_telegram_bot_token_here"
TELEGRAM_OWNER_ID="your_telegram_numerical_user_id_here"
```

### 3. Run BangClaw
```bash
npx tsx index.ts wakeup
```

---

## 🛠️ Tech Stack

- **Runtime & Language**: TypeScript, Node.js / Bun, TSX
- **AI & Orchestration**: Vercel AI SDK, OpenRouter AI Provider, Zod
- **Web Intelligence**: Firecrawl SDK
- **Terminal UI**: `@clack/prompts`, Commander, Chalk, Figlet, Marked-Terminal, Diff
- **Bot Framework**: Telegraf (Telegram)