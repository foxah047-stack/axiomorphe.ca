// ── LANGUAGE SYSTEM ──
// Global functions so onclick in HTML can call them directly

function detectLang() {
  const saved = localStorage.getItem('cgbvrr-lang');
  if (saved === 'en' || saved === 'fr') return saved;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return browser === 'fr' ? 'fr' : 'en';
}

function applyLang(lang) {
  // Show matching lang, hide other
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
  });
  // Update button label
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = lang === 'en' ? 'FR' : 'EN';
  // Save preference
  localStorage.setItem('cgbvrr-lang', lang);
}

function toggleLang() {
  const current = localStorage.getItem('cgbvrr-lang') || detectLang();
  applyLang(current === 'en' ? 'fr' : 'en');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {

  // Apply detected/saved language immediately
  applyLang(detectLang());

  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // ── LEAFLET MAP ──
  if (!document.getElementById('watershed-map')) return;

  const map = L.map('watershed-map', {
    center: [47.9, -66.8],
    zoom: 8,
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 14
  }).addTo(map);

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.7);box-shadow:0 0 8px ${color}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  }

  // Monitoring stations
  [
    [47.85, -66.72, 'Campbellton — HQ & Main Station'],
    [47.95, -67.30, 'Kedgwick River Station'],
    [47.72, -66.95, 'Upsalquitch Confluence'],
    [48.12, -67.55, 'Matapédia River Station'],
    [47.90, -67.10, 'Little Main Restigouche'],
  ].forEach(([lat, lng, name]) => {
    L.marker([lat, lng], { icon: makeIcon('#4a9baf') })
      .addTo(map)
      .bindPopup(`<strong style="color:#2e6b7a">${name}</strong><br><small>Monitoring station</small>`);
  });

  // Restoration sites
  [
    [48.05, -67.20, 'WATERSHADE — Thermal Refuge Site A'],
    [47.80, -67.00, 'Sediment Reduction — Kedgwick'],
    [47.95, -66.85, 'Riparian Buffer Restoration'],
  ].forEach(([lat, lng, name]) => {
    L.marker([lat, lng], { icon: makeIcon('#6fcf97') })
      .addTo(map)
      .bindPopup(`<strong style="color:#2d7a4a">${name}</strong><br><small>Restoration site</small>`);
  });

  // First Nations
  [
    [48.05, -66.62, "Listuguj Mi'gmaq Government"],
    [48.00, -66.40, 'Eel River Bar First Nation'],
  ].forEach(([lat, lng, name]) => {
    L.marker([lat, lng], { icon: makeIcon('#e2b96f') })
      .addTo(map)
      .bindPopup(`<strong style="color:#a07820">${name}</strong><br><small>First Nations community partner</small>`);
  });

  // Salmon pools
  [
    [47.88, -66.60, 'Lower Restigouche — Critical Pool'],
    [47.78, -67.15, 'Kedgwick Spawning Area'],
    [48.10, -67.40, 'Upper Matapédia Pool'],
  ].forEach(([lat, lng, name]) => {
    L.marker([lat, lng], { icon: makeIcon('#eb5757') })
      .addTo(map)
      .bindPopup(`<strong style="color:#c0392b">${name}</strong><br><small>Priority salmon habitat</small>`);
  });

  // Watershed polygon
  L.polygon([
    [48.30,-67.80],[48.15,-67.90],[48.00,-68.00],
    [47.85,-67.70],[47.70,-67.50],[47.55,-67.20],
    [47.50,-66.90],[47.60,-66.50],[47.75,-66.30],
    [48.00,-66.20],[48.20,-66.40],[48.35,-66.70],
    [48.40,-67.20],[48.30,-67.80]
  ], {
    color: '#4a9baf', fillColor: '#2e6b7a',
    fillOpacity: 0.12, weight: 1.5, dashArray: '4 6'
  }).addTo(map).bindPopup('<strong>Restigouche Watershed</strong><br>~10,000 km² — NB & QC');

}); // end DOMContentLoaded
