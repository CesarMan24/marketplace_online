import React from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, View, } from 'react-native';
import { Button, Input } from '@rneui/themed'
import { useRef } from 'react';
import { useEffect } from 'react';


const FOCUS = {
    latitude: 32.6245,
    longitude: -115.4523,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}
export default function App() {
    const mapRef = useRef(null);
    const handlepress = () => {
        mapRef.current.animateToRegion(FOCUS) 
    };
  return (
    <View style={{flex:1}}>
      <MapView  provider={PROVIDER_GOOGLE}style={StyleSheet.absoluteFill} initialRegion={FOCUS} ref={mapRef} 
       showsUserLocation={true}
       zoomEnabled={true}
       showsMyLocationButton={true} />
      <Button onPress={handlepress}> Focus </Button> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});