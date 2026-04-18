# Antaryami Roul — CLI Portfolio

> An interactive terminal-style portfolio built with Next.js 14, TypeScript, and CSS Modules.
> Visitors explore your profile by typing commands — just like a real CLI.

---

## 🚀 Live Demo

Deploy instantly to [Vercel](https://vercel.com) — see deployment steps below.

---

## ✨ Features

- **Boot sequence** animation on first load
- **Full CLI experience** — type commands to navigate pages
- **Tab autocomplete** for commands
- **Command history** — press ↑ / ↓ to cycle through previous inputs
- **Quick-access buttons** for mobile / mouse users
- **Live clock** in the status bar
- **Scanline + CRT vignette** overlay for authentic terminal feel
- **Responsive** — works on mobile and desktop
- **Zero dependencies** beyond Next.js + Framer Motion

---

## 🖥️ Commands

| Command           | Description                     |
|-------------------|---------------------------------|
| `help`            | Show all available commands     |
| `about`           | About Antaryami                 |
| `skills`          | Technical skills                |
| `experience`      | Work experience                 |
| `education`       | Education history               |
| `projects`        | Portfolio projects with links   |
| `certifications`  | Courses & certifications        |
| `contact`         | Contact information             |
| `socials`         | Social links                    |
| `whoami`          | Current user info               |
| `ls`              | List all pages                  |
| `pwd`             | Print working directory         |
| `date`            | Show current date & time        |
| `banner`          | Show welcome banner             |
| `clear`           | Clear terminal (or Ctrl+L)      |

**Aliases:** `exp` = experience, `edu` = education, `work` = projects, `certs` = certifications

---

## 🛠️ Local Development

```bash
# 1. Clone or unzip the project
cd antaryami-portfolio

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## 📦 Project Structure

```
src/
├── app/
│   ├── layout.tsx       ← Root layout + metadata + fonts
│   └── page.tsx         ← Home page (renders Terminal)
├── components/
│   ├── Terminal.tsx      ← Main interactive terminal component
│   ├── Terminal.module.css
│   └── LiveClock.tsx     ← Real-time clock in status bar
├── lib/
│   ├── data.ts           ← All portfolio content (edit this!)
│   ├── commands.ts       ← Command parser & output formatter
│   └── banner.ts         ← ASCII art banner
└── styles/
    └── globals.css       ← Global CSS variables & animations
```

---

## ✏️ Customization

**All your content lives in one file:** `src/lib/data.ts`

Edit the `portfolioData` object to update:
- Name, title, contact info
- Skills list
- Work experience & projects
- Education & certifications

**Add new commands:** Edit `src/lib/commands.ts` — add a new `case` in the `switch` statement and a corresponding format function.

**Change colors:** Edit CSS variables in `src/styles/globals.css`:
```css
:root {
  --green: #39ff14;    /* primary accent */
  --cyan: #00ffcc;     /* links */
  --amber: #ffb800;    /* warnings / path */
}
```

---

## 🚀 Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Click **Deploy** — done!

No extra config needed. `vercel.json` is already included.

---

## 📱 Mobile Support

On mobile, the quick-access buttons at the top allow navigation without a keyboard. The ASCII banner auto-scales down for small screens.

---

## 📄 License

MIT — free to use, modify, and deploy.
