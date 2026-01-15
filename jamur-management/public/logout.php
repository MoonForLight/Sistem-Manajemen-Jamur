<?php
declare(strict_types=1);

require __DIR__ . "/../config/app.php";
require __DIR__ . "/../config/db.php";
require __DIR__ . "/../config/auth.php";

if (is_logged_in()) {
  log_activity($pdo, (int)current_user()['id'], "LOGOUT", "User logout.");
}

$_SESSION = [];
session_destroy();

header("Location: " . url("index.php"));
exit;
