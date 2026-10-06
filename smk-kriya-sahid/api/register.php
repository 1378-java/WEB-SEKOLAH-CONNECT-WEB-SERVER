<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$nama = trim($input['nama'] ?? '');
$email = trim(strtolower($input['email'] ?? ''));
$password = $input['password'] ?? '';

if ($nama === '' || $email === '' || $password === '') {
    jsonResponse(['ok' => false, 'error' => 'Semua field wajib diisi'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['ok' => false, 'error' => 'Email tidak valid'], 400);
}
if (strlen($password) < 6) {
    jsonResponse(['ok' => false, 'error' => 'Password minimal 6 karakter'], 400);
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['ok' => false, 'error' => 'Email sudah terdaftar'], 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (nama, email, password) VALUES (?, ?, ?)');
    $stmt->execute([$nama, $email, $hash]);
    $id = (int)$db->lastInsertId();

    $_SESSION['user'] = ['id' => $id, 'nama' => $nama, 'email' => $email, 'role' => 'user'];
    jsonResponse(['ok' => true, 'user' => $_SESSION['user']]);
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'error' => 'Gagal daftar. Cek database.'], 500);
}
