import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import app from '../Config/firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  function handleLogin() {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Utilisateur connecté
        const user = userCredential.user;
        console.log('Utilisateur connecté avec son identifiant :', user.uid);
        navigation.navigate('WeatherScreen'); // Redirige vers WeatherScreen
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Erreur", errorMessage);
      });
  }

  function navigateToRegister() {
    navigation.navigate('Register');
  }
  

  return (
    <View style ={styles.container}>
        <View style={styles.circle}>
        <Text style={{fontSize: 50, color: 'white', marginBottom: 70}}>Wind Weather</Text>
        <Text style={{fontSize: 30, color: 'white', marginBottom: 25}}>Adresse Mail :</Text>
        <TextInput
        placeholder="name@gmail.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={{fontSize: 30, color: 'white', marginBottom: 10, marginTop: 15}}>Mot De Passe :</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
        </View>
        <View  style={styles.container}>
      <TouchableOpacity  style={styles.buttonConnexion} onPress={handleLogin}> 
          <Text style={{textAlign: 'center', color: 'white'}}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.buttonCréation} onPress={navigateToRegister}> 
          <Text style={{textAlign: 'center', color: '#3F7EBC'}}>Créer un compte</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: 300,
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  buttonConnexion: {
    backgroundColor: '#3F7EBC',
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    width: 220,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  buttonCréation: {
    padding: 10,
    borderRadius: 25,
    borderColor: '#3F7EBC',
    borderWidth: 2,
    marginTop: 10,
    width: 220,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  circle: {
    width: 800,
    height: 500,
    backgroundColor: '#3F7EBC',
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoginScreen;