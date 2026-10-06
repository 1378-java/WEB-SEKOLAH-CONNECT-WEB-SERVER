<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function currentUser(): ?array {
    return $_SESSION['user'] ?? null;
}

function isLoggedIn(): bool {
    return currentUser() !== null;
}

function requireLogin(): void {
    if (!isLoggedIn()) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Silakan login dulu']);
        exit;
    }
}

function jsonResponse(array $data, int $code = 200): void {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
