import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getHotelDetails } from '../services/api';

const HotelDetailsScreen = () => {
  const { hotelId } = useLocalSearchParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      const data = await getHotelDetails(hotelId);
      console.log('Réponse API:', data); // temporaire
      if (data?.success) {
        setHotel(data.hotel);
      }
    }
    fetchDetails();
  }, [hotelId]);

  if (!hotel) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Chargement...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Galerie */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
        {hotel.photos?.map((photo, index) => (
          <Image key={index} source={{ uri: photo.url }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Infos */}
      <View style={styles.infoContainer}>
        <Text style={styles.hotelName}>{hotel.nom}</Text>
        <Text style={styles.location}>{hotel.localisation}</Text>
        <Text style={styles.description}>{hotel.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.hotelPrice}>{hotel.prixParNuit} Ar</Text>
          <Text style={styles.perNight}> / nuit</Text>
        </View>
      </View>

      {/* Hôte */}
      {hotel.hote && (
        <View style={styles.hostContainer}>
          <Text style={styles.hostTitle}>Hôte</Text>
          <Text style={styles.hostName}>{hotel.hote.nomEtablissement}</Text>
          <Text style={styles.hostType}>{hotel.hote.typeHebergement}</Text>
          <Text style={styles.hostAddress}>{hotel.hote.adresse}</Text>
        </View>
      )}

      {/* Réserver */}
      <TouchableOpacity style={styles.reserveButton}>
        <Text style={styles.reserveText}>Réserver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 24
  },
  imageGallery: {
    height: 250,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  image: {
    width: 300,
    height: 250,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3C1518',
    marginBottom: 6,
    fontFamily: 'PlayfairDisplay_700Bold'
  },
  location: {
    fontSize: 16,
    color: '#69140E',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    color: '#484848',
    marginBottom: 12,
    lineHeight: 20
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  hotelPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A44200'
  },
  perNight: {
    fontSize: 14,
    color: '#767676',
    marginLeft: 4
  },
  hostContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    shadowColor: '#3C1518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  hostTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C1518',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay_600SemiBold'
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#69140E',
    marginBottom: 4
  },
  hostType: {
    fontSize: 14,
    color: '#767676',
    marginBottom: 2
  },
  hostAddress: {
    fontSize: 14,
    color: '#767676'
  },
  reserveButton: {
    backgroundColor: '#69140E',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#3C1518'
  },
  reserveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default HotelDetailsScreen;
