import { initializeApp, getReactNativePersistence } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyBZF0jJt7rnDguWZPb7nfQka2Qh2R03X7U",
  authDomain: "weather-app-131b7.firebaseapp.com",
  databaseURL: 'https://weather-app-131b7-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: "weather-app-131b7",
  storageBucket: "weather-app-131b7.appspot.com",
  messagingSenderId: "814688391341",
  appId: "1:814688391341:web:e7017c912be091952ab624",
};

const app = initializeApp(firebaseConfig);

export default app;