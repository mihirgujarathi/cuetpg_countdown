# 💜 CUET PG Countdown — BTS ARMY Edition

A cozy, BTS-themed countdown website for CUET PG 2026 (6th March).  
Features: shuffling backgrounds · rotating quotes · lo-fi audio starting at a random time.

---

## 🚀 Quick Start (First Time Setup)

### 1. Install Node.js
Download from https://nodejs.org/ (version 18 or 20 recommended).

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000 to see your site.

---

## 🖼️ Adding Your Background Images

1. Drop your image files into the `public/backgrounds/` folder.
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended resolution: at least 1920×1080px
   - Any number of images works!

2. Open `app/page.tsx` and find this line near the top:
   ```ts
   const BG_IMAGES: string[] = [];
   ```
   
3. Add your filenames inside the array:
   ```ts
   const BG_IMAGES: string[] = ["bg1.jpg", "cozy-room.jpg", "taehyung.jpg"];
   ```

Backgrounds will shuffle automatically every 20 seconds. ✨

---

## 🎵 Adding Your Audio File

1. Place your audio file in `public/audio/` and rename it to `lofi.mp3`
   - If your file is `.mp4` or `.wav`, convert it to `.mp3` first (use https://cloudconvert.com)
   
2. Open `app/page.tsx` and verify this constant matches your track duration:
   ```ts
   const AUDIO_DURATION_SECONDS = 27 * 60; // 27 minutes
   ```
   
   If your track is a different length (e.g., 32 minutes), change it to:
   ```ts
   const AUDIO_DURATION_SECONDS = 32 * 60;
   ```

The audio will start playing from a **random point** in the track each time — no two visits will sound the same! Users click the ▶ button in the bottom-right to play.

---

## 💬 Editing Quotes

Open `public/quotes.json`. Each quote looks like:
```json
{
  "text": "Life goes on. Even if you can't hold on, it's okay.",
  "source": "BTS – Life Goes On"
}
```

Add, remove, or edit quotes freely. The site will shuffle them randomly. 💜

---

## 🌐 Deploying to GitHub Pages

### Step 1 — Create a GitHub repository
1. Go to https://github.com/new
2. Name it anything (e.g., `cuet-countdown`)
3. Keep it Public
4. **Don't** initialise with a README (your files will be pushed)

### Step 2 — Update your repo name in two places

**In `next.config.ts`:**
```ts
basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
```
This is handled automatically by the GitHub Action below.

**In `.github/workflows/deploy.yml`:**
Find this line and replace `cuet-countdown` with your actual repo name:
```yaml
NEXT_PUBLIC_BASE_PATH: /cuet-countdown   # ← change this
```

### Step 3 — Push your code
```bash
git init
git add .
git commit -m "💜 Initial commit — CUET countdown"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### Step 5 — Wait for deploy (~2 minutes)
Go to the **Actions** tab in your repo. You'll see the workflow running.  
Once it's green ✅, your site is live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## 🔧 Customising

| What | Where |
|------|-------|
| Exam date | `app/page.tsx` → `EXAM_DATE` |
| Quote rotation speed | `app/page.tsx` → `QUOTE_INTERVAL_MS` |
| Background rotation speed | `app/page.tsx` → `BG_INTERVAL_MS` |
| Quotes list | `public/quotes.json` |
| Colors | `app/globals.css` → `:root` variables |
| Audio file name | `public/audio/lofi.mp3` |

---

## 💜 Notes

- Audio won't autoplay until the user clicks ▶ (browser security policy — this is normal)
- The site works offline once loaded
- For best performance, compress images to under 500KB each (use https://squoosh.app)
