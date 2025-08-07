<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$secretKey = getenv('JWT_SECRET'); // à définir dans Render

// 🔍 Test de connexion à la base de données
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
    exit;
}

// 🔐 Authentification utilisateur
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? '';
$mdp = $data["motDePasse"] ?? '';

if (!$email || !$mdp) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email et mot de passe requis"]);
    exit;
}

$query = $conn->prepare("SELECT id, \"nomComplet\" FROM \"Utilisateur\" WHERE email = :email AND \"motDePasse\" = :mdp");
$query->execute(['email' => $email, 'mdp' => $mdp]);

$user = $query->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $payload = [
        'iat' => time(),
        'exp' => time() + 3600,
        'id' => $user['id'],
        'nomComplet' => $user['nomComplet'],
        'email' => $email
    ];

    $jwt = JWT::encode($payload, $secretKey, 'HS256');
    echo json_encode(["success" => true, "token" => $jwt]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
}
?>
