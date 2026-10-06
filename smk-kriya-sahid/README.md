# SMK Kriya Sahid Sukoharjo — Website + Backend PHP
**COPYRIGHT © 2026 DEVELOPMENT BY ARGA**

Website HTML modern + backend PHP untuk **Login, Daftar Akun, dan Komentar**.
**BUKAN WordPress.**

---

## Fitur
- Frontend: HTML/CSS/JS (tema putih-abu, dark mode, animasi, dll)
- Backend: PHP + MySQL
- Daftar akun / Login / Logout
- Komentar (hanya user yang login)
- Form pendaftaran siswa → email (FormSubmit)

---

## Install Lokal (Laragon — disarankan)

### 1. Install Laragon
https://laragon.org → Install → Start All

### 2. Copy project
Salin folder ini ke:
```
C:\laragon\www\smk-kriya-sahid
```

### 3. Buat database
1. Buka http://localhost/phpmyadmin
2. Tab **SQL** → paste isi file `database.sql` → Go
3. Atau Import file `database.sql`

### 4. Cek konfigurasi
Edit `includes/config.php` jika perlu:
```php
DB_HOST = 127.0.0.1
DB_NAME = smk_kriya_sahid
DB_USER = root
DB_PASS = ''   // Laragon default kosong
```

### 5. Buka website
```
http://smk-kriya-sahid.test
```
atau
```
http://localhost/smk-kriya-sahid
```

---

## Alternatif: XAMPP
1. Install XAMPP → Start Apache + MySQL
2. Copy ke `C:\xampp\htdocs\smk-kriya-sahid`
3. Import `database.sql` di phpMyAdmin
4. Buka `http://localhost/smk-kriya-sahid`

---

## Cara pakai Login & Komentar
1. Klik **Login** di navbar
2. Pilih tab **Daftar** → buat akun
3. Scroll ke section **Komentar**
4. Tulis komentar → Kirim
5. Komentar tampil di list (dari database)

---

## Struktur penting
```
smk-kriya-sahid/
├── index.html          ← Frontend
├── css/style.css
├── js/main.js
├── js/auth.js          ← Login & komentar (JS)
├── api/
│   ├── register.php
│   ├── login.php
│   ├── logout.php
│   ├── me.php
│   └── comments.php
├── includes/
│   ├── config.php      ← Setting database
│   ├── db.php
│   └── auth.php
├── database.sql        ← Import ini dulu!
└── img/logo.png
```

---

## Troubleshooting
| Masalah | Solusi |
|---------|--------|
| Komentar gagal load | Database belum di-import / nama DB salah |
| Login error 500 | Cek password MySQL di `config.php` |
| Session tidak jalan | Pastikan PHP session aktif (default Laragon OK) |
| CORS / fetch gagal | Buka lewat `http://localhost/...` bukan `file://` |

**Penting:** Jangan buka `index.html` langsung (double-click).  
Harus lewat **http://localhost/...** agar PHP & login berjalan.
