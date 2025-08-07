// src/services/api.js
const BASE_URL = 'https://soutenance.whf.bz/soutenance/api';

// 🔹 Récupère la liste des hôtels
export async function getHotels() {
  try {
    const response = await fetch(`${BASE_URL}/getHotels.php`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Hôtels récupérés :', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur dans getHotels:', error.message);
    return [];
  }
}

// 🔹 Récupère les détails d’un hôtel spécifique
export async function getHotelDetails(hotelId) {
  try {
    const response = await fetch(`${BASE_URL}/getHotelDetails.php?id=${hotelId}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Détails hôtel :', data);
    return data;
  } catch (error) {
    console.error('❌ Erreur dans getHotelDetails:', error.message);
    return null;
  }
}
