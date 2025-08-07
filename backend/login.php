<?php
// backend/login.php
header('Content-Type: application/json');

// 🔐 Inclusion des dépendances
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// 🔑 Clé secrète (à définir dans Render > Environment)
$secretKey = getenv('JWT_SECRET');

// 📥 Lecture des données JSON envoyées par l'app
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? '';
$mdp = $data["motDePasse"] ?? '';

// 🛑 Vérification des champs
if (!$email || !$mdp) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Email et mot de passe requis"
  ]);
  exit;
}

// 🔎 Requête SQL sécurisée
$query = $conn->prepare(
  'SELECT id, "nomComplet" FROM "Utilisateur" WHERE email = :email AND "motDePasse" = :mdp'
);
$query->execute([
  'email' => $email,
  'mdp' => $mdp
]);

$user = $query->fetch(PDO::FETCH_ASSOC);

// ✅ Si l'utilisateur est trouvé
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
    "token" => $jwt
  ]);
} else {
  http_response_code(401);
  echo json_encode([
    "success" => false,
    "message" => "Identifiants incorrects",
    // 🔍 Test temporaire pour debug
    "dir" => __DIR__,
    "files" => scandir(__DIR__)
  ]);
}
?>
