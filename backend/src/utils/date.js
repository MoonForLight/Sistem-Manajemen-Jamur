const APP_TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Makassar';

function getTodayISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function normalizeISODate(value) {
  if (!value) return null;
  const normalized = String(value).split('T')[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

module.exports = { getTodayISO, normalizeISODate };
