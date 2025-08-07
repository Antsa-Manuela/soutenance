<?php
require_once __DIR__ . '/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $stmt = $conn->query('SELECT * FROM "Hotel" LIMIT 1');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "✅ Connexion réussie à Neon PostgreSQL !",
        "sample" => $result
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Erreur de connexion : " . $e->getMessage()
    ]);
}
?>
