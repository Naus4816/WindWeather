import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import app from '../Config/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCPassword] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();

  // Obtenez l'instance d'authentification
  const auth = getAuth(app);

  function handleSignUp() {
    if (password !== Cpassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // Add extra user information in the Realtime Database
        const db = getDatabase(app);
        set(ref(db, 'users/' + user.uid), {
          email: email,
          city: city, // Ajoutez la ville ici
        });
        Alert.alert("Succès", "Le compte a bien été créé!");
        navigation.navigate('Login'); // Redirige vers WeatherScreen
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Erreur", errorMessage);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 25, color: 'white', marginBottom: 10, marginLeft: 10}}>Nom et prénom :</Text>
      <TextInput
        placeholder="Jean Pierre Filou"
        // Ajoutez les états et les gestionnaires correspondants si nécessaire
        style={styles.input}
      />
      <Text style={{fontSize: 25, color: 'white', marginBottom: 10, marginLeft: 10, marginTop: 25}}>Adresse Mail :</Text>
      <TextInput
        placeholder="name@gmail.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={{fontSize: 25, color: 'white', marginBottom: 10, marginLeft: 10, marginTop: 25}}>Mot de passe :</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Text style={{fontSize: 25, color: 'white', marginBottom: 10, marginLeft: 10, marginTop: 25}}>Confirmez le mot de passe :</Text>
      <TextInput
        value={Cpassword}
        onChangeText={setCPassword}
        secureTextEntry
        style={styles.input}
      />
      <Text style={{fontSize: 25, color: 'white', marginBottom: 10, marginLeft: 10, marginTop: 25}}>Ville :</Text>
      <TextInput
        placeholder="Paris"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TouchableOpacity style = {styles.buttonCréation} onPress={handleSignUp}>
      <Text>Créer le compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
    backgroundColor: '#3F7EBC',
  },
  input: {
    width: '80%',
    margin: 5,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  buttonCréation: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginLeft: '25%',
    padding: 10,
    borderRadius: 25,
    borderColor: '#3F7EBC',
    borderWidth: 2,
    marginTop: 5,
    width: 220,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  }
});

export default RegisterScreen;