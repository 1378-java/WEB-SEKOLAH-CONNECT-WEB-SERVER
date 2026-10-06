// SMK Kriya Sahid Sukoharjo - Main JS
// Development by ARGA - 2026

document.addEventListener('DOMContentLoaded', function () {
  const html = document.documentElement;

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hide');
    }, 900);
  });
  // Fallback if load already fired
  setTimeout(() => { if (preloader) preloader.classList.add('hide'); }, 2500);

  // ===== THEME TOGGLE =====
  const themeBtn = document.getElementById('themeBtn');
  const themeBtnDesktop = document.getElementById('themeBtnDesktop');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }
  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (themeBtnDesktop) themeBtnDesktop.addEventListener('click', toggleTheme);

  // ===== SCROLL PROGRESS =====
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
  });

  // ===== TYPING EFFECT =====
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'Sekolah Seni Berbasis Teknologi',
    'Kriya Kayu • Batik • Multimedia • TKJ',
    'Siap Kerja • Siap Kuliah • Siap Usaha',
    'SMK Kriya Sahid Sukoharjo'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    if (!typingEl) return;
    const current = phrases[phraseIndex];
    if (!deleting) {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeEffect, 1800);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeEffect, deleting ? 35 : 70);
  }
  setTimeout(typeEffect, 600);

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    document.querySelectorAll('.num[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const start = performance.now();
      function update(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(update);
    });
  }
  let countersDone = false;
  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersDone) {
        countersDone = true;
        animateCounters();
      }
    }, { threshold: 0.4 });
    obs.observe(statsBar);
  }

  // ===== SIDEBAR =====
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebarFn() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFn);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarFn);
  sidebarLinks.forEach(l => l.addEventListener('click', closeSidebarFn));

  // ===== FADE-IN =====
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => fadeObs.observe(el));

  // ===== BACK TO TOP + MOBILE CTA =====
  const backTop = document.getElementById('backTop');
  const mobileCta = document.getElementById('mobileCta');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (backTop) {
      if (y > 400) backTop.classList.add('visible');
      else backTop.classList.remove('visible');
    }
    if (mobileCta) {
      if (y > 500) mobileCta.classList.add('show');
      else mobileCta.classList.remove('show');
    }
  });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.galeri-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // ===== MODAL JURUSAN =====
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const jurusanData = {
    kayu: {
      title: 'Kriya Kreatif Kayu & Rotan',
      content: `<p>Jurusan unggulan yang membekali siswa dengan keterampilan membuat produk mebel, ukiran, dan kerajinan kayu/rotan berkualitas industri.</p>
        <p><strong>Kompetensi yang dipelajari:</strong></p>
        <ul><li>Teknik kerja bangku & ukir</li><li>Pengoperasian mesin kayu</li><li>Finishing & finishing khusus</li><li>Desain produk kriya berbasis komputer</li><li>Produk kreatif & kewirausahaan</li></ul>
        <p>Lulusan siap bekerja di industri furniture, menjadi pengrajin mandiri, atau melanjutkan ke perguruan tinggi seni rupa.</p>`
    },
    batik: {
      title: 'Kriya Kreatif Batik & Tekstil',
      content: `<p>Program keahlian yang mengajarkan seni membatik tradisional hingga modern, desain motif, dan produksi tekstil kreatif.</p>
        <p><strong>Kompetensi yang dipelajari:</strong></p>
        <ul><li>Teknik membatik tulis & cap</li><li>Desain motif batik digital</li><li>Pewarnaan alami & sintetis</li><li>Produksi busana & produk tekstil</li><li>Pemasaran produk kreatif</li></ul>
        <p>Cocok bagi yang ingin menjadi desainer batik, pengusaha fashion, atau bekerja di industri tekstil.</p>`
    },
    multi: {
      title: 'Multimedia / Desain Komunikasi Visual',
      content: `<p>Jurusan yang fokus pada dunia desain grafis, fotografi, videografi, dan produksi konten digital.</p>
        <p><strong>Kompetensi yang dipelajari:</strong></p>
        <ul><li>Desain grafis (Adobe Photoshop, Illustrator)</li><li>Fotografi & editing foto</li><li>Videografi & editing video</li><li>Animasi dasar & motion graphic</li><li>Produksi konten media sosial</li></ul>
        <p>Lulusan dapat bekerja sebagai desainer, content creator, fotografer, atau di industri kreatif digital.</p>`
    },
    tkj: {
      title: 'Teknik Komputer & Jaringan (TJKT)',
      content: `<p>Program keahlian teknologi informasi yang membekali siswa menjadi teknisi komputer dan jaringan yang kompeten.</p>
        <p><strong>Kompetensi yang dipelajari:</strong></p>
        <ul><li>Perakitan & perbaikan komputer</li><li>Instalasi & konfigurasi jaringan</li><li>Administrasi server & keamanan jaringan</li><li>Teknologi WAN & layanan jaringan</li><li>Pemrograman dasar</li></ul>
        <p>Lulusan siap menjadi teknisi IT, network administrator, atau melanjutkan kuliah di bidang informatika.</p>`
    }
  };
  document.querySelectorAll('[data-jurusan]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = jurusanData[btn.getAttribute('data-jurusan')];
      if (data) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  // ===== SPOTLIGHT + TILT ON CARDS =====
  document.querySelectorAll('.jurusan-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
