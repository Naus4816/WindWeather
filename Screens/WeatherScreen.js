import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import app from '../Config/firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native'; // Assurez-vous d'avoir installé @react-navigation/native

const WeatherScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const navigation = useNavigation(); // Hook pour la navigation

    // Cette fonction catégorise les conditions météorologiques
  const categorizeWeatherCondition = (main) => {
    switch (main) {
      case 'Clear':
        return 'Clear';
      case 'Clouds':
        return 'Clouds';
      case 'Rain':
      case 'Drizzle':
        return 'Rain';
      case 'Snow':
        return 'Snow';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
        return 'Fog';
      case 'Dust':
      case 'Sand':
      case 'Ash':
        return 'Dust';
      case 'Squall':
        return 'Squall';
      case 'Tornado':
        return 'Tornado';
      default:
        return main;
    }
  };

  const weatherIcons = {
    Clear: require('../assets/Clear.png'),
    Clouds: require('../assets/Clouds.png'),
    Rain: require('../assets/Rain.png'),
    Snow: require('../assets/Snow.png'),
    Fog: require('../assets/Fog.png'),
    Dust: require('../assets/Dust.png'),
    Squall: require('../assets/Squall.png'),
    Tornado: require('../assets/Tornado.png'),
  };
  
  const fetchWeatherData = (ville) => {
    const cle = 'bd720fd69ff2488881f4e7b6f853aee8';
    
    // Utiliser l'endpoint forecast pour obtenir les prévisions sur 5 jours
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${cle}&units=metric`)
      .then(response => response.json())
      .then(data => {  
        const dailyForecasts = data.list.filter(forecast => {
          return forecast.dt_txt.includes('12:00:00');
        }).map(forecast => {
          return {
            temp: forecast.main.temp,
            main: categorizeWeatherCondition(forecast.weather[0].main), // Utilisez la fonction de catégorisation ici
            dt: forecast.dt
          };
        });
      
        setWeatherData(dailyForecasts);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données météo:", error);
      });
  };
  

  useEffect(() => {
    const auth = getAuth(app);
    const database = getDatabase(app);

    // Écouter les changements d'état de connexion de l'utilisateur
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // L'utilisateur est connecté, récupérer la ville de la base de données
        const userRef = ref(database, 'users/' + user.uid);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserCity(userData.city);
            fetchWeatherData(userData.city);
          } else {
            console.log("Aucune donnée disponible pour cet utilisateur.");
          }
        }).catch((error) => {
          console.error(error);
        });
      } else {
        // Rediriger vers l'écran de connexion si l'utilisateur n'est pas connecté
        navigation.navigate('Login'); // Assurez-vous que 'LoginScreen' est le bon nom de votre écran de connexion
      }
    });
  }, [navigation]);

  // Fonction pour gérer la déconnexion
  const handleSignOut = () => {
    signOut(getAuth(app))
      .then(() => {
        // Redirection après la déconnexion
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion:", error);
      });
  };
  const [newCity, setNewCity] = useState('');

  const handleCityChange = () => {
    setUserCity(newCity);
    fetchWeatherData(newCity);
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      const database = getDatabase(app);
      const userRef = ref(database, 'users/' + user.uid);
      update(userRef, { city: newCity })
      .then(() => {
        Alert.alert("La ville a bien été changée");
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de la ville dans la base de données:', error);
    });
}
  };

  // Une fonction pour obtenir le nom du jour de la semaine à partir d'une date
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' }).split(' ')[0];
  };  

  // Générer un composant pour chaque jour de prévision
  const renderWeatherItem = ({ temp, main, dt }) => {
    const dayName = getDayName(dt); 
    const iconSource = weatherIcons[main] || weatherIcons['Default']; // Utilisez l'objet de mappage
    
    return (
      <View key={dt} style={styles.weatherItem}>
        <Text style={styles.dayText}>{dayName}</Text>
        <Image source={iconSource} style={styles.weatherIcon} />
        <Text style={styles.tempText}>{`${Math.round(temp)}°C`}</Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
    <View style={styles.circle}>
      <Text style={styles.hautText}>{'Prévisions pour'}</Text>
      <Text style={{fontSize: 45, fontWeight: 'bold', marginTop: '5%', color: 'white'}}>{`${userCity}`}</Text>
      </View>
      <ScrollView style={styles.weatherContainer}>
        {weatherData && weatherData.map(renderWeatherItem)}
      </ScrollView>
   
      <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: '5%'}}>Changez de ville ici :</Text>
       <TextInput
          style={styles.input}
          placeholder="Nouvelle ville"
          onChangeText={(text) => setNewCity(text)}
        />
        <TouchableOpacity  style={styles.buttonChangement} onPress={handleCityChange}> 
          <Text style={{textAlign: 'center', color: 'white'}}>Changer de ville</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.buttonDeconnexion} onPress={handleSignOut}> 
          <Text style={{textAlign: 'center', color: 'white'}}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  weatherContainer: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)', 
    borderRadius: 20,
    marginHorizontal: 20,
    maxHeight: 300,
    width: 350, 
    marginTop: '5%',
  },
  weatherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white', 
  },
  weatherIcon: {
    width: 50, 
    height: 50, 
  },
  dayText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  mainText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '300', 
  },
  tempText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  hautText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonChangement: {
    backgroundColor: '#3F7EBC',
    padding: 10,
    borderRadius: 25,
    width: 220,
    marginTop: '5%',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  input: {
    width: 300,
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  buttonDeconnexion: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 25,
    width: 220,
    marginTop: '5%',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  circle: {
    width: 600,
    height: 220,
    backgroundColor: '#3F7EBC',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default WeatherScreen;