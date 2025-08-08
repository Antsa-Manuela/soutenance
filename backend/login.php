<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Méthode non autorisée',
        'received_method' => $_SERVER['REQUEST_METHOD']
    ]);
    exit;
}

require_once __DIR__ . '/db.php';

// Config JWT
$secretKey = getenv('JWT_SECRET') ?: 'default_secret_key_for_dev';

// Lire l'entrée
$json = file_get_contents('php://input');
if ($json === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Aucune donnée reçue']);
    exit;
}

$data = json_decode($json, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'JSON invalide',
        'error' => json_last_error_msg(),
        'received_data' => $json
    ]);
    exit;
}

// Validation
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $data['motDePasse'] ?? '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Mot de passe requis']);
    exit;
}

try {
    // Requête SQL
    $stmt = $conn->prepare('SELECT id, "nomComplet" FROM "Utilisateur" WHERE email = :email AND "motDePasse" = :password');
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        require_once __DIR__ . '/vendor/autoload.php';
        
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600,
            'id' => $user['id'],
            'nomComplet' => $user['nomComplet'],
            'email' => $email
        ];

        $jwt = Firebase\JWT\JWT::encode($payload, $secretKey, 'HS256');

        echo json_encode([
            'success' => true,
            'token' => $jwt,
            'user' => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur serveur',
        'error' => $e->getMessage()
    ]);
}
?>