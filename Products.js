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
} from 'react-native';
import {DataTable, Button} from 'react-native-paper';
import {useBetween} from 'use-between';
import {useShareableState} from './SharedVariables';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {getProducts, getProductIngredientsLocal} from './Database';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {black} from 'react-native-paper/lib/typescript/styles/colors';

const Procucts = () => {
  const {
    image,
    setImage,
    ingredients,
    setIngredients,
    products,
    setProducts,
    refresh,
    activeProduct,
    setActiveProduct,
    productIngredients,
    setProductIngredients,
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
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModal = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <Text style={styles.title}>Saved Products</Text>

        <Modal isVisible={isModalVisible}>
          <View style={styles.modalstyle}>
            {activeProduct ? (
              <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.modalInside}>
                  <Text style={styles.title}>
                    Name : {activeProduct.fileName}
                  </Text>
                  <View>
                    <Text style={styles.title}>
                      Category : {activeProduct.Category}
                    </Text>
                  </View>
                  <Text style={styles.title}>Pictures</Text>
                  <View style={styles.container}>
                    {activeProduct.filePathInAlbum2 !== '' ? (
                      <SwiperFlatList
                        autoplay
                        autoplayDelay={5}
                        autoplayLoop
                        index={1}
                        showPagination>
                        <Image
                          source={{
                            uri: 'file://' + activeProduct.filePathInAlbum,
                          }}
                          style={styles.imageInSwiper}
                        />
                        <Image
                          source={{
                            uri: 'file://' + activeProduct.filePathInAlbum2,
                          }}
                          style={styles.imageInSwiper}
                        />
                      </SwiperFlatList>
                    ) : (
                      <Image
                        source={{
                          uri: 'file://' + activeProduct.filePathInAlbum,
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
                      {activeProduct.description}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <Button />
            )}

            <Button style={styles.cancelButton} onPress={handleModal}>
              <Text style={styles.textInButton}>Cancel</Text>
            </Button>
          </View>
        </Modal>

        {products.map(e => {
          return (
            <TouchableOpacity
              key={e.productId}
              onPress={async () => {
                handleModal();
                setActiveProduct(e);
                const result = await getProductIngredientsLocal(e.productId);
                console.log(result);
                console.log(e);
                console.log('Source:');
                console.log(activeProduct.filePathInAlbum);
                setProductIngredients(result);
              }}>
              <View style={styles.productRows}>
                <Text style={styles.productName}>{e.fileName}</Text>
                <View style={styles.rightSide}>
                  <AirbnbRating
                    type="star"
                    ratingCount={5}
                    defaultRating={e.rating}
                    showRating={false}
                    isDisabled={true}
                  />
                </View>
              </View>
            </TouchableOpacity>
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
    width: '40%',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    width: 230,
    height: 300,
  },
  productRows: {
    margin: 20,
    flexDirection: 'row',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  productName: {
    margin: 10,
  },
  description: {
    fontSize: 15,
    margin: 10,
    color: 'black',
  },
});

export default Procucts;
