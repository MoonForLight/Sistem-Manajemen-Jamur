<?php
// config/auth.php
declare(strict_types=1);
if (session_status() === PHP_SESSION_NONE) session_start();

function csrf_token(): string {
  if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
  }
  return $_SESSION['csrf'];
}

function require_csrf(): void {
  $token = $_POST['csrf'] ?? '';
  if (!$token || !hash_equals($_SESSION['csrf'] ?? '', $token)) {
    http_response_code(403);
    exit("CSRF token tidak valid.");
  }
}

function is_logged_in(): bool {
  return !empty($_SESSION['user']);
}

function require_login(): void {
  if (!is_logged_in()) {
    header("Location: /login.php");
    exit;
  }
}

function require_role(string $role): void {
  require_login();
  if (($_SESSION['user']['role'] ?? '') !== $role) {
    http_response_code(403);
    exit("Akses ditolak.");
  }
}

function current_user(): array {
  return $_SESSION['user'] ?? [];
}

function e(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function log_activity(PDO $pdo, int $actorId, string $action, string $desc): void {
  $stmt = $pdo->prepare("INSERT INTO activity_logs (actor_user_id, action, description) VALUES (?, ?, ?)");
  $stmt->execute([$actorId, $action, $desc]);
}
