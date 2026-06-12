# IRIR Research Portal

A modern research project management and collaboration platform built with Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## ✨ Features

- **Two roles:** Lecturer (create/manage projects) & Collaborator (view/comment)
- **Project management:** Create, edit, delete, and track research projects
- **Document sharing:** Upload PDFs, DOCX, and images via Cloudinary
- **Comments:** Discussion section on every project
- **Team management:** Invite collaborators by email
- **Authentication:** Secure email/password login with NextAuth v5

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd irir-research-portal
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
DATABASE_URL="postgresql://..."        # From Neon.tech (free) or local PostgreSQL
NEXTAUTH_SECRET="..."                   # Run: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="..."            # From cloudinary.com (free tier)
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 3. Setup Database

```bash
npx prisma db push       # Create tables
npm run db:seed          # Add demo data (optional)
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo accounts (after seeding):**
- Lecturer: `lecturer@irir.ac.ke` / `password123`
- Collaborator: `collaborator@irir.ac.ke` / `password123`

---

## 🗄️ Database Setup Options

### Option A: Neon.tech (Free, Recommended)
1. Go to [neon.tech](https://neon.tech) → Create free account
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### Option B: Local PostgreSQL
```bash
createdb irir_db
# DATABASE_URL="postgresql://localhost:5432/irir_db"
```

---

## ☁️ Cloudinary Setup (Free)
1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `.env`

---

## 🚢 Deploy to Render

### Method 1: render.yaml (Automatic)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo
4. Render will read `render.yaml` and set up everything
5. Add your Cloudinary env vars manually in Render dashboard

### Method 2: Manual Deploy
1. Go to Render → New Web Service → Docker
2. Connect GitHub repo
3. Add environment variables:
   - Create a PostgreSQL database on Render first
   - `DATABASE_URL` → from Render PostgreSQL
   - `NEXTAUTH_SECRET` → generate random string
   - `NEXTAUTH_URL` → your Render app URL
   - `CLOUDINARY_*` → from Cloudinary dashboard
4. After first deploy, run migrations:
   ```bash
   # In Render shell
   npx prisma migrate deploy
   ```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth + Register
│   │   ├── projects/      # CRUD + collaborators
│   │   ├── documents/     # Upload + delete
│   │   └── comments/      # Post + delete
│   ├── dashboard/         # Protected pages
│   │   ├── page.tsx       # Dashboard home
│   │   ├── projects/      # Project list + detail + edit
│   │   └── profile/       # User profile
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── forgot-password/   # Password reset
├── components/
│   ├── layout/            # Sidebar, TopBar
│   ├── projects/          # Project components
│   ├── documents/         # Document components
│   └── comments/          # Comment components
├── lib/
│   ├── prisma.ts          # Database client
│   ├── cloudinary.ts      # File upload
│   └── utils.ts           # Helpers
├── types/                 # TypeScript types
└── auth.ts                # NextAuth config
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | Full-stack React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| PostgreSQL | Database |
| Prisma | ORM |
| NextAuth v5 | Authentication |
| Cloudinary | File storage |
| Zod | Validation |
| bcryptjs | Password hashing |

---

## 📝 User Roles

### Lecturer
- Create, edit, delete projects
- Upload and delete documents
- Invite/remove collaborators
- Post and delete their comments

### Collaborator
- View assigned projects
- Download documents
- Post and delete their comments
