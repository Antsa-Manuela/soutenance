<?php
// backend/api/db.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dsn  = getenv('DB_DSN');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');

try {
  $conn = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Erreur de connexion: ' . $e->getMessage()]);
  exit;
}
?>
