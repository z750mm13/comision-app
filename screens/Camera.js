import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  ActivityIndicator
} from 'react-native';

import { Camera as Cam } from 'expo-camera';

export default function Camera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Cam.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [taking, setTaking] = useState(false);

  tomarFoto = async () => {
    if (camera) {
      console.log("Imagen capturada");
      setTaking(true);
      camera.takePictureAsync({quality:0.1,base64: true}).then((img)=>{
        setPhoto(img);
        console.log(img);
        setTaking(false);
      })
    }
  };  
  
  useEffect(() => {
    (async () => {
      const { status } = await Cam.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  return (
    <View style={styles.container}>
      <Cam
        style={styles.camera}
        type={type}
        ref={ref => {
          setCamera(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Cam.Constants.Type.back
                  ? Cam.Constants.Type.front
                  : Cam.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <View style={styles.controls}>
          {taking?
          <ActivityIndicator />
          :<Button
            title="Tomar foto"
            color="#ffffff"
            onPress={tomarFoto}
          />}
          
          {photo && <Image style={styles.photo} source={photo} />}
        </View>
        </View>
      </Cam>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  photo: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
  },
  controls: {
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }
});