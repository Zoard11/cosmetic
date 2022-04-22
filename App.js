/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, StatusBar, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import TextRecognition from 'react-native-text-recognition';
import {launchImageLibrary} from 'react-native-image-picker';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);

  // useEffect(() => {
  //   launchImageLibrary({}, setImage);
  // }, []);

  const buttonPress = () => {
    launchImageLibrary({}, setImage);
  };

  useEffect(() => {
    (async () => {
      if (image) {
        const result = await TextRecognition.recognize(image.assets[0].uri);
        console.log(result);
        setText(result);
      }
    })();
  }, [image]);

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        {/* <Text>{text}</Text> */}
        <Button style={styles.button} onPress={buttonPress}>
          <Text style={styles.textInButton}>Select image from device</Text>
        </Button>
        <Button style={styles.buttonTakePicture} onPress={buttonPress}>
          <Text style={styles.textInButton}>Take photo</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
    margin: 10,
    width: '90%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTakePicture: {
    backgroundColor: 'blue',
    margin: 10,
    width: '90%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInButton: {
    color: '#fff',
    fontSize: 15,
  },
});

export default App;
