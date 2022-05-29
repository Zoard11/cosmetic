import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'incidatabase',
    createFromLocation: 'incidatabase.db',
    // createFromLocation: '~www/incidatabase.db',
  },
  () => {
    console.log('Open database!');
    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Products(productId INTEGER PRIMARY KEY AUTOINCREMENT,Category TEXT,fileName TEXT,filePathInAlbum TEXT)',
          // 'DROP table Products',
          [],
          (trans, results) => {
            console.log('Table created succesfully!');
            console.log('execute success results: ' + JSON.stringify(results));
          },
        );
      },
      error => {
        console.log('Transaction error');
        console.log(error);
      },
    );
    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ProductIngredients(id INTEGER PRIMARY KEY AUTOINCREMENT,productId INTEGER,"INCI name" TEXT)',
          [],
          (trans, results) => {
            console.log('Table created succesfully!');
            console.log('execute success results: ' + JSON.stringify(results));
          },
        );
      },
      error => {
        console.log('Transaction error');
        console.log(error);
      },
    );
  },
  error => {
    console.log(error);
  },
);

export function saveAllData(
  productName,
  filePathInAlbum,
  selectedCategory,
  ingredients,
) {
  try {
    return new Promise((resolve, reject) => {
      return db.transaction(
        tx => {
          tx.executeSql(
            'Insert into Products (Category,fileName,filePathInAlbum) values (?,?,?) ',
            [selectedCategory, productName, filePathInAlbum],
            (trans, results) => {
              ingredients.forEach(ingredient => {
                tx.executeSql(
                  'Insert into ProductIngredients (productId,"INCI name") values (?,?)',
                  [results.insertId, ingredient['INCI name']],
                );
              });
            },
          );
        },
        error => {
          console.log('Transaction error saveAllData');
          console.log(error);
          return reject(error);
        },
      );
    });
  } catch (error) {
    console.log('Error');
    console.log(error);
  }
}

export function getProducts() {
  try {
    return new Promise((resolve, reject) => {
      return db.transaction(
        tx => {
          tx.executeSql('SELECT * FROM Products', [], (trans, results) => {
            console.log('getProducts===');
            let rows = [];
            for (let i = 0; i < results.rows.length; i++) {
              rows.push(results.rows.item(i));
              // console.log(row);
            }
            return resolve(rows);
          });
        },
        error => {
          console.log('Transaction error saveAllData');
          console.log(error);
          return reject(error);
        },
      );
    });
  } catch (error) {
    console.log('Error');
    console.log(error);
  }
}

export function getProductIngredientsLocal(productId) {
  try {
    return new Promise((resolve, reject) => {
      return db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM ProductIngredients Where ProductIngredients.productId=?',
            [productId],
            (trans, results) => {
              console.log('getProducts===');
              let rows = [];
              for (let i = 0; i < results.rows.length; i++) {
                rows.push(results.rows.item(i));
                // console.log(row);
              }
              return resolve(rows);
            },
          );
        },
        error => {
          console.log('Transaction error saveAllData');
          console.log(error);
          return reject(error);
        },
      );
    });
  } catch (error) {
    console.log('Error');
    console.log(error);
  }
}
