// src/screens/HomeDetailsScreens.js
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function HotelDetailsScreen({ route }) {
  const { hotel } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hotel.nom}</Text>
      <Image source={{ uri: hotel.photo }} style={styles.image} />
      <Text>{hotel.description}</Text>
      <Text style={styles.price}>{hotel.prix} €</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 200, marginVertical: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  price: { marginTop: 10, fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  image: { width: '100%', height: 250 },
  info: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  location: { fontSize: 16, color: '#767676', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#FF5A5F' },
  description: { fontSize: 15, color: '#484848', lineHeight: 22 },
});
