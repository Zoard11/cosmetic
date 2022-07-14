/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {DataTable, Button} from 'react-native-paper';
import {useBetween} from 'use-between';
import {useShareableState} from './SharedVariables';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {getProductIngredientsLocal, getProducts} from './Database';
import {getInformation} from './Services';
import {Picker} from '@react-native-picker/picker';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Information = () => {
  const {
    image,
    setImage,
    ingredients,
    setIngredients,
    activeProduct,
    products,
    refresh,
    setProducts,
    setActiveProduct,
  } = useBetween(useShareableState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeIngredient, setactiveIngredient] = useState(null);

  const handleModal = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  let localIngredients = [];

  useEffect(() => {
    if (activeProduct) {
      getProductIngredientsLocal(activeProduct.productId)
        .then(async result => {
          for (const e of result) {
            console.log(e['INCI name']);
            const result2 = await getInformation(e['INCI name']);

            localIngredients.push(result2);
          }
          setIngredients(localIngredients);
        })
        .catch(error => {
          console.log(`Unable to load data: ${error.message}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProduct]);

  useEffect(() => {
    getProducts()
      .then(result => {
        setProducts(result);
      })
      .catch(error => {
        console.log(`Unable to load data: ${error.message}`);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const [selectedProduct, setSelectedProduct] = useState();

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        {activeProduct ? (
          <Text style={styles.title}>
            Selected Product : {activeProduct.fileName}
          </Text>
        ) : (
          <Text style={styles.title}>Selected Product : From picture</Text>
        )}
        <View style={styles.selectProduct}>
          <Text style={styles.h2}>Select product </Text>
          <Picker
            style={{flex: 1}}
            selectedValue={selectedProduct}
            onValueChange={(itemValue, itemIndexs) => {
              if (itemIndexs !== 0) {
                setSelectedProduct(itemValue);
                setActiveProduct(itemValue);
              }
            }}>
            <Picker.Item label="Please select an option..." key="0" value="0" />
            {products.map(e => {
              return (
                <Picker.Item label={e.fileName} value={e} key={e.productId} />
              );
            })}
          </Picker>
        </View>

        <Modal isVisible={isModalVisible}>
          <View style={styles.modalstyle}>
            {activeIngredient ? (
              <ScrollView>
                <View style={styles.modalInside}>
                  <Text style={styles.title}>Name</Text>
                  <Text style={styles.text}>
                    {activeIngredient['INCI name']}
                  </Text>
                  <Text style={styles.title}>Description</Text>
                  <Text style={styles.text}>
                    {activeIngredient['Chem/IUPAC Name / Description']}
                  </Text>
                  <Text style={styles.title}>Function</Text>
                  <Text style={styles.text}>{activeIngredient.Function}</Text>
                  <Text style={styles.title}>Restriction</Text>
                  <Text style={styles.text}>
                    {activeIngredient.Restriction}
                  </Text>
                  <Text style={styles.title}>Update Date</Text>
                  <Text style={styles.text}>
                    {activeIngredient['Update Date']}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <Button />
            )}

            <Button style={styles.OkButton} onPress={handleModal}>
              <Text style={styles.textInButton}>OK</Text>
            </Button>
          </View>
        </Modal>

        <Text style={styles.h2}>Ingredients :</Text>
        <DataTable>
          {ingredients.map(e => {
            return (
              <TouchableOpacity
                key={e['COSING Ref No']}
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                  setactiveIngredient(e);
                }}>
                <DataTable.Row key={e['COSING Ref No']}>
                  <DataTable.Cell>
                    <Text>{e['INCI name']}</Text>
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
  OkButton: {
    backgroundColor: 'green',
    margin: 20,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
  text: {
    fontSize: 15,
    margin: 10,
    color: 'black',
  },
  h2: {
    color: 'black',
    margin: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectProduct: {
    height: windowHeight * 0.15,
    width: windowWidth * 1,
  },
});

export default Information;
