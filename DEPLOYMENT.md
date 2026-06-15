# Deployment Guide

Deploy in this order — each step depends on the one before it:

```
1. Supabase   →   create the database
2. Railway    →   deploy the backend (needs Supabase credentials)
3. Vercel     →   deploy the frontend (needs Railway URL)
```

---

## 1. Supabase — Database

### 1.1 Create a project

1. Sign in at [supabase.com](https://supabase.com) and click **New project**
2. Choose an organisation, set a project name (e.g. `seminar-db`), and enter a strong **Database Password** — Admin1234$5%6^
3. Select the region closest to your Railway deployment (e.g. Singapore)
4. Click **Create new project** and wait ~2 minutes for provisioning

### 1.2 Get the connection parameters

1. In the left sidebar go to **Settings → Database**
2. Scroll to **Connection parameters** and note the following:

| Variable | Where to find it |
|----------|-----------------|
| `DB_HOST` | **Host** field — e.g. `db.abcdefghij.supabase.co` |
| `DB_PORT` | **Port** — `5432` (direct connection, not the pooler) |
| `DB_NAME` | **Database name** — `postgres` |
| `DB_USERNAME` | **User** — `postgres` |
| `DB_PASSWORD` | The password you set in step 1.2 |

> **Note:** Use port `5432` (direct connection), not `6543` (pooler). Railway runs a persistent JVM process so a direct connection is appropriate.

The schema (`applications` table) is created automatically on first boot via `spring.jpa.hibernate.ddl-auto=update` — no SQL scripts needed.

---

## 2. Railway — Backend

### 2.1 Create a Railway project

1. Sign in at [railway.app](https://railway.app) and click **New Project**
2. Choose **Deploy from GitHub repo** and authorise Railway to access your repository
3. Select this repository from the list

### 2.2 Set the root directory

Railway will try to build from the repo root. Since the Spring Boot app lives in `backend/`:

1. Click on the service that was created
2. Go to **Settings → Source**
3. Set **Root Directory** to `backend`
4. Railway (Nixpacks) will auto-detect the Maven project and build with `mvn package`

### 2.3 Add environment variables

1. In the service, go to **Variables**
2. Add each variable individually:

| Variable | Value |
|----------|-------|
| `DB_HOST` | from Supabase (step 1.2) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `postgres` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | your Supabase database password |

> `PORT` is injected by Railway automatically — do not set it manually.

### 2.4 Deploy and verify

1. Railway triggers a deployment automatically after saving variables
2. Watch the **Deploy Logs** tab — a successful start looks like:
   ```
   Started SeminarBackendApplication in X.XXX seconds
   ```
3. Once running, go to **Settings → Networking** and click **Generate Domain** to get a public URL (e.g. `https://seminar-backend-production.up.railway.app`)
4. Verify the health endpoint:
   ```
   GET https://<your-railway-url>/actuator/health
   → {"status":"UP"}
   ```
5. Test the applications endpoint:
   ```
   GET https://<your-railway-url>/api/applications
   → {"content":[],"totalPages":0,"totalElements":0,...}
   ```

---

## 3. Vercel — Frontend

### 3.1 Update the backend URL

Before deploying, update `BASE_URL` in `frontend/js/api.js` with your Railway domain from step 2.4:

```js
// frontend/js/api.js
const BASE_URL = 'https://<your-railway-url>.up.railway.app';
```

Commit and push this change to your repository.

### 3.2 Create a Vercel project

1. Sign in at [vercel.com](https://vercel.com) and click **Add New → Project**
2. Import your GitHub repository
3. Under **Root Directory**, click **Edit** and select `frontend`
4. Framework Preset: leave as **Other** (plain static site — no build step)
5. Build & Output settings: leave everything blank
6. Click **Deploy**

### 3.3 Verify the deployment

1. Vercel provides a live URL once the deployment finishes (e.g. `https://seminar-frontend.vercel.app`)
2. Open the URL — the landing page should load and show an empty applications table
3. Click **Apply Now**, fill in the form, and submit
4. You should be redirected back to the landing page and see your submission appear in the table

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Railway build fails | Wrong root directory | Set Root Directory to `backend` in Railway Settings → Source |
| `Connection refused` on startup | Wrong DB credentials | Double-check all five `DB_*` variables in Railway |
| SSL error connecting to Supabase | Missing SSL param | Ensure `application.properties` has `?sslmode=require` in the JDBC URL |
| Frontend shows "Failed to load" | Wrong `BASE_URL` | Update `frontend/js/api.js` and redeploy to Vercel |
| CORS error in browser console | Missing CORS header | Confirm `CorsConfig.java` is present and the backend redeployed successfully |
| Form submits but no data appears | Pagination or stale data | Refresh the landing page; check the Railway logs for errors |
