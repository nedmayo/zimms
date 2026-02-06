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

## Deploy to Cloudflare Pages (static)

The site is fully static (HTML, CSS, JS only). No serverless functions or environment variables.

---

## Start fresh: put this site on a domain you own

Use this if you want to start clean on Cloudflare and serve the site on your own domain (e.g. `zimmprinting.com` or `www.zimmprinting.com`).

### Step 1 — Get the code on GitHub

If it isn’t already:

- Create a new repo on GitHub, push this project, and use a `main` branch.

### Step 2 — Create a Cloudflare account (if needed)

- Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up or log in.

### Step 3 — Create a new Pages project

1. In the sidebar: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Connect **GitHub** and choose the repo for this site.
3. On **Set up build and deploy**:
   - **Project name:** whatever you like (e.g. `zimms`).
   - **Production branch:** `main`.
   - **Framework preset:** None.
   - **Build command:** leave **empty**.
   - **Build output directory:** `./`
   - If you see **Deploy command** (or similar), leave it **empty**.
4. Click **Save and Deploy**. Wait for the first deploy to finish. The site will be live at `https://YOUR_PROJECT.pages.dev`.

### Step 4 — Add your domain in Pages

1. Open your **Pages** project in the dashboard.
2. Go to **Custom domains** → **Set up a custom domain**.
3. Enter the domain you want for this site, e.g.:
   - **Apex:** `yourdomain.com` (sometimes requires extra DNS setup), or  
   - **Subdomain:** `www.yourdomain.com` (simplest).
4. Click **Continue**. Cloudflare will show you what DNS record is needed (usually a **CNAME** and a target like `your-project.pages.dev`). Keep that tab open or copy the target.

### Step 5 — Point your domain at Cloudflare

Where you do this depends on **where your domain’s DNS is** (who hosts the nameservers).

**Option A — Your domain is already on Cloudflare**

- In Cloudflare: **Websites** → your domain → **DNS** → **Records**.
- Add the record Cloudflare Pages told you (e.g. CNAME `www` → `your-project.pages.dev`), or update the existing one.
- Save. Pages will verify the domain; SSL is automatic.

**Option B — Your domain is somewhere else (e.g. Bluehost, Namecheap, GoDaddy)**

- Log in at **that** provider and open **DNS** or **Domain management**.
- Add a **CNAME** record:
  - **Name / Host:** the part before your domain (e.g. `www` for `www.yourdomain.com`, or `@` / blank for apex if the provider supports it).
  - **Value / Points to:** the target Cloudflare gave you (e.g. `your-project.pages.dev`).
- Save. Back in Cloudflare Pages, finish **Set up custom domain** if it’s waiting for verification. DNS can take a few minutes to an hour.

### Step 6 — You’re done

- Once DNS has propagated, `https://yourdomain.com` (or `https://www.yourdomain.com`) will serve this site.
- Future updates: push to the `main` branch; Cloudflare will redeploy automatically.

**If you want both `yourdomain.com` and `www.yourdomain.com`:** Add both in **Custom domains** in the Pages project and set up the matching DNS records (often: CNAME `www` → Pages; apex can use CNAME flattening or a redirect from apex to `www`, depending on your DNS provider).

## Customization

You can easily customize:

- Colors by modifying the background-color values in `.shape-*` classes
- Text content in `index.html`
- Grid size by adjusting `background-size` in `.grid-overlay`
- Shape positions and sizes in the `.shape-*` classes
