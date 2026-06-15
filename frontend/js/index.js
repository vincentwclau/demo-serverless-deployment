const PAGE_SIZE = 7;
let currentPage = 0;

async function loadApplications(page) {
  const stateEl = document.getElementById('table-state');
  const tableEl = document.getElementById('applications-table');
  const pagEl   = document.getElementById('pagination');

  stateEl.innerHTML = '<div class="spinner"></div>Loading applications…';
  stateEl.style.display = 'block';
  tableEl.style.display = 'none';
  pagEl.innerHTML = '';

  try {
    const data = await getAllApplications(page, PAGE_SIZE);
    const { content, totalPages, number, totalElements } = data;

    if (totalElements === 0) {
      stateEl.innerHTML = 'No applications yet. <a href="apply.html" style="color:var(--navy);font-weight:600">Be the first to apply →</a>';
      return;
    }

    stateEl.style.display = 'none';
    tableEl.style.display = 'table';

    const tbody = document.getElementById('table-body');
    tbody.innerHTML = content.map((app, i) => `
      <tr>
        <td>${number * PAGE_SIZE + i + 1}</td>
        <td class="td-name">${esc(app.fullName)}</td>
        <td class="td-email">${esc(app.email)}</td>
        <td><span class="badge badge-session">${esc(app.seminarSession)}</span></td>
        <td>${esc(app.industry || '—')}</td>
        <td>${fmtDate(app.createdAt)}</td>
      </tr>
    `).join('');

    renderPagination(number, totalPages, pagEl);
  } catch (err) {
    stateEl.textContent = 'Failed to load applications. Please refresh the page.';
    console.error(err);
  }
}

function renderPagination(current, total, container) {
  if (total <= 1) return;

  const parts = [];

  const prev = `<button class="page-btn page-arrow" ${current === 0 ? 'disabled' : ''} data-page="${current - 1}">&larr; Prev</button>`;
  parts.push(prev);

  const start = Math.max(0, current - 2);
  const end   = Math.min(total - 1, current + 2);

  if (start > 0) {
    parts.push(pageBtn(0, current));
    if (start > 1) parts.push('<span class="page-btn page-ellipsis">&hellip;</span>');
  }

  for (let p = start; p <= end; p++) parts.push(pageBtn(p, current));

  if (end < total - 1) {
    if (end < total - 2) parts.push('<span class="page-btn page-ellipsis">&hellip;</span>');
    parts.push(pageBtn(total - 1, current));
  }

  const next = `<button class="page-btn page-arrow" ${current >= total - 1 ? 'disabled' : ''} data-page="${current + 1}">Next &rarr;</button>`;
  parts.push(next);

  container.innerHTML = parts.join('');
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page, 10);
      loadApplications(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function pageBtn(p, current) {
  return `<button class="page-btn ${p === current ? 'active' : ''}" data-page="${p}">${p + 1}</button>`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-HK', { day: '2-digit', month: 'short', year: 'numeric' });
}

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('DOMContentLoaded', () => loadApplications(0));
