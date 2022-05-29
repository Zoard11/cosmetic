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
    activeProductName,
    setActiveProductName,
    productIngredients,
    setProductIngredients,
  } = useBetween(useShareableState);

  useEffect(() => {
    getProducts()
      .then(result => {
        setProducts(result);
        console.log('EREDMENYEK:');
        console.log(products);
      })
      .catch(error => {
        console.log(`Unable to load data: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    getProducts()
      .then(result => {
        setProducts(result);
        console.log('EREDMENYEK:');
        console.log(products);
      })
      .catch(error => {
        console.log(`Unable to load data: ${error.message}`);
      });
  }, [refresh]);

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
              <View style={styles.modalInside}>
                <Text style={styles.title}>Name : {activeProductName}</Text>
                <Text style={styles.title}>Picture</Text>
                <View style={styles.container}>
                  <Image
                    source={{uri: 'file://' + activeProduct.filePathInAlbum}}
                    style={styles.image}
                  />
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
              </View>
            ) : (
              <Button />
            )}

            <Button style={styles.cancelButton} onPress={handleModal}>
              <Text style={styles.textInButton}>Cancel</Text>
            </Button>
          </View>
        </Modal>

        <DataTable>
          {products.map(e => {
            return (
              <TouchableOpacity
                key={e.productId}
                onPress={async () => {
                  setIsModalVisible(!isModalVisible);
                  setActiveProduct(e);
                  setActiveProductName(e.fileName);
                  const result = await getProductIngredientsLocal(e.productId);
                  console.log(result);
                  console.log(e);
                  console.log('Source:');
                  console.log(activeProduct.filePathInAlbum);
                  setProductIngredients(result);
                }}>
                <DataTable.Row key={e.productId}>
                  <DataTable.Cell>
                    <Text>{e.fileName}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </TouchableOpacity>
            );
          })}
        </DataTable>
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
    height: '40%',
    margin: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Procucts;
