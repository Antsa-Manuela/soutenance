<?php
error_log("login.php reached");

header('Content-Type: application/json');

// 🔐 Inclusion des dépendances
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT; 
use Firebase\JWT\Key;

// Vérifier si le fichier vendor existe avant de l'inclure
$vendorPath = __DIR__ . '/vendor/autoload.php';
if (file_exists($vendorPath)) {
    require_once $vendorPath;
} else {
    error_log("Vendor autoload not found");
}

// 🔑 Clé secrète (doit être définie dans les variables d'environnement)
$secretKey = getenv('JWT_SECRET') ?: 'default_secret_key_for_dev';

// 📥 Lecture des données JSON
$json = file_get_contents("php://input");
if ($json === false) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Données JSON invalides"
    ]);
    exit;
}

$data = json_decode($json, true);
if ($data === null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "JSON invalide"
    ]);
    exit;
}

$email = $data["email"] ?? '';
$mdp = $data["motDePasse"] ?? '';

// 🛑 Vérification des champs
if (empty($email) || empty($mdp)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email et mot de passe requis"
    ]);
    exit;
}

try {
    // 🔎 Requête SQL sécurisée
    $query = $conn->prepare(
        'SELECT id, "nomComplet" FROM "Utilisateur" WHERE email = :email AND "motDePasse" = :mdp'
    );
    $query->execute([
        'email' => $email,
        'mdp' => $mdp
    ]);

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

        echo json_encode([
            "success" => true,
            "token" => $jwt,
            "user" => [
                "id" => $user['id'],
                "nomComplet" => $user['nomComplet'],
                "email" => $email
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Identifiants incorrects"
        ]);
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur"
    ]);
}
?>