/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
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

const Information = () => {
  const {image, setImage, ingredients, setIngredients} =
    useBetween(useShareableState);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeIngredient, setactiveIngredient] = useState(null);

  const handleModal = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
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
});

export default Information;
