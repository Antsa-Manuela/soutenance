<?php
// backend/register.php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$required = ["email", "nomComplet", "motDePasse", "cin"];
foreach ($required as $field) {
  if (empty($data[$field])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Champ requis manquant : $field"]);
    exit;
  }
}

$email = $data["email"];
$cin = $data["cin"];

$checkUser = $conn->prepare("SELECT 1 FROM \"Utilisateur\" WHERE email = :email");
$checkUser->execute(['email' => $email]);

$checkCin = $conn->prepare("SELECT 1 FROM \"Client\" WHERE cin = :cin");
$checkCin->execute(['cin' => $cin]);

if ($checkUser->fetch()) {
  http_response_code(409);
  echo json_encode(["success" => false, "message" => "Email déjà utilisé"]);
  exit;
}
if ($checkCin->fetch()) {
  http_response_code(409);
  echo json_encode(["success" => false, "message" => "CIN déjà enregistré"]);
  exit;
}

$insertUser = $conn->prepare("INSERT INTO \"Utilisateur\" (\"nomComplet\", email, \"motDePasse\") VALUES (:nom, :email, :mdp) RETURNING id");
$insertUser->execute([
  'nom' => $data["nomComplet"],
  'email' => $email,
  'mdp' => $data["motDePasse"]
]);

$id_utilisateur = $insertUser->fetchColumn();

$insertClient = $conn->prepare("INSERT INTO \"Client\" (\"dateNaissance\", sexe, ville, cin, id_utilisateur) VALUES (:dateNaiss, :sexe, :ville, :cin, :id)");
$insertClient->execute([
  'dateNaiss' => $data["dateNaissance"] ?? null,
  'sexe' => $data["sexe"] ?? null,
  'ville' => $data["ville"] ?? null,
  'cin' => $cin,
  'id' => $id_utilisateur
]);

echo json_encode(["success" => true]);
?>
