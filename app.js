// ── Gallery rendering ────────────────────────────────────────────────────────
async function renderGallery(tab) {
  const gallery = document.querySelector(`#${tab} .gallery`);
  gallery.innerHTML = '';

  try {
    const res = await fetch(`/api/images/${tab}`);
    const images = await res.json();

    images.forEach(({ src, alt }) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.addEventListener('click', () => openLightbox(src, alt));

      item.appendChild(img);
      gallery.appendChild(item);
    });
  } catch (err) {
    console.error('Failed to load images:', err);
  }
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.gallery-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.dataset.tab;
    document.getElementById(id).classList.add('active');
    renderGallery(id);
  });
});

// ── Lightbox ─────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderGallery('doodle');
