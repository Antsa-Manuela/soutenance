<?php
require_once 'db.php';

$sql = "SELECT h.id_hotel, h.nom, h.localisation, h.description, h.\"prixParNuit\", p.url
        FROM \"Hotel\" h
        LEFT JOIN \"Photo\" p ON h.id_hotel = p.id_hotel
        GROUP BY h.id_hotel, p.url";

$stmt = $conn->prepare($sql);
$stmt->execute();

$hotels = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $row['image_url'] = "https://soutenance.whf.bz/soutenance/" . $row['url'];
  $hotels[] = $row;
}

echo json_encode($hotels);
?>
