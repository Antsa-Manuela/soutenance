<?php
error_log("Début du traitement login.php");

header('Content-Type: application/json');

// Vérifier si la requête est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Inclure db.php en premier
require_once __DIR__ . '/db.php';

// Configuration JWT
$secretKey = getenv('JWT_SECRET') ?: 'default_secret_key_for_dev';

// Lire les données d'entrée
$input = file_get_contents('php://input');
if (empty($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Aucune donnée reçue']);
    exit;
}

$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données JSON invalides: ' . json_last_error_msg()]);
    exit;
}

// Valider les champs requis
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $data['motDePasse'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis']);
    exit;
}

try {
    // Requête préparée pour plus de sécurité
    $stmt = $conn->prepare('SELECT id, "nomComplet" FROM "Utilisateur" WHERE email = :email AND "motDePasse" = :password');
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Inclure JWT seulement si nécessaire
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
            'user' => [
                'id' => $user['id'],
                'nomComplet' => $user['nomComplet'],
                'email' => $email
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
    }
} catch (PDOException $e) {
    error_log("Erreur DB: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données']);
} catch (Exception $e) {
    error_log("Erreur: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur']);
}
?>