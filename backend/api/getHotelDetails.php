<?php
require_once 'db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "ID manquant"]);
  exit;
}

$sql = "SELECT h.id_hotel, h.nom, h.localisation, h.description, h.\"prixParNuit\", p.url
        FROM \"Hotel\" h
        LEFT JOIN \"Photo\" p ON h.id_hotel = p.id_hotel
        WHERE h.id_hotel = :id";

$stmt = $conn->prepare($sql);
$stmt->execute(['id' => $id]);

$hotel = $stmt->fetch(PDO::FETCH_ASSOC);

if ($hotel) {
  $hotel['image_url'] = "https://soutenance.whf.bz/soutenance/" . $hotel['url'];
  echo json_encode(["success" => true, "hotel" => $hotel]);
} else {
  http_response_code(404);
  echo json_encode(["success" => false, "message" => "Hôtel introuvable"]);
}
?>
