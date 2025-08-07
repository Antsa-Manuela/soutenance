<?php
$dsn  = getenv('DB_DSN');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->query('SELECT * FROM "Hotel" LIMIT 1');
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
