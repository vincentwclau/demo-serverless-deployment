// TODO: replace with your Railway deployment URL before going live
// const BASE_URL = 'https://xxxxxx.up.railway.app';
const BASE_URL = 'https://demo-serverless-deployment-production.up.railway.app';

async function getAllApplications(page = 0, size = 7) {
  const url = `${BASE_URL}/api/applications?page=${page}&size=${size}&sort=createdAt,desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function submitApplication(data) {
  const res = await fetch(`${BASE_URL}/api/application`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}
