import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  Accuracy,
  LocationObject
} from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log("Localização atual: ", currentPosition);
    }
  }

  useEffect(() => {
    let subscription: any;

    async function startWatchingLocation() {
      subscription = await watchPositionAsync(
        {
          accuracy: Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (response) => {
          console.log("Nova localização: ", response);
          setLocation(response);
          mapRef.current?.animateCamera({
            pitch: 70,
            center: response.coords,
          });
        }
      );
    }

    requestLocationPermissions();
    startWatchingLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Carregando localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// import {useState, useEffect} from 'react';
// import { useRef } from 'react';
// import {View} from 'react-native';
// import {styles} from './style';
// import MapView, {Marker} from 'react-native-maps';
// import {requestForegroundPermissionsAsync, getCurrentPositionAsync, 
// LocationObject,
// watchPositionAsync,
// Accuracy,
// LocationAccuracy
// } from 'expo-location';


// export default function App() {
//   const [location,setLocation] = useState<LocationObject | null>(null);
    
//   const mapRef = useRef<MapView>(null)

//     async function requestForegroundPermissions() {
//       const { granted } = await requestForegroundPermissionsAsync();
      
//       if(granted){
//         const currentPosition = await getCurrentPositionAsync();
//         setLocation(currentPosition); 

//         console.log("Localização atual: ",currentPosition)
//       }
//     }
//   useEffect(() => {
//     watchPositionAsync({
//       Accuracy: LocationAccuracy.Highest,
//       timeInterval: 1000,
//       distanceInterval: 1

//     }, (response) => {
//       console.log("Nova localização: ",response);
//       setLocation(response);
//       mapRef.current?.animateCamera({
//         pitch: 70,
//         center: response.coords
//       })
//     });
//   },[]);
  
//   return (
//     <View style={styles.container}>
//     {
//       location && 

//       <MapView

//       ref= {mapRef}

//       style={styles.map}

//       initialRegion={{
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       }}>
      
//       <Marker
//       coordinate={{
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       }}
//       ></Marker>
//       </MapView>
      
//     }
//     </View>
//   );
// }