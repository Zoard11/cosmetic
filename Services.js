import {ipAddress} from './constants';

export function getInformation(name) {
  return fetch(`${ipAddress}/api/${name}`, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log('Error occurred during fetch operation: ', error.message);
      throw new Error(error.message);
    });
}
