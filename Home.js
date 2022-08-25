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
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {getInformation} from './Services';
import {useBetween} from 'use-between';
import {useShareableState} from './SharedVariables';

const Home = ({navigation}) => {
  const {
    image,
    setImage,
    setIngredients,
    setActiveProduct,
    setRefresh,
    refresh,
  } = useBetween(useShareableState);

  let localIngredients = [];

  const buttonPress = () => {
    launchImageLibrary({}, setImage);
  };

  const buttonPress2 = () => {
    const options = {
      // saveToPhotos: true,
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images',
      // },
    };
    launchCamera(options, setImage);
  };

  const navigateToInformationPage = () => {
    navigation.navigate('Information');
  };

  useEffect(() => {
    (async () => {
      if (image) {
        setIngredients([]);
        const result = await TextRecognition.recognize(image.assets[0].uri);

        console.log(result);
        for (const element of result) {
          const words = element.split(/[:,/]+/);
          let uniqueWords = [...new Set(words)];

          for (const e of uniqueWords) {
            console.log(e);
            try {
              const result2 = await getInformation(e);

              if (result2 !== 'There is no ingredient with this name.') {
                console.log(result2);
                localIngredients.push(result2);
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        console.log(image);
        setIngredients(localIngredients);
        navigateToInformationPage();
        setActiveProduct(null);
        setRefresh(!refresh);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <Button style={styles.button} onPress={buttonPress}>
          <Text style={styles.textInButton}>Select image from device</Text>
        </Button>
        <Button style={styles.buttonTakePicture} onPress={buttonPress2}>
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

export default Home;
