# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog site for **C雙G**, built with Astro 5. Deployed to GitHub Pages at `https://csgbird.github.io` via the `gh-pages` branch.

## Commands

```bash
npm run dev        # start dev server (localhost:4321)
npm run build      # production build → dist/
npm run preview    # preview the dist/ build
npm run sync:notes # rsync Obsidian vault ~/notebook/wiki/ → src/content/notes-sync/
```

## Architecture

**Content collections** (`src/content.config.ts`):
- `blog` — Markdown files in `src/content/blog/`. Frontmatter: `title`, `date` (string, YYYY-MM-DD), `description?`, `tags?`, `draft?`.
- `notes` — Markdown files from Obsidian. Locally read from `src/content/notes/` (a symlink to the Obsidian vault); in CI (`process.env.CI`) read from `src/content/notes-sync/` (a git-tracked snapshot). Frontmatter: `title?`, `description?`, `category?`.

**Pages** (`src/pages/`):
- `/` — homepage with hero, category cards, and 5 most-recent non-draft blog posts
- `/blog/` + `/blog/[...id]` — blog list and individual post view with `LeftSidebar`
- `/notes/` + `/notes/[...id]` — notes list and individual note view with `LeftSidebar`
- `/photos/` — placeholder photo gallery
- `/about` — about page

**Key components:**
- `src/layouts/BaseLayout.astro` — HTML shell with sticky nav, footer, Google Fonts (LXGW WenKai + Noto Serif SC), and global CSS import
- `src/components/LeftSidebar.astro` — sticky collapsible sidebar used on blog/notes detail pages; groups blog by year, notes by `category`
- `src/styles/global.css` — CSS custom properties (warm ink palette: `--color-bg: #FDF6EC`, `--color-primary: #9B6B3F`), base resets, and `.scroll-fade` / `.fade-in-up` animation utilities

**Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) builds with `CI=true` on push to `main` and deploys `dist/` to the `gh-pages` branch.

## Notes Sync Workflow

Local development uses a symlink `src/content/notes → ~/notebook/wiki/` for live Obsidian editing. Before committing a notes snapshot for CI, run `npm run sync:notes` to copy the vault into `src/content/notes-sync/`.
