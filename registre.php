<?php
// Connexion à la base de données
$host = "localhost";
$db = "soutenance";
$user = "root";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Erreur de connexion à la base"]));
}

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);

// Protection contre les champs vides
if (!$data["email"] || !$data["nomComplet"] || !$data["motDePasse"] || !$data["cin"]) {
  echo json_encode(["success" => false, "message" => "Champs requis manquants"]);
  exit;
}

// Vérification de l'unicité de l'email et du CIN
$email = $conn->real_escape_string($data["email"]);
$cin = $conn->real_escape_string($data["cin"]);

$checkUser = $conn->query("SELECT * FROM Utilisateur WHERE email = '$email'");
$checkCin = $conn->query("SELECT * FROM Client WHERE cin = '$cin'");

if ($checkUser->num_rows > 0) {
  echo json_encode(["success" => false, "message" => "Email déjà utilisé"]);
  exit;
}
if ($checkCin->num_rows > 0) {
  echo json_encode(["success" => false, "message" => "CIN déjà enregistré"]);
  exit;
}

// Insertion dans Utilisateur
$nom = $conn->real_escape_string($data["nomComplet"]);
$mdp = $conn->real_escape_string($data["motDePasse"]);

$insertUser = $conn->query("INSERT INTO Utilisateur (nomComplet, email, motDePasse) VALUES ('$nom', '$email', '$mdp')");

if (!$insertUser) {
  echo json_encode(["success" => false, "message" => "Échec création utilisateur"]);
  exit;
}

$id_utilisateur = $conn->insert_id;

// Insertion dans Client
$dateNaiss = $conn->real_escape_string($data["dateNaissance"]);
$sexe = $conn->real_escape_string($data["sexe"]);
$ville = $conn->real_escape_string($data["ville"]);

$insertClient = $conn->query("INSERT INTO Client (dateNaissance, sexe, ville, cin, id_utilisateur) 
  VALUES ('$dateNaiss', '$sexe', '$ville', '$cin', $id_utilisateur)");

if (!$insertClient) {
  echo json_encode(["success" => false, "message" => "Échec création client"]);
  exit;
}

echo json_encode(["success" => true]);
?>
