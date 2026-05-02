import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

// 本地用软链接（实时读取 Obsidian），CI/GitHub Actions 用 notes-sync（git 追踪的快照）
const NOTES_BASE = process.env.CI ? './src/content/notes-sync' : './src/content/notes';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: NOTES_BASE }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = { blog, notes };
