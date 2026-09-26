# 🚀 Outbound Sales Agent SaaS Platform

[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E.svg?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> An autonomous outbound sales engine and campaign automation workspace designed for high-velocity B2B prospecting, lead enrichment, and automated sequence orchestration.

---

## ⚡ Overview

Traditional outbound tools are clunky, manually intensive, and disconnected from CRM data streams. **Sales Agent SaaS** bridges this gap by orchestrating end-to-end prospecting workflows:

1. **Lead Sourcing & Ingestion** — Batch import from CSV or direct CRM connectors.
2. **AI Personalization Layer** — Dynamic value propositions tailored to company vertical, funding round, and target persona.
3. **Multi-Channel Orchestration** — Coordinated scheduling across email and follow-up touchpoints.
4. **CRM Sync & Event Telemetry** — Full audit trail of delivered, opened, and converted prospects.

---

## 🏗 Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router                │
│    (Server Components, API Handlers, Client Views)     │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│     Supabase Auth     │       │     PostgreSQL DB     │
│  & Row Level Security │       │ (Leads, Runs, Events) │
└───────────────────────┘       └───────────────────────┘
```

- **Frontend & Server**: Next.js 14 App Router, React Server Components, TypeScript, Lucide Icons
- **Data Persistence**: Supabase (PostgreSQL), strict Row-Level Security (RLS) policies
- **Styling**: Tailwind CSS with custom glassmorphism design system

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+
- Supabase account & project keys

### Setup
```bash
git clone https://github.com/Jawknee-builds/sales-agent-saas.git
cd sales-agent-saas

npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the console.

---

## 🛡 Security & Schema
Database definitions and RLS policies are available under [`supabase_schema.sql`](./supabase_schema.sql).
