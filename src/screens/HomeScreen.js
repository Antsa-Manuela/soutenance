// src/screens/HomeScreen.js
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getHotels } from '../services/api';


const router = useRouter();

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [params, setParams] = useState({ chambres: 1, adultes: 2, enfants: 0, animaux: 0 });
  const [hotels, setHotels] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (error) {
        console.error('Erreur récupération hôtels :', error);
      }
    }
    fetchData();
  }, []);

  const renderHotel = ({ item }) => (
  <TouchableOpacity
    style={styles.hotelCard}
    activeOpacity={0.85}
    onPress={() => navigation.navigate('HotelDetailsScreen', { hotelId: item.id_hotel })}
    >
    {item.image_url && (
      <Image source={{ uri: item.image_url }} style={styles.hotelImage} />
    )}
    <View style={styles.hotelInfoContainer}>
      <Text style={styles.hotelName}>{item.nom}</Text>
      <Text style={styles.hotelLocation}>{item.localisation}</Text>
      <Text style={styles.hotelDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.hotelPrice}>{item.prixParNuit} Ar</Text>
        <Text style={styles.perNight}> / nuit</Text>
      </View>
    </View>
  </TouchableOpacity>
);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trouvez votre hébergement</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Où allez-vous ?"
        placeholderTextColor="#767676"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Sélection de dates */}
      <View style={styles.datesContainer}>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowArrivalPicker(true)}>
          <Text style={styles.dateLabel}>ARRIVÉE</Text>
          <Text style={styles.dateValue}>{arrivalDate.toLocaleDateString('fr-FR')}</Text>
        </TouchableOpacity>
        <View style={styles.dateSeparator} />
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDeparturePicker(true)}>
          <Text style={styles.dateLabel}>DÉPART</Text>
          <Text style={styles.dateValue}>{departureDate.toLocaleDateString('fr-FR')}</Text>
        </TouchableOpacity>
      </View>

      {showArrivalPicker && (
        <DateTimePicker
          value={arrivalDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowArrivalPicker(false);
            if (date) setArrivalDate(date);
          }}
        />
      )}
      {showDeparturePicker && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowDeparturePicker(false);
            if (date) setDepartureDate(date);
          }}
        />
      )}

      {/* Paramètres */}
      <View style={styles.paramsContainer}>
        {['chambres', 'adultes', 'enfants', 'animaux'].map((key) => (
          <View key={key} style={styles.paramBox}>
            <Text style={styles.paramLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <View style={styles.paramActions}>
              <TouchableOpacity style={styles.paramButton} onPress={() => setParams({ ...params, [key]: Math.max(0, params[key] - 1) })}>
                <Text style={styles.paramButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.paramValue}>{params[key]}</Text>
              <TouchableOpacity style={styles.paramButton} onPress={() => setParams({ ...params, [key]: params[key] + 1 })}>
                <Text style={styles.paramButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Nos suggestions</Text>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id_hotel.toString()}
        renderItem={renderHotel}
        contentContainerStyle={styles.hotelList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


// Styles modifiés avec votre palette
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 34,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center', // Centre verticalement
  },
 
  title: {
    fontSize: 26,
    fontWeight: '700',
    margin: 20,
    textAlign: 'center',
    color: '#3C1518', // Bordeaux foncé
    fontFamily: 'PlayfairDisplay_700Bold' // Police sophistiquée
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#A44200' // Rouge cuivré pour la bordure
  },
  datesContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A44200'
  },
  dateInput: {
    flex: 1,
    padding: 12
  },
  dateLabel: {
    fontSize: 11,
    color: '#69140E', // Rouge-brun
    fontWeight: '600',
    marginBottom: 4
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3C1518' // Texte foncé
  },
  dateSeparator: {
    width: 1,
    backgroundColor: '#D58936', // Orange doré
    marginVertical: 10
  },
  paramsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#A44200',
  },
  paramBox: {
    width: 'auto', // ou ~100 / nombre d'éléments si tu veux + étroit
    marginBottom: 12,
  },
  paramLabel: {
    fontSize: 14,
    color: '#3C1518',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  paramActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramButton: {
    width: 25,
    height: 25,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D58936',
    borderWidth: 1,
  },
  paramButtonText: {
    fontSize: 15,
    color: '#69140E',
    fontWeight: '700',
  },
  paramValue: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 5,
    color: '#3C1518',
  },
  searchButton: {
    backgroundColor: '#69140E', // Rouge-brun (bouton primaire)
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#3C1518'
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
    color: '#3C1518',
    fontFamily: 'PlayfairDisplay_600SemiBold'
  },
  hotelList: {
    paddingBottom: 24
  },
  hotelCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#3C1518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  hotelInfoContainer: {
    padding: 16
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C1518',
    marginBottom: 4
  },
  hotelLocation: {
    fontSize: 14,
    color: '#69140E', // Rouge-brun
    marginBottom: 6
  },
  hotelDescription: {
    fontSize: 14,
    color: '#484848',
    marginBottom: 8,
    lineHeight: 20
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  hotelPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A44200' // Rouge cuivré pour le prix
  },
  perNight: {
    fontSize: 14,
    color: '#767676',
    marginLeft: 4
  },
});

export default HomeScreen;
