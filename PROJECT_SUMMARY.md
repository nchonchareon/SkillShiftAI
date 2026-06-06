# SkillShiftAI — Project Summary & Lessons Learned

> AI-Powered Job Redesign & Reskilling Platform  
> สรุปโปรเจค สถาปัตยกรรม ความปลอดภัย และบทเรียนจากการสร้างระบบ

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Features](#4-features)
5. [Security Audit & Fixes](#5-security-audit--fixes)
6. [Deployment](#6-deployment)
7. [Lessons Learned](#7-lessons-learned)
8. [Known Limitations](#8-known-limitations)
9. [Future Improvements](#9-future-improvements)

---

## 1. Project Overview

SkillShiftAI เป็นแพลตฟอร์มที่ช่วยองค์กรจัดการการเปลี่ยนผ่านทักษะบุคลากรในยุค AI Automation โดยใช้ AI วิเคราะห์งาน ประเมินความเสี่ยง และแนะนำแผนพัฒนาทักษะ

**เป้าหมายหลัก:**
- วิเคราะห์งานด้วย AI เพื่อแยกแยะกิจกรรมย่อยและประเมิน Automation Risk Score
- แสดงช่องว่างทักษะ (Skill Gap) ของบุคลากร
- แนะนำแผนพัฒนาทักษะเฉพาะบุคคล
- จัดลำดับความสำคัญของการเปลี่ยนผ่าน

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js (App Router) | 15.5.19 | React framework |
| **UI** | TypeScript + Tailwind CSS | 3.4.x | Type safety + styling |
| **Icons** | Lucide React | 0.460.x | Icon library |
| **Charts** | Recharts | 2.15.x | Dashboard visualizations |
| **Database** | PostgreSQL + pgvector | 17 + 0.8.2 | Vector similarity search |
| **ORM** | Prisma | 5.22.x | Database access |
| **AI (Primary)** | Typhoon Thai AI | v2.5-30b | Thai-optimized LLM (free) |
| **AI (Local)** | Ollama | qwen2.5:1.5b | Local fallback |
| **PDF** | html2pdf.js | 0.14.x | Client-side PDF generation |
| **Hosting** | Vercel | — | Serverless deployment |
| **Cloud DB** | Neon PostgreSQL | — | Managed PostgreSQL + pgvector |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Dashboard │ │   Jobs   │ │ Reskill  │ ...pages   │
│  └──────────┘ └──────────┘ └──────────┘            │
│         ↓             ↓             ↓               │
│  ┌─────────────────────────────────────────────┐    │
│  │           API Routes (7 endpoints)           │    │
│  │  /api/ai/analyze  /api/jobs  /api/talent     │    │
│  │  /api/reskilling  /api/db-status             │    │
│  │  /api/skills/match  /api/jobs/analyze        │    │
│  └─────────────────────────────────────────────┘    │
│         ↓             ↓             ↓               │
│  ┌──────────┐ ┌──────────────┐ ┌──────────┐       │
│  │ Prisma   │ │ Typhoon API  │ │ Ollama   │       │
│  │ ORM      │ │ (Cloud)      │ │ (Local)  │       │
│  └────┬─────┘ └──────────────┘ └──────────┘       │
│       ↓                                            │
│  ┌─────────────────────────────────────────────┐    │
│  │        Neon PostgreSQL + pgvector            │    │
│  │  users | master_skills | jobs | job_skills   │    │
│  │  user_skills | analysis_results              │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Database Schema (Prisma)

| Model | Records | Purpose |
|-------|---------|---------|
| `User` | 5 | พนักงาน |
| `MasterSkill` | 18 | ทักษะมาตรฐาน (มี vector embedding) |
| `Job` | 5 | ตำแหน่งงาน |
| `JobTask` | — | 任务ของงาน |
| `JobSkill` | 28 | ทักษะที่ต้องการในงาน |
| `UserSkill` | 50 | ทักษะที่พนักงานมี |
| `AnalysisResult` | 3 | ผลการวิเคราะห์ |

### API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/ai/analyze` | วิเคราะห์งานด้วย AI | Rate limit |
| GET | `/api/jobs` | รายการงาน | — |
| POST | `/api/jobs` | สร้างงานใหม่ | — |
| POST | `/api/jobs/analyze` | บันทึกผลวิเคราะห์ | — |
| GET | `/api/talent` | ข้อมูลบุคลากร | — |
| GET | `/api/reskilling` | แผนพัฒนาทักษะ | — |
| POST | `/api/skills/match` | ค้นหาทักษะด้วย vector | — |
| GET | `/api/db-status` | สถานะฐานข้อมูล | — |

---

## 4. Features

### Core Features
1. **AI Job Analysis** — วิเคราะห์ Job Description ด้วย AI, แยก task, ประเมิน Automation Risk
2. **Guided Input Form** — ฟอร์มนำเข้าข้อมูลแบบมีโครงสร้าง (Structured Input)
3. **Skill Gap Analysis** — แสดงช่องว่างทักษะระหว่างทักษะที่มี vs ที่ต้องการ
4. **Reskilling Recommendations** — แนะนำคอร์สเรียนและแผนพัฒนา
5. **Talent Pool Dashboard** — แดชบอร์ดแสดงบุคลากรและทักษะ
6. **Real-time Analytics** — กราฟและสถิติแบบ live
7. **AI Insights** — ข้อมูลเชิงลึกจาก AI

### UX Features
8. **Thai/English Toggle** — รองรับ 2 ภาษา (~150+ translation keys)
9. **Responsive Design** — Desktop (sidebar), Tablet (icons), Mobile (hamburger)
10. **Dark Mode** — Slate/Indigo theme throughout
11. **PDF Export** — สร้าง PDF file แบบ slide-style แล้วดาวน์โหลดเลย
12. **Login System** — หน้าเข้าสู่ระบบ + settings guard
13. **Multi-AI Provider Settings** — ตั้งค่า Typhoon/Gemini/Ollama, toggle เปิด/ปิด
14. **Database Monitor** — ดูสถานะ DB + จำนวน records ใน Settings

---

## 5. Security Audit & Fixes

### Vulnerabilities Found (24 total)

#### Critical (5)
| # | Finding | Fix |
|---|---------|-----|
| C1 | No authentication on ALL API routes | Rate limiting middleware added |
| C2 | Fake login — accept-all | Kept as demo (documented) |
| C3 | Client-side only auth gate | Kept as demo (documented) |
| C4 | No middleware.ts | Created `src/middleware.ts` with rate limiting |
| C5 | Next.js 14.2.18 CVE (CVSS 9.1) | Upgraded to Next.js 15.5.19 |

#### High (6)
| # | Finding | Fix |
|---|---------|-----|
| H1 | Zero rate limiting | Rate limit middleware: API 30/min, AI 5/min |
| H2 | Prompt injection possible | Input length limits (10K chars) + validation |
| H3 | error.message leaked to client | Sanitized all 7 API routes |
| H4 | Unbounded query params | `limit` capped at 100, `page` validated |
| H5 | 6 high-severity Next.js CVEs | Upgraded to Next.js 15.5.19 |
| H6 | Unauthenticated write access | Rate limiting + input validation |

#### Medium (7)
| # | Finding | Fix |
|---|---------|-----|
| M1 | No security headers | Added CSP, HSTS, X-Frame-Options, etc. in `next.config.mjs` |
| M2 | No request body size limits | Added `content-length` check + field length limits |
| M3 | No runtime type validation | Added type checks, NaN handling, range validation |
| M4 | SQL query leaked in response | Removed `query_used` from `/api/skills/match` |
| M5 | Unvalidated numeric params | Added range validation for `minProficiency`, `topK`, `threshold` |
| M6 | Incomplete logout | Added `skillshiftai_db_enabled` cleanup |
| M7 | PostCSS XSS vulnerability | Upgraded postcss to 8.5.10 via override |

### Security Headers Added

```javascript
// next.config.mjs
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' ...",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
}
```

### Rate Limiting (middleware.ts)

```typescript
// In-memory rate limiting
const RATE_LIMIT = {
  api: 30,        // 30 requests per minute for general API
  ai: 5,          // 5 requests per minute for AI endpoints
  windowMs: 60_000,
};
```

### Dependency Upgrades

| Package | Before | After | Security Impact |
|---------|--------|-------|-----------------|
| next | 14.2.18 | 15.5.19 | Fixed CVE-2025-29927 (CVSS 9.1) + 6 high CVEs |
| react | 18.3.1 | 19.2.7 | Latest stable |
| react-dom | 18.3.1 | 19.2.7 | Latest stable |
| eslint-config-next | 14.2.18 | 15.5.19 | Fixed glob command injection |
| postcss | 8.4.49 | 8.5.10 | Fixed XSS vulnerability |

### Final Audit Result

```
$ npm audit
found 0 vulnerabilities
```

---

## 6. Deployment

### Environment Variables (Vercel)

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:...@ep-xxx.neon.tech/neondb?sslmode=require` | Neon PostgreSQL |
| `TYPHOON_API_KEY` | `sk-xxx...` | Typhoon AI (free tier) |
| `AI_PROVIDER` | `typhoon` | Default AI provider |

### Deployment Pipeline

```bash
# Local development
npm run dev

# Build
npm run build        # prisma generate + next build

# Deploy
git push             # Push to GitHub → auto-deploy on Vercel
npx vercel --prod    # Manual deploy
```

### URLs

| Environment | URL |
|-------------|-----|
| Production | https://skill-shift-ai-eta.vercel.app |
| GitHub | https://github.com/nchonchareon/SkillShiftAI |

---

## 7. Lessons Learned

### 7.1 Database & ORM

**บทเรียน: Prisma null guard เมื่อไม่มี Database**

```typescript
// src/lib/prisma.ts
function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;  // คืน null เมื่อไม่มี DB
  }
  // ...
}

export const prisma = getPrisma();
```

**ทำไม:** ทำให้ Vercel build ได้แม้ไม่มี DATABASE_URL — API routes คืน 503 แทนที่จะ crash

**บทเรียน: pgvector ต้อง enable extension ก่อน**

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

ต้องทำก่อน `prisma db push` ไม่งั้นจะ error `type "vector" does not exist`

---

### 7.2 AI Integration

**บทเรียน: เลือก AI Provider ที่เหมาะกับ use case**

| Provider | ข้อดี | ข้อเสีย |
|----------|-------|---------|
| Typhoon | ภาษาไทยดีมาก, ฟรี, OpenAI-compatible | Rate limit 5 req/s |
| Ollama | ฟรี, ไม่ต้อง internet, ไม่มี rate limit | ช้า (~24s vs ~0.4s) |
| Gemini | ครอบคลุม, มี free tier | Quota หมดเร็ว |

**บทเรียน: OpenAI-compatible API format**

Typhoon ใช้ format เดียวกับ OpenAI — เปลี่ยน provider ได้ง่าย:

```typescript
const response = await fetch(`${endpoint}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "typhoon-v2.5-30b-a3b-instruct",
    messages: [...],
    temperature: 0.7,
    max_tokens: 4096,
  }),
});
```

---

### 7.3 Security

**บทเรียนที่สำคัญที่สุด: อย่า rely on client-side ฝั่งเดียว**

```typescript
// ❌ WRONG — ใครก็ bypass ได้
const isAuth = sessionStorage.getItem("skillshiftai_auth") === "true";

// ✅ BETTER — server-side middleware + JWT
export function middleware(request: NextRequest) {
  const token = request.cookies.get("session");
  if (!token) return NextResponse.redirect("/login");
}
```

**บทเรียน: Sanitize error messages**

```typescript
// ❌ WRONG — leak internal details
catch (error) {
  return NextResponse.json({ error: error.message });
}

// ✅ BETTER — generic message only
catch (error) {
  console.error("[Route Error]", error);  // log server-side only
  return NextResponse.json({ error: "Internal server error" });
}
```

**บทเรียน: Rate limiting สำคัญมากสำหรับ AI endpoints**

```typescript
// AI endpoints ทำ external API call = เสียเงิน
// ถ้าไม่มี rate limit → ใครก็ spam ได้ → ค่าใช้จ่ายบาน
const RATE_LIMIT = {
  ai: 5,  // 5 requests/minute for AI endpoints
};
```

**บทเรียน: Security Headers ป้องกันได้มาก**

| Header | ป้องกันอะไร |
|--------|-------------|
| `X-Frame-Options: DENY` | Clickjacking |
| `X-Content-Type-Options: nosniff` | MIME-sniffing |
| `Content-Security-Policy` | XSS, code injection |
| `Strict-Transport-Security` | HTTPS downgrade |
| `Referrer-Policy` | Referrer leakage |

---

### 7.4 PDF Generation

**บทเรียน: html2pdf.js vs window.print()**

| | `window.print()` | `html2pdf.js` |
|---|---|---|
| User experience | เปิด print dialog → เลือก Save as PDF | กดปุ่ม → ดาวน์โหลดเลย |
| Quality | ขึ้นอยู่กับ browser | ควบคุมได้ (scale, quality) |
| Page breaks | ใช้ CSS `page-break-after` | ใช้ CSS + html2canvas |
| Dark mode | ต้องใช้ `print-color-adjust` | จัดการเอง |

**บทเรียน: Page breaks สำหรับ slide-style PDF**

```css
/* ต้องใส่ทั้งใน @media print และปกติ */
.slide {
  page-break-after: always;
  break-after: page;
}
```

---

### 7.5 i18n (Internationalization)

**บทเรียน: โครงสร้าง translation keys ควรมี pattern ชัดเจน**

```typescript
// ✅ ดี — มี pattern ชัด
"settings.database.title": "ฐานข้อมูล",
"settings.database.connected": "เชื่อมต่อสำเร็จ",
"settings.database.disconnected": "ไม่สามารถเชื่อมต่อได้",

// ❌ ไม่ดี — ไม่มี pattern
"dbTitle": "ฐานข้อมูล",
"dbConnected": "เชื่อมต่อสำเร็จ",
```

---

### 7.6 Deployment

**บทเรียน: Vercel Environment Variables**

- `.env.local` **ไม่**ถูก push ขึ้น Vercel — ต้องตั้งใน Vercel Dashboard หรือ CLI
- ใช้ `npx vercel env add VARIABLE_NAME production` ผ่าน CLI
- ต้อง redeploy หลังเปลี่ยน env vars

**บทเรียน: Neon PostgreSQL**

- pgvector มี built-in ใน Neon — ไม่ต้อง compile เอง
- ใช้ pooled connection string (port 5432) สำหรับ serverless
- Free tier: 0.5 GB storage, 24/7 compute

---

### 7.7 Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Prisma `Unsupported("vector(1536)")` error | ต้อง `CREATE EXTENSION vector` ก่อน `prisma db push` |
| `window.print()` ไม่ show dark backgrounds | เพิ่ม `print-color-adjust: exact` ทุก element |
| sessionStorage bypass | ใช้ server-side auth (middleware + JWT) |
| AI API key leak | ไม่ commit `.env.local`, ใช้ Vercel env vars |
| `error.message` leak | Sanitize ทุก catch block |
| `parseInt("abc")` = NaN | ตรวจสอบ `isNaN()` ก่อนใช้ |

---

## 8. Known Limitations

1. **Authentication** — ปัจจุบันเป็น demo login (accept-all) — ไม่มี real auth
2. **Rate Limiting** — in-memory Map-based — reset เมื่อ serverless cold start
3. **AI Tokens** — Settings page แสดง token usage แบบ hardcoded (ไม่ได้ track จริง)
4. **PDF Quality** — html2pdf.js ใช้ html2canvas → บาง element อาจ render ไม่เหมือน browser
5. **pgvector search** — ปัจจุบัน return mock data (ยังไม่ connect real vector search)

---

## 9. Future Improvements

| Priority | Feature | Effort |
|----------|---------|--------|
| 🔴 High | Implement real auth (NextAuth.js / Lucia) | High |
| 🔴 High | Connect real pgvector search for skill matching | Medium |
| 🟠 Medium | Upgrade Prisma 5 → 7 | Medium |
| 🟠 Medium | Add Elasticsearch for full-text search | Medium |
| 🟡 Low | Add unit tests (Jest + Testing Library) | Medium |
| 🟡 Low | Add E2E tests (Playwright) | High |
| 🟢 Nice | Add i18n for PDF content | Low |
| 🟢 Nice | Add dark mode toggle in PDF export | Low |

---

## Appendix A: File Structure

```
SkillShiftAI/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout (sidebar + providers)
│   │   ├── login/page.tsx        # Login page
│   │   ├── dashboard/page.tsx    # Dashboard with Recharts
│   │   ├── jobs/page.tsx         # Job analysis (Guided + Raw tabs)
│   │   ├── document/page.tsx     # PDF export (slide-style)
│   │   ├── insights/page.tsx     # AI insights dashboard
│   │   ├── reskilling/page.tsx   # Reskilling recommendations
│   │   ├── talent/page.tsx       # Talent pool
│   │   ├── analytics/page.tsx    # Quarterly trends
│   │   ├── about/page.tsx        # System info
│   │   ├── settings/page.tsx     # Settings (login guard + multi-provider)
│   │   ├── globals.css           # Tailwind + print CSS
│   │   └── api/
│   │       ├── ai/analyze/route.ts
│   │       ├── jobs/route.ts
│   │       ├── jobs/analyze/route.ts
│   │       ├── talent/route.ts
│   │       ├── reskilling/route.ts
│   │       ├── skills/match/route.ts
│   │       └── db-status/route.ts
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── MetricCard.tsx
│   ├── lib/
│   │   ├── ai.ts                 # Typhoon + Ollama providers
│   │   ├── i18n.tsx              # Thai/English translations
│   │   └── prisma.ts             # Prisma singleton
│   └── middleware.ts             # Rate limiting
├── prisma/
│   ├── schema.prisma             # DB schema with pgvector
│   └── seed.ts                   # Seed data
├── next.config.mjs               # Security headers
├── package.json                  # Dependencies + overrides
└── .env.local                    # Secrets (gitignored)
```

---

## Appendix B: Quick Commands

```bash
# Development
npm run dev                    # Start dev server

# Database
npx prisma generate            # Generate Prisma client
npx prisma db push             # Push schema to DB
npx tsx prisma/seed.ts         # Seed data

# Build & Deploy
npm run build                  # Build (prisma generate + next build)
npx vercel --prod              # Deploy to Vercel

# Security
npm audit                      # Check vulnerabilities
npm audit fix --force          # Auto-fix vulnerabilities

# Testing on Neon
$env:DATABASE_URL="postgresql://..."; npx prisma db push
```

---

*Document generated: June 2026*  
*Last updated: SkillShiftAI v1.0 — Next.js 15.5.19, 0 vulnerabilities*
