<?php
require_once __DIR__ . '/../includes/auth.php';
$user = currentUser();
jsonResponse(['ok' => true, 'user' => $user]);
