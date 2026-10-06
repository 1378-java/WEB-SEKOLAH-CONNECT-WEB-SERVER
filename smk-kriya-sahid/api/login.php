<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$email = trim(strtolower($input['email'] ?? ''));
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    jsonResponse(['ok' => false, 'error' => 'Email dan password wajib'], 400);
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, nama, email, password, role FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['ok' => false, 'error' => 'Email atau password salah'], 401);
    }

    $_SESSION['user'] = [
        'id' => (int)$user['id'],
        'nama' => $user['nama'],
        'email' => $user['email'],
        'role' => $user['role'],
    ];
    jsonResponse(['ok' => true, 'user' => $_SESSION['user']]);
} catch (Throwable $e) {
    jsonResponse(['ok' => false, 'error' => 'Gagal login. Cek database.'], 500);
}
