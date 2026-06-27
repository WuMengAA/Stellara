# Admin Panel - Design Spec

## Overview
Admin dashboard for Stellara blog. Full CRUD for articles/tags/users, comment moderation. Nuxt Pages routing under `/admin/*`, admin-only guard.

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `admin/index.vue` | Dashboard: stats cards + recent articles table |
| `/admin/articles` | `admin/articles/index.vue` | Article list with search + status filter |
| `/admin/articles/new` | `admin/articles/new.vue` | Markdown editor (split pane) |
| `/admin/articles/:id/edit` | `admin/articles/[id].edit.vue` | Edit existing article |
| `/admin/tags` | `admin/tags.vue` | Tag table + inline create |
| `/admin/comments` | `admin/comments.vue` | Comment moderation |
| `/admin/users` | `admin/users.vue` | User list |

## Layout
- Sidebar (220px): nav links grouped into Content / System
- Topbar: page title + user badge with dropdown
- Content area: page-specific
- AdminLayout wraps all `/admin/*` pages

## Auth Guard
- `middleware/admin.ts`: check auth.isLoggedIn && auth.isAdmin
- Redirect to `/login` if not logged in, `/` if not admin

## Dashboard (`/admin`)
- 4 stat cards: Articles / Tags / Comments / Users (counts from API)
- Recent 10 articles table: Title / Status / Views / Date
- Quick links to each section

## Article Editor (`/admin/articles/new`, `[id].edit.vue`)
- Split pane: left textarea + right live Markdown preview
- Title input above textarea
- Toolbar: B I | H1 H2 | link list blockquote code | toggle preview
- Bottom bar: category selector, tag multi-select, Save Draft / Publish buttons
- Auto-save draft every 30s
- On save: POST/PATCH `/api/articles`

## Article List (`/admin/articles`)
- Search input + status filter tabs (All / Published / Draft)
- Table: Title / Status / Tags / Views / Date / Actions (Edit / Delete)

## Tags (`/admin/tags`)
- Table: Slug / Name / Color (dot) / Status / Usage Count / Order
- "New Tag" button → inline form row
- Inline delete

## Comments (`/admin/comments`)
- Table: Article / Author / Content (truncated) / Date / Status
- Actions: Hide/Show toggle, Delete
- Newest first

## Users (`/admin/users`)
- Table: Name / Email / Role / Status / Joined
- Read-only for non-admin users viewing own, full for admin
- Role/Status inline edit for admin

## API Dependencies
All APIs already exist under `/api/*`. No new server endpoints needed.
