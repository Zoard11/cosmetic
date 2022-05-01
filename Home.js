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
import {getWebPage, getLink, getIngredientEffect} from './Services';

const Home = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);

  const requestData = e => {
    (async () => {
      const link = await getLink(`https://incibeauty.com/en/search/k/${e}}`);
      console.log(link);
      if (link) {
        const effect = await getIngredientEffect(link);
        console.log(e);
        console.log(effect);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      const link = await getLink('https://incibeauty.com/en/search/k/aqua');
      console.log(link);
      if (link) {
        const effect = await getIngredientEffect(link);
        console.log(effect);
      }
    })();
  }, []);

  const buttonPress = () => {
    launchImageLibrary({}, setImage);
  };

  const buttonPress2 = () => {
    launchCamera({}, setImage);
  };

  useEffect(() => {
    (async () => {
      if (image) {
        const result = await TextRecognition.recognize(image.assets[0].uri);
        // const result = [
        //   'DOwIosu Our LOOIS fOr iree aloov',
        //   'NOREDIENTSINGREDIENTE/CbCTAB/SASTOJC: Aqua, Glycerin, Dimethicone, Slearic Acid, Capn,nic Triglyceride, Gilycol Stearate, PEG-100 Stearate, Acrylates/C10-30 Allyl Acrylate Crospr,Sinensis Leaf Extract, Caprylyl Glycol, Carbomer, Celyl Alcohol, Citric Acid, Disod,eonl Stearate, Helianthus Annuus Seed Oil, Lactic Acid, Partum, Petrolatum, Phenoyetha,Flower Extract, Sodium Citrate, Stearamide AMP, Triethanolamine, Xanthan Gum, Benzy A,Benzoate, Benzyl Salicylate, Coumarin, Geraniol, Limonene, Linalool, CI 77891.,saAar 4R A0alCalleaun 1950 A0 AO Bn amTn: 020-78 0044 ODTE70 27 77 BA ILAR',
        // ];
        // console.log(result);
        result.forEach(element => {
          const words = element.split(/[:,\/]+/);
          // console.log(words);
          words.forEach(e => {
            console.log(e);
            // getLink(`https://incibeauty.com/en/search/k/${e}}`);
            requestData(e);
          });
        });
        console.log(image);
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
