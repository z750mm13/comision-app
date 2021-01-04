import * as SQLite from 'expo-sqlite';

let open_db = false;

const errorCB = (_,err) => {
  console.log("SQL Error:");
  console.log(err);
}

const successCB = () => {
  console.log("SQL executed fine");
}
 
const openCB = () => {
  open_db = true;
  console.log("Database OPENED");
}

const db = SQLite.openDatabase("db.db", "1.0", "Main Database", 200000, openCB, errorCB);

const type = "Model";

class Model {
  #types = [];
  #colums = [];
  #name = "";
  #migrate = false;

  isOpen() {
    return open_db;
  }

  isMigrate() {
    return this.#migrate;
  }

  constructor ( obj, name ){
    this.#name = name;
    this.initColums( obj );
    this.initTypes( obj );
  }

  initColums( obj ) {
    this.#colums = [];
    for (let k in obj) this.#colums.push(k);
  }

  initTypes( obj ) {
    this.#types = [];
    this.#colums.forEach(function callback(currentValue) {
      this.#types.push(obj[currentValue])
    }, this);
  }

  makeColums() {
    let data = "";
    this.#colums.forEach(function callback(currentValue, index) {
      data += "," + currentValue + " " + this.#types[index];
    }, this); 
    return data;
  }

  getValues() {
    let data = "";
    this.#colums.forEach(function callback(value, index){
      data += "?" + (index === (this.#colums.length - 1)? "" : ",");
    },this);
    return data;
  }

  getColums() {
    let data = "";
    this.#colums.forEach(function callback(value, index){
      data += value + (index === (this.#colums.length - 1)? "" : ",");
    },this);
    return data;
  }

  migrate() {
    db.exec([{
      sql: 'create table if not exists ' + this.#name + ' (id integer primary key autoincrement' + this.makeColums() + ');',
      args: []
     }], false, () => console.log(this.#name + " successful migrate."));
  }

  get() {
    return new Promise((resolve, reject) => {
      let name = this.#name;
      db.transaction((tx) => {
        tx.executeSql('select * from ' + name + ';', [], (tx, results) => {
            //console.log(results.rows);
            resolve(results.rows);
          },errorCB);
      });
    });
  }

  add(data) {
    return new Promise((resolve, reject) => {
      let name = this.#name;
      db.transaction((tx) => {
        tx.executeSql('insert into ' + name + ' (' + this.getColums() + ') values (' + this.getValues() + ');', data,
        () => {
          resolve(true);
        },errorCB);
      });
    })
  }

  clear() {
    return new Promise((resolve, reject) => {
      let name = this.#name;
      db.transaction((tx) => {//delete from 
        tx.executeSql('delete from ' + name + ' where id != -1;', [],
        () => {
          resolve(true);
        },errorCB);
      });
    })
  }

  db() {
    return db;
  }

  type() {
    return type;
  }
}

export default Model;