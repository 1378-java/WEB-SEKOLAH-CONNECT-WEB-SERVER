// Auth + Comments - SMK Kriya Sahid
// Development by ARGA

(function () {
  const API = 'api';

  async function api(path, options = {}) {
    const res = await fetch(`${API}/${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      credentials: 'same-origin',
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  }

  let currentUser = null;

  const authArea = document.getElementById('authArea');
  const authModal = document.getElementById('authModal');
  const authModalClose = document.getElementById('authModalClose');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');
  const commentForm = document.getElementById('commentForm');
  const commentLoginHint = document.getElementById('commentLoginHint');
  const commentUserName = document.getElementById('commentUserName');
  const commentsList = document.getElementById('commentsList');
  const btnLoginOpen = document.getElementById('btnLoginOpen');
  const btnLoginFromComment = document.getElementById('btnLoginFromComment');

  function openAuth() {
    if (authModal) {
      authModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeAuth() {
    if (authModal) {
      authModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showLoginTab() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLogin.style.background = '';
    tabLogin.style.color = '';
    tabRegister.style.background = 'var(--border)';
    tabRegister.style.color = 'var(--text)';
  }
  function showRegisterTab() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabRegister.style.background = '';
    tabRegister.style.color = '';
    tabLogin.style.background = 'var(--border)';
    tabLogin.style.color = 'var(--text)';
  }

  function renderAuthArea() {
    if (!authArea) return;
    if (currentUser) {
      authArea.innerHTML = `
        <span style="color:rgba(255,255,255,0.9);font-size:0.85rem;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(currentUser.nama)}</span>
        <button type="button" class="nav-link" id="btnLogout" style="background:rgba(255,255,255,0.12);border:none;cursor:pointer;">Logout</button>
      `;
      document.getElementById('btnLogout')?.addEventListener('click', logout);
    } else {
      authArea.innerHTML = `<button type="button" class="nav-link" id="btnLoginOpen" style="background:rgba(255,255,255,0.12);border:none;cursor:pointer;">Login</button>`;
      document.getElementById('btnLoginOpen')?.addEventListener('click', openAuth);
    }
  }

  function renderCommentBox() {
    if (!commentForm || !commentLoginHint) return;
    if (currentUser) {
      commentLoginHint.style.display = 'none';
      commentForm.style.display = 'block';
      if (commentUserName) commentUserName.textContent = currentUser.nama;
    } else {
      commentLoginHint.style.display = 'block';
      commentForm.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(s) {
    try {
      return new Date(s).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return s;
    }
  }

  async function loadComments() {
    if (!commentsList) return;
    const { data } = await api('comments.php');
    if (!data.ok) {
      commentsList.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-soft);">Gagal memuat komentar. Pastikan database aktif.</p>`;
      return;
    }
    if (!data.comments.length) {
      commentsList.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-soft);">Belum ada komentar. Jadilah yang pertama!</p>`;
      return;
    }
    commentsList.innerHTML = data.comments.map(c => `
      <div class="testimoni-card">
        <p class="quote">${escapeHtml(c.isi)}</p>
        <div class="author">
          <div class="avatar">${escapeHtml((c.nama_user || '?').charAt(0).toUpperCase())}</div>
          <div>
            <div class="name">${escapeHtml(c.nama_user)}</div>
            <div class="role">${formatDate(c.created_at)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  async function refreshUser() {
    const { data } = await api('me.php');
    currentUser = data.user || null;
    renderAuthArea();
    renderCommentBox();
  }

  async function logout() {
    await api('logout.php', { method: 'POST', body: '{}' });
    currentUser = null;
    renderAuthArea();
    renderCommentBox();
  }

  // Events
  authModalClose?.addEventListener('click', closeAuth);
  authModal?.addEventListener('click', (e) => { if (e.target === authModal) closeAuth(); });
  tabLogin?.addEventListener('click', showLoginTab);
  tabRegister?.addEventListener('click', showRegisterTab);
  btnLoginOpen?.addEventListener('click', openAuth);
  btnLoginFromComment?.addEventListener('click', openAuth);

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const fd = new FormData(loginForm);
    const { data } = await api('login.php', {
      method: 'POST',
      body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
    });
    if (!data.ok) {
      loginError.textContent = data.error || 'Gagal login';
      loginError.style.display = 'block';
      return;
    }
    currentUser = data.user;
    renderAuthArea();
    renderCommentBox();
    closeAuth();
    loginForm.reset();
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.style.display = 'none';
    const fd = new FormData(registerForm);
    const { data } = await api('register.php', {
      method: 'POST',
      body: JSON.stringify({
        nama: fd.get('nama'),
        email: fd.get('email'),
        password: fd.get('password'),
      }),
    });
    if (!data.ok) {
      registerError.textContent = data.error || 'Gagal daftar';
      registerError.style.display = 'block';
      return;
    }
    currentUser = data.user;
    renderAuthArea();
    renderCommentBox();
    closeAuth();
    registerForm.reset();
  });

  commentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isi = document.getElementById('commentIsi')?.value || '';
    const { data } = await api('comments.php', {
      method: 'POST',
      body: JSON.stringify({ isi }),
    });
    if (!data.ok) {
      alert(data.error || 'Gagal kirim komentar');
      if (data.error && data.error.includes('login')) openAuth();
      return;
    }
    commentForm.reset();
    await loadComments();
  });

  // Init
  refreshUser();
  loadComments();
})();
