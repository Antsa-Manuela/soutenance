// src/screens/SignUpScreen.js
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';

const SignUpScreen = () => {
  const router = useRouter();

  const [form1, setForm1] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const [form2, setForm2] = useState({
    birthDate: new Date(),
    gender: '',
    city: '',
    cin: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (form1.password !== form1.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('https://soutenance-backend.onrender.com/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form1.email,
          nomComplet: form1.fullName,
          motDePasse: form1.password,
          dateNaissance: form2.birthDate.toISOString().split('T')[0], // format YYYY-MM-DD
          sexe: form2.gender,
          ville: form2.city,
          cin: form2.cin,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Succès', 'Compte créé !');
        router.push('/login');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      Alert.alert('Erreur serveur', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{
      ...styles.container,
      flexGrow: 1,
      justifyContent: 'center',
    }}
    >
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        onChangeText={text => setForm1({ ...form1, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        placeholderTextColor="#999"
        onChangeText={text => setForm1({ ...form1, fullName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={text => setForm1({ ...form1, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmation mot de passe"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={text => setForm1({ ...form1, confirmPassword: text })}
      />

<View style={styles.datesContainer}>
  <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
    <Text style={styles.dateLabel}>DATE DE NAISSANCE</Text>
    <Text style={styles.dateValue}>{form2.birthDate.toLocaleDateString('fr-FR')}</Text>
  </TouchableOpacity>
</View>

{showDatePicker && (
  <DateTimePicker
    value={form2.birthDate}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setForm2({ ...form2, birthDate: selectedDate });
      }
    }}
  />
)}

      <Text style={styles.label}>Sexe</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form2.gender}
          onValueChange={value => setForm2({ ...form2, gender: value })}
          style={styles.picker}
        >
          <Picker.Item label="Choisir..." value="" />
          <Picker.Item label="Féminin" value="F" />
          <Picker.Item label="Masculin" value="H" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Ville / Quartier"
        placeholderTextColor="#999"
        onChangeText={text => setForm2({ ...form2, city: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro CIN"
        placeholderTextColor="#999"
        onChangeText={text => setForm2({ ...form2, cin: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Créer le compte</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Vous avez déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },  
  title: {
    fontSize: 28,
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#3C1518',
  },
  label: {
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
    color: '#69140E', // Couleur secondaire pour différencier
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A44200',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#3C1518',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#A44200',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    color: '#3C1518',
  },
  datesContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    padding: 12,
  },
  dateLabel: {
    fontSize: 11,
    color: '#767676',
    fontWeight: '600',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  button: {
    backgroundColor: '#69140E', // Bouton primaire
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    color: '#D58936',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});


export default SignUpScreen;

/*   container: { flex: 1, padding: 24, backgroundColor: '#f7f7f7' },
  title: { fontSize: 26, fontWeight: '600', margin: 20, textAlign: 'center', color: '#000' },
  searchInput: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  datesContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 20 },
  dateInput: { flex: 1, padding: 12 },
  dateLabel: { fontSize: 11, color: '#767676', fontWeight: '600', marginBottom: 4 },
  dateValue: { fontSize: 15, fontWeight: '500', color: '#000' },
  dateSeparator: { width: 1, backgroundColor: '#e2e2e2', marginVertical: 10 },
  paramsContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  paramRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  paramLabel: { fontSize: 16, color: '#000', fontWeight: '500' },
  paramActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  paramButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f7f7f7', justifyContent: 'center', alignItems: 'center', borderColor: '#e2e2e2', borderWidth: 1 },
  paramButtonText: { fontSize: 16, color: '#000' },
  paramValue: { fontSize: 16, fontWeight: '500', width: 30, textAlign: 'center' },
  searchButton: { backgroundColor: '#FF5A5F', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  searchButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  hotelList: { paddingBottom: 24 },
  hotelCard: { marginBottom: 24, borderRadius: 16, backgroundColor: '#f7f7f7', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 4 },
  hotelImage: { width: '100%', height: 200, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  hotelInfoContainer: { padding: 16 },
  hotelName: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 4 },
  hotelLocation: { fontSize: 14, color: '#767676', marginBottom: 6 },
  hotelDescription: { fontSize: 14, color: '#484848', marginBottom: 8, lineHeight: 20 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  hotelPrice: { fontSize: 18, fontWeight: '600', color: '#000' },
  perNight: { fontSize: 14, color: '#767676', marginLeft: 4 }, */


