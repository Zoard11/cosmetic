import {ipAdress} from './constants';

export function getInformation(name_with_spaces) {
  return fetch(
    `http://${ipAdress}:7070/api/getInformation/${name_with_spaces}`,
    {
      method: 'GET',
    },
  )
    .then(response => response.json())
    .then(response => {

      return response;
    })
    .catch(error => {
      console.log('Error occurred during fetch operation: ', error.message);
      throw new Error(error.message); 
    });
}
