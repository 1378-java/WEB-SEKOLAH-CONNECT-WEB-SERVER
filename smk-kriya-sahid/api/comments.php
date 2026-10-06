<?php
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query(
        'SELECT c.id, c.isi, c.created_at, u.nama AS nama_user
         FROM comments c
         JOIN users u ON u.id = c.user_id
         ORDER BY c.created_at DESC
         LIMIT 100'
    );
    jsonResponse(['ok' => true, 'comments' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireLogin();
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $isi = trim($input['isi'] ?? '');
    if ($isi === '' || mb_strlen($isi) < 3) {
        jsonResponse(['ok' => false, 'error' => 'Komentar minimal 3 karakter'], 400);
    }
    if (mb_strlen($isi) > 1000) {
        jsonResponse(['ok' => false, 'error' => 'Komentar terlalu panjang'], 400);
    }
    $user = currentUser();
    $stmt = $db->prepare('INSERT INTO comments (user_id, isi) VALUES (?, ?)');
    $stmt->execute([$user['id'], $isi]);
    jsonResponse([
        'ok' => true,
        'comment' => [
            'id' => (int)$db->lastInsertId(),
            'isi' => $isi,
            'created_at' => date('Y-m-d H:i:s'),
            'nama_user' => $user['nama'],
        ],
    ]);
}

jsonResponse(['ok' => false, 'error' => 'Method not allowed'], 405);
