# ✦ ATS Resume Builder (Free Version)

AI-powered resume tailoring — no payments, no signup, just paste and generate.

---

## What you need

Only **one thing**: an Anthropic API key.

---

## Step 1 — Get your Anthropic API key

1. Go to **https://console.anthropic.com**
2. Sign up for a free account
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"**
5. Copy the key — it looks like: `sk-ant-api03-xxxxxx...`

---

## Step 2 — Set up the project

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
# Rename ".env.local.example" to ".env.local"
# Then open .env.local and paste your key:

ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx

# 3. Run the app locally
npm run dev
```

Open **http://localhost:3000** in your browser. That's it!

---

## Step 3 — Deploy to Vercel (Free hosting)

### Option A — Deploy via GitHub (easiest)

```bash
# Push code to GitHub
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/ats-resume-builder.git
git push -u origin main
```

Then:
1. Go to **https://vercel.com** → sign up free
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Under **"Environment Variables"**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from Step 1
5. Click **Deploy**

Your app is now live at `https://your-project.vercel.app` 🎉

### Option B — Deploy via Vercel CLI

```bash
npm install -g vercel
vercel --prod
# It will ask for your env variable — paste your Anthropic key
```

---

## How it works

```
User uploads PDF + pastes job description
        ↓
Browser sends to /api/generate  (your server)
        ↓
Server reads your ANTHROPIC_API_KEY  (never exposed to users)
        ↓
Calls Claude AI → returns tailored resume JSON
        ↓
Browser renders resume → user downloads PDF
```

The API key **never reaches the user's browser**. It stays safely on the server.

---

## Project files

```
├── app/
│   ├── page.tsx               ← Main UI (upload + generate + preview)
│   ├── layout.tsx             ← HTML wrapper
│   ├── globals.css            ← Styles + print styles
│   └── api/generate/route.ts  ← Secure AI proxy (key lives here)
├── components/
│   └── ResumePreview.tsx      ← Resume layout component
├── lib/
│   ├── generateResume.ts      ← Claude AI call
│   └── types.ts               ← TypeScript types
├── .env.local.example         ← Copy this → .env.local
└── README.md
```

---

## Want to add payments later?

When you're ready to monetize, ask to add Razorpay integration.
It takes about 30 minutes to set up.
