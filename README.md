# 🚨 RapidCR — Community Crisis Intelligence Platform

> **Google Solution Challenge 2026** · SDG 3 — Good Health & Well-being

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rapidcr.vercel.app-red)](https://rapidcr.vercel.app)
[![SDG 3](https://img.shields.io/badge/UN%20SDG-3%20Good%20Health-4CAF50)](https://sdgs.un.org/goals/goal3)
[![Powered by Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-blueviolet)](https://groq.com)

---

## 🌍 The Problem

Every year, delayed emergency response in public venues — schools, clinics, community centres, hotels — leads to preventable deaths and injuries. First responders on the ground often lack real-time decision support: who do I send? What protocol do I follow? How do I document this?

**RapidCR addresses SDG Target 3.d** — strengthening the capacity of all countries, particularly developing countries, for early warning, risk reduction, and management of national and global health risks.

---

## 💡 The Solution

RapidCR is an AI-powered crisis management platform that gives venue coordinators:

- **Real-time incident dashboard** — live alerts, responder tracking, zone status
- **AI Triage Engine** — powered by Groq (LLaMA 3.3 70B), analyzes incident type, location, and severity to assign responders and generate step-by-step protocols in seconds
- **AI Report Generator** — produces insurance-ready, compliance-grade incident reports automatically
- **Interactive floor plan** — visual responder routing with evacuation overlays
- **Secure backend** — API key never exposed to the browser; all AI calls proxied server-side

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| AI Backend | Vercel Edge Functions (Node.js) |
| AI Model | Groq API — LLaMA 3.3 70B Versatile |
| Hosting | Vercel |
| Version Control | GitHub |

---

## 🚀 Getting Started

### Prerequisites
- A [Groq API key](https://console.groq.com) (free)
- A [Vercel account](https://vercel.com) (free)

### Deploy in 3 steps

**1. Fork & clone this repo**
```bash
git clone https://github.com/srushtibabar/rapidcr.git
cd rapidcr
```

**2. Deploy to Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Import your forked GitHub repo
- Add environment variable:
  ```
  GROQ_API_KEY = your_groq_key_here
  ```
- Click Deploy ✅

**3. Done.** Your live URL is ready. No local setup needed.

---

## 📁 Project Structure

```
rapidcr/
├── index.html          # Full frontend — dashboard, triage, reports
├── api/
│   └── ai.js           # Vercel Edge Function — secure Groq proxy
├── vercel.json         # Routing + cache config
└── README.md
```

---

## 🔐 Security

- The Groq API key is stored as a Vercel environment variable — **never in the browser**
- All AI requests are validated and rate-limited server-side
- Prompts are sanitised and capped at 4000 characters

---

## 🎯 SDG 3 Impact

| SDG Target | How RapidCR Helps |
|-----------|-------------------|
| 3.4 — Reduce premature mortality | Faster AI-assisted emergency response reduces critical response time |
| 3.6 — Road traffic injuries | Applicable to venue accidents and mass casualty events |
| 3.d — Health risk management | Structured triage + compliance documentation strengthens institutional capacity |

---

## 👩‍💻 About

Built solo by **Srushti Babar** for Google Solution Challenge 2026.

> *"The goal is to make AI-assisted crisis response accessible to any venue coordinator — not just large hospitals or enterprises."*

---

## 📄 License

MIT — free to use, fork, and build upon.
