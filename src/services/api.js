export async function getHotels() {
    try {
      const response = await fetch('http://192.168.0.142/soutenance/api/getHotels.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur dans getHotels:', error);
      return [];
    }
  }
  