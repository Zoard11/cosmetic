/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Image,
  TextInput,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';

import {useBetween} from 'use-between';
import {useShareableState} from './SharedVariables';
import RNPickerSelect from 'react-native-picker-select';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {saveAllData} from './Database';

const Picture = ({navigation}) => {
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Save Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const {
    image,
    setImage,
    ingredients,
    setIngredients,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    handleRefresh,
  } = useBetween(useShareableState);

  const saveFile = () => {
    const granted = getPermissionAndroid();
    if (!granted) {
      return;
    }
    console.log('Permission granted');
    const productName = text;

    const albumPath = `${RNFS.PicturesDirectoryPath}/cosmetics/${selectedCategory}`;

    const fileName = `${productName}.jpg`;
    const filePathInCache = image.assets[0].uri;
    const filePathInAlbum = `${albumPath}/${fileName}`;

    return RNFS.mkdir(albumPath)
      .then(() => {
        RNFS.copyFile(filePathInCache, filePathInAlbum)
          .then(() => RNFS.scanFile(filePathInAlbum))
          .then(() => {
            saveAllData(
              productName,
              filePathInAlbum,
              selectedCategory,
              ingredients,
            );
            handleRefresh();
          })
          .then(() => {
            console.log('File Saved Successfully!');
            Alert.alert(
              'Save Image',
              'Image Saved Successfully',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          });
      })
      .catch(error => {
        console.log('Could not create dir', error);
      });
  };

  if (image) {
    console.log(image.assets[0].uri);
    console.log(selectedCategory);
  }

  const [text, onChangeText] = useState('');

  return (
    <SafeAreaView>
      <StatusBar />
      {image ? (
        <View style={styles.all}>
          <View style={styles.container}>
            <Image source={image.assets} style={styles.image} />
          </View>

          <View style={{height: '20%', width: '100%'}}>
            <Text style={styles.textSelectCategory}>Select Category </Text>
            <Picker
              style={{flex: 1}}
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndexs) => {
                if (itemIndexs !== 0) {
                  setSelectedCategory(itemValue);
                }
              }}>
              <Picker.Item
                label="Please select an option..."
                key="0"
                value="0"
              />
              {categories.map(e => {
                return <Picker.Item label={e} value={e} key={e} />;
              })}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="Product name"
          />
          <View>
            <Button style={styles.button} onPress={saveFile}>
              <Text style={styles.textInButton}>Save </Text>
            </Button>
          </View>
        </View>
      ) : (
        <Button />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    margin: 10,
    width: '90%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInButton: {
    color: '#fff',
    fontSize: 15,
  },
  container: {
    width: '90%',
    height: '50%',
    margin: 10,
  },
  all: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  containerRNPickerSelect: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSelectStyles: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  textSelectCategory: {
    color: 'black',
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    margin: 10,
  },
});

export default Picture;
