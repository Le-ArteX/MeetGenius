# MeetGenius 🎙️✨

**The AI-Powered Meeting OS for Modern Teams.**

MeetGenius transforms the way teams document, analyze, and act on their conversations. By combining high-speed AI inference with seamless workspace collaboration, MeetGenius turns messy meeting transcripts into actionable intelligence.

---

## 🌟 Platform Capabilities

### 🧠 Intelligent Analysis
- **AI Summarization**: Powered by **Groq (Llama 3.3 70B)**, generating comprehensive summaries, key decisions, and context-aware insights in milliseconds.
- **Deep Action Extraction**: Automatically identifies tasks and assignees from spoken conversation.
- **Multi-Source Ingestion**:
  - **Audio Transcription**: High-fidelity speech-to-text via **Groq Whisper v3**.
  - **Document Parsing**: Intelligent text extraction from PDF, DOCX, and TXT files.
  - **Direct Import**: Paste transcripts directly into the editor.

### 👥 Team Collaboration
- **Dynamic Workspaces**: Create shared environments for teams or projects.
- **Role-Based Access Control (RBAC)**: Manage permissions with `OWNER`, `EDITOR`, and `VIEWER` roles.
- **Invitation System**: Secure, token-based email invitations powered by **Brevo**.

### 💳 SaaS Infrastructure
- **Tiered Subscriptions**: Managed via **Lemon Squeezy**, supporting Free, Pro, and Enterprise tiers.
- **Real-time Billing Sync**: Automated plan provisioning through secure webhook integration.
- **Usage Enforcement**: Intelligent limits based on user plans (e.g., 5 notes/month for Free users).

---

## 🛠️ Technical Architecture

MeetGenius is a high-performance **Turborepo** monorepo designed for scale and developer experience.

- **Backend**: [NestJS](https://nestjs.com/) (Node.js) with [Prisma ORM](https://www.prisma.io/) and PostgreSQL.
- **Frontend**: [Next.js 15](https://nextjs.org/) (React 19) with Tailwind CSS.
- **AI Pipeline**: Custom Groq integration for Llama 3.3 and Whisper v3.
- **Email**: Brevo SMTP API for high-deliverability OTPs and invitations.

### 📂 Project Structure

```text
.
├── apps
│   ├── api          # NestJS Backend Service
│   ├── web          # Next.js Frontend Application
│   └── docs         # System Documentation
├── packages
│   ├── ui           # Shared React Component Library
│   ├── eslint-config # Centralized Linting Rules
│   └── typescript-config # Base TS Configurations
└── turbo.json       # Monorepo Orchestration
```

---

## 🏁 Global Getting Started

### Prerequisites
- Node.js v18+ & npm/pnpm
- PostgreSQL Database
- Groq API Key (AI features)
- Brevo API Key (Email features)
- Lemon Squeezy Store (Billing)

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
You must configure `.env` files in both major applications.

#### ⚙️ Backend Setup (`apps/api/.env`)
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/meetgenius"
JWT_SECRET="your_jwt_secret"

# AI Integration
GROQ_API_KEY="gsk_..."

# Email (Brevo)
BREVO_API_KEY="xkeysib-..."
EMAIL_FROM="MeetGenius <noreply@meetgenius.com>"

# Auth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
FRONTEND_URL="http://localhost:3000"

# Payments (Lemon Squeezy)
LEMONSQUEEZY_API_KEY="..."
LEMONSQUEEZY_STORE_ID="..."
LEMONSQUEEZY_PRO_VARIANT_ID="..."
LEMONSQUEEZY_ENTERPRISE_VARIANT_ID="..."
LEMONSQUEEZY_WEBHOOK_SECRET="..."
```

#### 🌐 Frontend Setup (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Database Migration
```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

### 4. Running the Platform
From the root directory:
```bash
npm run dev
```
- **Web**: `http://localhost:3000`
- **API**: `http://localhost:4000`

---

## 📡 API Reference & Modules

### Authentication
- `POST /auth/register`: Initialize OTP-based registration.
- `POST /auth/verify-otp`: Finalize registration or login.
- `GET /auth/google`: Initiate Google OAuth2 flow.
- `POST /auth/forgot-password`: Request password reset code.

### Meeting Notes
- `GET /notes`: List notes (pagination & workspace filtering).
- `POST /notes`: Create note with background AI processing.
- `POST /notes/upload`: Upload audio or documents for parsing.
- `GET /notes/:id`: Retrieve detailed note with AI insights.

### Workspaces & Collaboration
- `POST /workspaces`: Create a new team workspace.
- `POST /workspaces/:id/invitations`: Invite members via email.
- `PATCH /workspaces/:id/members/:userId/role`: Manage member permissions.

---

## 🔗 Webhooks & Billing

MeetGenius integrates with **Lemon Squeezy** to handle subscription lifecycle events.

- **Webhook Endpoint**: `POST /bill/webhook`
- **Security**: Verified using `x-signature` header and `LEMONSQUEEZY_WEBHOOK_SECRET`.
- **Supported Events**:
  - `subscription_created`: Provisioning access and updating user plan.
  - `subscription_updated`: Handling plan changes and cancellations.

---

## 🎨 Frontend Design & UI

### 📊 Dashboard Features
- **Unified Overview**: Recent personal and workspace notes.
- **AI Insights Sidebar**: Real-time summaries and action items.
- **Rich Editor**: Optimized for transcript review and task tracking.
- **PDF Export**: Download high-quality PDF summaries.

### 🎨 Design Philosophy
- **Rich Aesthetics**: Deep HSL-tailored color palettes and sophisticated gradients.
- **Glassmorphism**: Elegant translucent UI elements.
- **Keyboard-First**: Global shortcuts for power users.

---

## 📜 Available Scripts

- `npm run dev`: Start all apps in development mode.
- `npm run build`: Build all apps and packages for production.
- `npm run lint`: Lint all files in the monorepo.
- `npm run test`: Run tests across the workspace.

---

## 📄 License

This project is licensed under the [UNLICENSED](LICENSE) license. All rights reserved.

Developed with ❤️ by Mursalin Leon
