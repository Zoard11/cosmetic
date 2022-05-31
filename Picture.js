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
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {addNewCategory, saveAllData, selectCategories} from './Database';
import {Dimensions} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    refresh,
    setRefresh,
  } = useBetween(useShareableState);

  const [image2, setImage2] = useState(null);

  const [text, onChangeText] = useState('');
  const [rating, setRating] = useState('');
  const [description, onChangeDescription] = useState('');

  const [textNewCategory, onChangeTextNewCategory] = useState('');
  const [localCategories, setLocalCategories] = useState([]);

  const navigateToProductsPage = () => {
    navigation.navigate('Products');
  };

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
    let filePathInCache2 = '';
    let filePathInAlbum2 = '';

    if (image2) {
      const fileName2 = `${productName}2.jpg`;
      filePathInCache2 = image2.assets[0].uri;
      filePathInAlbum2 = `${albumPath}/${fileName2}`;
    }

    const clearAllVariables = () => {
      setRating('');
      setImage2(null);
      setImage(null);
      onChangeDescription('');
      onChangeText('');
    };
    const txtPath = `/storage/emulated/0/Documents/cosmetics/${selectedCategory}`;

    console.log(txtPath);

    return RNFS.mkdir(albumPath)
      .then(() => {
        RNFS.copyFile(filePathInCache, filePathInAlbum)
          .then(() => {
            if (image2) {
              RNFS.copyFile(filePathInCache2, filePathInAlbum2);
            }
          })
          .then(() => RNFS.scanFile(filePathInAlbum))
          .then(() => {
            if (image2) {
              RNFS.scanFile(filePathInAlbum2);
            }
          })
          .then(() => RNFS.mkdir(txtPath))
          .then(() => {
            let message = productName + '\nIngredients:';

            ingredients.forEach(ingredient => {
              message += ingredient['INCI name'] + ',';
              console.log(ingredient);
            });

            message = message.slice(0, -1);
            message += '.';

            const path = `${txtPath}/${productName}.txt`;
            RNFS.writeFile(path, message, 'utf8');
          })
          .then(success => {
            console.log('FILE WRITTEN!');
          })
          .then(() => {
            saveAllData(
              productName,
              filePathInAlbum,
              selectedCategory,
              ingredients,
              rating,
              filePathInAlbum2,
              description,
            ).then(
              function () {
                clearAllVariables();
                console.log('File Saved Successfully!');
                Alert.alert(
                  'Save Image',
                  'Image Saved Successfully',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        console.log('OK Pressed');
                        navigateToProductsPage();
                        setRefresh(!refresh);
                      },
                    },
                  ],
                  {cancelable: false},
                );
              },
              function (error) {
                Alert.alert(
                  'Error',
                  'Image failed to save',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  {cancelable: false},
                );
              },
            );
          });
      })
      .catch(error => {
        console.log('Could not create dir', error);
      });
  };

  const ratingCompleted = selectedRating => {
    setRating(selectedRating);
  };
  const buttonPressImageFromDevice = () => {
    launchImageLibrary({}, setImage2);
  };

  const buttonPressTakePicture = () => {
    const options = {
      // saveToPhotos: true,
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images',
      // },
    };
    launchCamera(options, setImage2);
  };

  useEffect(() => {
    selectCategories()
      .then(result => {
        setCategories(result);
        if (categories._W) {
          setLocalCategories(categories._W);
        } else {
          setLocalCategories(categories);
        }
      })
      .catch(error => {
        console.log(`Unable to load data: ${error.message}`);
      });
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModal = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  return (
    <SafeAreaView>
      <StatusBar />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalstyle}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextNewCategory}
            value={textNewCategory}
            placeholder="Category name"
          />
          <View style={styles.buttonContainer}>
            <Button
              style={styles.OkButton}
              onPress={async () => {
                await addNewCategory(textNewCategory);
                setCategories(await selectCategories());
                setLocalCategories(categories);
                setLocalCategories(localCategories => [
                  ...localCategories,
                  {CategoryName: textNewCategory},
                ]);
                onChangeTextNewCategory('');
                handleModal();
              }}>
              <Text style={styles.textInButton}>OK</Text>
            </Button>
            <Button style={styles.cancelButton} onPress={handleModal}>
              <Text style={styles.textInButton}>Cancel</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {image ? (
          <View style={styles.all}>
            <View style={styles.container}>
              <Image source={image.assets} style={styles.image} />
            </View>

            <View style={{height: '20%', width: '100%'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.h2}>Select Category </Text>
                <TouchableOpacity onPress={handleModal}>
                  <Text style={styles.h2}>Add new category </Text>
                </TouchableOpacity>
              </View>
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
                {localCategories.map(e => {
                  return (
                    <Picker.Item
                      label={e.CategoryName}
                      value={e.CategoryName}
                      key={e.CategoryName}
                    />
                  );
                })}
              </Picker>
            </View>
            <Text style={styles.h2}>Name </Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder="Product name"
            />

            <Text style={styles.h2}>Description </Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Type something"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={onChangeDescription}
              />
            </View>

            <Text style={styles.h2}>Rating </Text>
            <AirbnbRating onFinishRating={ratingCompleted} />
            <View>
              <Text style={styles.h2}>Add another picture </Text>
              {image2 ? (
                <View style={styles.container}>
                  <Image source={image2.assets} style={styles.image} />
                </View>
              ) : (
                <Button />
              )}
            </View>
            <View>
              <Button
                style={styles.buttonAddPicture}
                onPress={buttonPressImageFromDevice}>
                <Text style={styles.textInButton}>
                  Select image from device
                </Text>
              </Button>
              <Button
                style={styles.buttonAddPicture}
                onPress={buttonPressTakePicture}>
                <Text style={styles.textInButton}>Take photo</Text>
              </Button>
            </View>
            <View>
              <Button style={styles.button} onPress={saveFile}>
                <Text style={styles.textInButton}>Save </Text>
              </Button>
            </View>
          </View>
        ) : (
          <Button />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
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
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    margin: 10,
  },
  all: {
    width: windowWidth * 1,
    height: windowHeight * 1,
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
  h2: {
    color: 'black',
    margin: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  input: {
    margin: 10,
  },
  textAreaContainer: {
    margin: 10,
    borderColor: 'grey',
    borderWidth: 2,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    paddingBottom: 1100,
  },
  buttonAddPicture: {
    backgroundColor: 'blue',
    margin: 10,
    width: windowWidth * 0.9,
    height: windowHeight * 0.09,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalstyle: {
    backgroundColor: 'white',
    height: '40%',
    width: '95%',
    borderRadius: 10,
    flexDirection: 'column',
  },
  OkButton: {
    backgroundColor: 'green',
    margin: 20,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    margin: 20,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'flex-end',
    height: 100,
  },
});

export default Picture;
