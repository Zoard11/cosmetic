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
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {DataTable, Button} from 'react-native-paper';
import {useBetween} from 'use-between';
import {useShareableState} from './SharedVariables';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {
  getProducts,
  getProductIngredientsLocal,
  deleteProductLocalById,
} from './Database';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Share from 'react-native-share';
import Swipeout from 'react-native-swipeout';

const Products = ({navigation}) => {
  const {
    image,
    setImage,
    ingredients,
    setIngredients,
    products,
    setProducts,
    activeProduct,
    setActiveProduct,
    productIngredients,
    setProductIngredients,
    refresh,
    setRefresh,
  } = useBetween(useShareableState);

  useEffect(() => {
    getProducts()
      .then(result => {
        setProducts(result);
        console.log('products:');
        console.log(products);
      })
      .catch(error => {
        console.log(`Unable to load data: ${error.message}`);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localActiveProduct, setLocalActiveProduct] = useState(null);

  const handleModal = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  const navigateToInformationPage = () => {
    navigation.navigate('Information');
  };

  const swipeButtons = id => [
    {
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: async () => {
        try {
          console.log(id);
          await deleteProductLocalById(id);
          setRefresh(!refresh);
        } catch (error) {
          Alert.alert(error.message);
        }
      },
    },
  ];

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <Text style={styles.title}>Saved Products</Text>

        <Modal isVisible={isModalVisible}>
          <View style={styles.modalstyle}>
            {localActiveProduct ? (
              <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.modalInside}>
                  <Text style={styles.title}>
                    Name : {localActiveProduct.fileName}
                  </Text>
                  <View>
                    <Text style={styles.title}>
                      Category : {localActiveProduct.Category}
                    </Text>
                  </View>
                  <Text style={styles.title}>Pictures</Text>
                  <View>
                    {localActiveProduct.filePathInAlbum2 !== '' ? (
                      <SwiperFlatList
                        autoplay
                        autoplayDelay={5}
                        autoplayLoop
                        index={1}
                        showPagination>
                        <Image
                          source={{
                            uri: 'file://' + localActiveProduct.filePathInAlbum,
                          }}
                          style={styles.imageInSwiper}
                        />
                        <Image
                          source={{
                            uri:
                              'file://' + localActiveProduct.filePathInAlbum2,
                          }}
                          style={styles.imageInSwiper}
                        />
                      </SwiperFlatList>
                    ) : (
                      <Image
                        source={{
                          uri: 'file://' + localActiveProduct.filePathInAlbum,
                        }}
                        style={styles.image}
                      />
                    )}
                  </View>
                  <DataTable>
                    <Text style={styles.title}>Ingredients</Text>
                    {productIngredients.map(e => {
                      return (
                        <DataTable.Row key={e.id}>
                          <DataTable.Cell>
                            <Text>{e['INCI name']}</Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    })}
                  </DataTable>
                  <View>
                    <Text style={styles.title}>Description</Text>
                    <Text style={styles.description}>
                      {localActiveProduct.description}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <Button />
            )}

            <View style={styles.buttonContainer}>
              <Button style={styles.cancelButton} onPress={handleModal}>
                <Text style={styles.textInButton}>Cancel</Text>
              </Button>
              <Button
                style={styles.setActiveButton}
                onPress={() => {
                  handleModal();
                  setActiveProduct(localActiveProduct);
                  console.log(localActiveProduct);
                  navigateToInformationPage();
                }}>
                <Text style={styles.textInButton}>set active</Text>
              </Button>
            </View>
          </View>
        </Modal>
        {products.map(e => {
          return (
            <Swipeout
              right={swipeButtons(e.productId)}
              autoClose="true"
              backgroundColor="transparent">
              <TouchableOpacity
                key={e.productId}
                onLongPress={async () => {
                  try {
                    Share.open({
                      title: 'Share ingredients ',
                      message: `${e.fileName}_ingredients`,
                      url: `file://${e.ingredientsPath}`,
                      subject: 'Ingredients',
                    });
                  } catch (error) {
                    Alert.alert(error.message);
                  }
                }}
                onPress={async () => {
                  try {
                    handleModal();
                    setLocalActiveProduct(e);
                    const result = await getProductIngredientsLocal(
                      e.productId,
                    );
                    console.log(result);
                    console.log(e);
                    setProductIngredients(result);
                  } catch (error) {
                    Alert.alert(error.message);
                  }
                }}>
                <View style={styles.productRows}>
                  <Text style={styles.productName}>{e.fileName}</Text>
                  {e.rating > 0 ? (
                    <View style={styles.rightSide}>
                      <AirbnbRating
                        type="star"
                        ratingCount={5}
                        defaultRating={e.rating}
                        showRating={false}
                        isDisabled={true}
                      />
                    </View>
                  ) : (
                    <View style={styles.rightSide} />
                  )}
                </View>
              </TouchableOpacity>
            </Swipeout>
          );
        })}
      </ScrollView>
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
  cancelButton: {
    backgroundColor: 'green',
    margin: 10,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setActiveButton: {
    backgroundColor: 'blue',
    margin: 10,
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalstyle: {
    backgroundColor: 'white',
    height: '90%',
    width: '95%',
    borderRadius: 10,
  },
  modalInside: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    color: 'black',
  },
  container: {
    width: '80%',
    height: '50%',
    margin: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    paddingBottom: 1100,
  },
  imageInSwiper: {
    width: 320,
    height: 300,
  },
  productRows: {
    margin: 20,
    flexDirection: 'row',
  },
  rightSide: {
    marginLeft: 'auto',
  },
  productName: {
    margin: 10,
  },
  description: {
    fontSize: 15,
    margin: 10,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'flex-end',
    height: 100,
  },
});

export default Products;
