# SkillShiftAI

AI-Powered Job Redesign & Reskilling Platform — แพลตฟอร์มออกแบบงานและพัฒนาทักษะด้วย AI

## Features

- **AI Job Analysis** — วิเคราะห์รายละเอียดงาน ประเมินความเสี่ยงจากการ автоматизация แนะนำงานที่ควรปรับเปลี่ยน
- **Guided Structured Input** — แบบฟอร์มป้อนข้อมูลแบบมีโครงสร้าง เพิ่มความแม่นยำในการวิเคราะห์ 85%+
- **Reskilling Pathways** — ค้นหาช่องว่างทักษะ (Skill Gap) แนะนำคอร์สเรียนและเส้นทางการพัฒนา
- **Talent Pool** — จัดการข้อมูลบุคลากร ประเมินทักษะ ระบุพนักงานที่เสี่ยง
- **AI Insights Dashboard** — แดชบอร์ดข้อมูลเชิงลึกจาก AI สรุปทักษะที่ขาดแคลน อาชีพเสี่ยง คอร์สเรียนยอดนิยม
- **Thai/English** — รองรับภาษาไทยและอังกฤษ สลับได้ทันที
- **Responsive Design** — รองรับ Desktop, Tablet, Mobile
- **PDF Export** — ดาวน์โหลดเอกสารพิมพ์เขียวเป็น PDF

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| UI Components | Lucide React, Recharts |
| AI Engine | Ollama + Qwen3 1.7B (Local, Free) |
| Database | PostgreSQL 17 + pgvector |
| ORM | Prisma |
| Language | Thai / English i18n |

## Getting Started

### Prerequisites

- Node.js 18+
- Ollama (https://ollama.com)
- PostgreSQL 17 (optional — for full DB features)

### Installation

```bash
git clone https://github.com/nchonchareon/SkillShiftAI.git
cd SkillShiftAI
npm install
```

### Setup Ollama

```bash
# Install Ollama from https://ollama.com
# Then pull the model
ollama pull qwen3:1.7b

# Start Ollama server
ollama serve
```

### Setup Database (Optional)

```bash
# Install PostgreSQL 17, then:
psql -U postgres -c "CREATE DATABASE skillshiftai;"
psql -U postgres -d skillshiftai -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Push schema
npx prisma db push

# Seed data
npx prisma db seed
```

See `scripts/setup-db.md` for detailed instructions.

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout with Sidebar
│   ├── dashboard/page.tsx    # Dashboard with charts
│   ├── jobs/page.tsx         # AI job analysis (Guided Form)
│   ├── reskilling/page.tsx   # Skill transition pathways
│   ├── talent/page.tsx       # Employee talent pool
│   ├── analytics/page.tsx    # Quarterly trends
│   ├── insights/page.tsx     # AI insights dashboard
│   ├── document/page.tsx     # Blueprint document + PDF
│   ├── about/page.tsx        # System overview
│   ├── settings/page.tsx     # Configuration
│   └── api/
│       ├── ai/analyze/route.ts    # AI analysis endpoint
│       ├── jobs/route.ts          # Jobs CRUD
│       ├── reskilling/route.ts    # Reskilling data
│       └── talent/route.ts        # Talent pool data
├── components/
│   ├── Sidebar.tsx           # Responsive sidebar
│   └── MetricCard.tsx        # Reusable metric card
└── lib/
    ├── ai.ts                 # Ollama AI integration
    ├── i18n.tsx              # Thai/English translations
    └── prisma.ts             # Prisma client singleton
```

## AI Configuration

The app uses **Ollama** with **Qwen3 1.7B** model for local AI inference.

| Setting | Value |
|---------|-------|
| Model | `qwen3:1.7b` (1.4GB) |
| Temperature | 0.1 |
| Max tokens | 1024 |
| Inference time | ~3-5 seconds |

Change model in `.env.local`:
```
OLLAMA_MODEL=qwen3:1.7b
```

## Database Schema

Key models:
- **User** — บุคลากรในองค์กร
- **MasterSkill** — คลังทักษะมาตรฐาน
- **Job** — ตำแหน่งงาน
- **JobTask** — กิจกรรมย่อยของงาน
- **UserSkill** — ทักษะของผู้ใช้
- **JobSkill** — ทักษะที่ตำแหน่งงานต้องการ
- **AnalysisResult** — ผลการวิเคราะห์จาก AI

## License

MIT
