import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'incidatabase',
    createFromLocation: 1,
    // createFromLocation: '~www/incidatabase.db',
  },
  () => {
    console.log('Open database!');
    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Products(productId INTEGER PRIMARY KEY AUTOINCREMENT,Category TEXT,fileName TEXT,filePathInAlbum TEXT,rating INTEGER,filePathInAlbum2 TEXT,description TEXT)',
          // 'DROP table ProductIngredients',
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
    db.transaction(
      tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Categories(id INTEGER PRIMARY KEY AUTOINCREMENT,CategoryName TEXT) ',
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
  rating,
  filePathInAlbum2,
  description,
) {
  try {
    return new Promise((resolve, reject) => {
      return db.transaction(
        tx => {
          tx.executeSql(
            'Insert into Products (Category,fileName,filePathInAlbum,rating,filePathInAlbum2,description) values (?,?,?,?,?,?) ',
            [
              selectedCategory,
              productName,
              filePathInAlbum,
              rating,
              filePathInAlbum2,
              description,
            ],
            (trans, results) => {
              ingredients.forEach(ingredient => {
                tx.executeSql(
                  'Insert into ProductIngredients (productId,"INCI name") values (?,?)',
                  [results.insertId, ingredient['INCI name']],
                );
              });
              return resolve();
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

export function selectCategories() {
  try {
    return new Promise((resolve, reject) => {
      return db.transaction(
        tx => {
          tx.executeSql(
            'SELECT CategoryName FROM Categories',
            [],
            (trans, results) => {
              let rows = [];
              for (let i = 0; i < results.rows.length; i++) {
                rows.push(results.rows.item(i));
                // console.log(row);
              }
              console.log(rows);
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
export function addNewCategory(NewCategory) {
  try {
    return new Promise((resolve, reject) => {
      return db.transaction(
        tx => {
          tx.executeSql(
            'Insert into Categories (CategoryName) values (?) ',
            [NewCategory],
            (trans, results) => {
              return resolve();
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
