# Zimmerman's Dry Goods Website

A modern, artistic website redesign for Zimmerman's Dry Goods featuring a dark green background with colorful torn paper-like shapes.

## Features

- Modern grid-based layout
- Colorful torn paper shapes with organic edges
- Responsive design
- Smooth animations and hover effects
- Clean, minimalist navigation

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and layout
- `script.js` - Interactive animations and effects

## Usage

Simply open `index.html` in a web browser to view the site.

## Order form & Cloudflare setup (step-by-step)

The form **only works after the site is deployed to Cloudflare Pages** — it posts to `/api/submit`, which is provided by a Cloudflare Pages Function. Locally or on GitHub Pages there is no such endpoint, so submissions will fail until you complete the steps below.

You only need **Cloudflare Pages** (no separate Workers project). Pages hosts your static site and runs the `functions/` code automatically.

### 1. Push your code to GitHub

If the project isn’t already in a GitHub repo, create one and push:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Sign in to Cloudflare

Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in (or create a free account).

### 3. Create a Pages project from Git

1. In the left sidebar, open **Workers & Pages**.
2. Click **Create application** → **Pages** → **Connect to Git**.
3. Click **Connect with GitHub** and authorize Cloudflare to see your repos.
4. Choose the **repository** for this project (e.g. `zimms` or whatever you named it).
5. Click **Begin setup**.

### 4. Configure the build (static site, no framework)

- **Project name** — e.g. `zimms` or `zimmermans-dry-goods`.
- **Production branch** — `main` (or whatever branch you use).
- **Build settings:**
  - **Framework preset:** `None` (this is a static site, no Node/React build).
  - **Build command:** leave empty (or delete any default).
  - **Build output directory:** `./` (the repo root is the output; `index.html` is at the root).

Click **Save and Deploy**. The first deploy may take a minute. Your site will be at `https://YOUR_PROJECT.pages.dev`.

### 5. Add environment variables (for the form email)

1. In the Pages project, go to **Settings** → **Environment variables**.
2. Under **Production** (and **Preview** if you want form submissions on preview URLs), add:

   | Variable     | Value                    | Encrypt (optional) |
   | ------------ | ------------------------ | ------------------ |
   | `TO_EMAIL`   | `zimmdrygoods@gmail.com` | No                 |
   | `FROM_EMAIL` | `onboarding@resend.dev`  | No                 |

   (The Resend API key is currently hardcoded in `functions/api/submit.js`; you can move it to a `RESEND_API_KEY` env var later for security.)

3. Click **Save**. Redeploy once so the new variables apply: **Deployments** → **…** on the latest deployment → **Retry deployment** (or push a small commit).

### 6. Test the form

Open `https://YOUR_PROJECT.pages.dev`, go to **Contact/Order**, fill out and submit the form. You should see a success message and receive an email at `zimmdrygoods@gmail.com` with Reply-To set to the submitter’s email.

### Deploy commands

- **If the project is connected to Git (recommended):** Pushing to the production branch deploys automatically.

  ```bash
  git add .
  git commit -m "Your message"
  git push
  ```

- **Deploy from the command line (no push):** Use the Cloudflare CLI from the project root. The project must already exist (e.g. you created it via "Connect to Git" in the dashboard).

  ```bash
  npx wrangler pages deploy . --project-name=YOUR_PROJECT_NAME
  ```

  First time: run `npx wrangler login` and sign in in the browser. Replace `YOUR_PROJECT_NAME` with the project name you gave in Cloudflare (e.g. `zimms`). This uploads the current directory (including `functions/`) to Pages.

### Using new.zimmprinting.com (staging URL while main site is on Bluehost)

You can serve this new site at **new.zimmprinting.com** and keep **zimmprinting.com** on Bluehost until you’re ready to switch over.

1. **In Cloudflare Pages**  
   In your Pages project: **Custom domains** → **Set up a custom domain**.  
   Enter **`new.zimmprinting.com`** and continue.  
   Cloudflare will show you a **CNAME** target (e.g. `your-project.pages.dev`). Copy it.

2. **In Bluehost (where zimmprinting.com DNS lives)**  
   Open DNS / Domain settings for **zimmprinting.com** and add a **CNAME** record:
   - **Name / Host:** `new` (so the full hostname is `new.zimmprinting.com`)
   - **Points to / Value:** the CNAME target from Cloudflare (e.g. `your-project.pages.dev`)
   - **TTL:** default is fine (e.g. 14400 or 1 hour)

   Save. Leave all other records (A, CNAME for www, etc.) unchanged so the main site stays on Bluehost.

3. **Back in Cloudflare Pages**  
   Finish the custom domain setup (e.g. confirm/verify). SSL is automatic.  
   After DNS propagates (a few minutes to an hour), **https://new.zimmprinting.com** will serve this Pages site; **zimmprinting.com** and **www.zimmprinting.com** keep pointing to Bluehost until you change them later.

## Customization

You can easily customize:

- Colors by modifying the background-color values in `.shape-*` classes
- Text content in `index.html`
- Grid size by adjusting `background-size` in `.grid-overlay`
- Shape positions and sizes in the `.shape-*` classes
