// src/screens/LoginScreen.js
/* import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity
} from 'react-native';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://soutenance-backend.onrender.com/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse: password }),
      });
  
      const data = await response.json();
      if (data.success && data.token) {
        await AsyncStorage.setItem('userToken', data.token); // ← stockage du token
        Alert.alert('Succès', 'Connexion réussie');
        router.push('/home');
      } else {
        Alert.alert('Erreur', data.message || 'Email ou mot de passe incorrect');
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
    }}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor="#999" secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Pas encore inscrit ? Créer un compte</Text>
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
    textAlign: 'center',
    fontWeight: '700',
    color: '#3C1518', // Couleur principale
  },
  input: {
    borderWidth: 1,
    borderColor: '#A44200', // Accent tertiaire
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#3C1518',
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
    color: '#D58936', // Accent orange doré
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LoginScreen; */

/* import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  AsyncStorage,
  ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity
} from 'react-native';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://soutenance-backend.onrender.com/login.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          motDePasse: password 
        }),
      });

      // Vérifier le statut de la réponse
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON:', text);
        throw new Error('Réponse serveur invalide');
      }

      if (data.success && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        Alert.alert('Succès', 'Connexion réussie');
        router.replace('/home');
      } else {
        Alert.alert('Erreur', data.message || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Connexion</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#999" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Mot de passe" 
        placeholderTextColor="#999" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Chargement...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkContainer}
        onPress={() => router.push('/signup')}
      >
        <Text style={styles.link}>Pas encore inscrit ? Créer un compte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    alignItems: 'center',
  },
  link: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default LoginScreen; */


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://soutenance-backend.onrender.com/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          motDePasse: password.trim()
        })
      });

      const responseText = await response.text();
      console.log('Réponse serveur:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Erreur parsing JSON:', e);
        throw new Error('Réponse serveur invalide');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur de connexion');
      }

      if (responseData.success) {
        await AsyncStorage.setItem('userToken', responseData.token);
        await AsyncStorage.setItem('userData', JSON.stringify(responseData.user));
        router.replace('/home');
      } else {
        Alert.alert('Erreur', responseData.message || 'Authentification échouée');
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => router.push('/signup')}
      >
        <Text style={styles.link}>Pas encore inscrit ? Créer un compte</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
    color: '#3C1518',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A44200',
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#3C1518',
  },
  button: {
    backgroundColor: '#69140E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'center',
    height: 50,
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
    fontWeight: '600',
    fontSize: 16,
  },
  linkContainer: {
    alignItems: 'center',
  },
});

export default LoginScreen;