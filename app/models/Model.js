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
  #autoincrement = true;
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

  constructor( obj, name ) {
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
      sql: 'create table if not exists ' + this.#name + ' (id integer primary key' + (this.#autoincrement?' autoincrement':'') + this.makeColums() + ');',
      args: []
     }], false, () => console.log(this.#name + " successful migrate."));
  }

  setAutoincrement(autoincrement) {
    this.#autoincrement = autoincrement;
    return autoincrement;
  }

  joins(joins) {
    if(joins === null) return '';
    let salida = '';
    joins.forEach(join => {
      salida += join.type + " " + join.table+ " on (" + join.left + " = " + join.right + ") ";
    });
    return salida;
  }

  values( values ) {
    if(values <= 0) return '';
    let salida = ' values';
    for (let i = 0; i < values; i++) salida += ' (' + (this.#autoincrement?'':'?,') + this.getValues() + ')' + (i === (values - 1)? "" : ",");
    return salida;
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
        tx.executeSql('insert into ' + name + ' (' + (this.#autoincrement?'':'id,') + this.getColums() + ') values (' + (this.#autoincrement?'':'?,') + this.getValues() + ');', data,
        () => {
          resolve(true);
        },errorCB);
      });
    });
  }

  addMany(data) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'insert into ' + this.#name + ' (' + (this.#autoincrement?'':'id,') + this.getColums() + ')'+
          this.values(data.length), data._array,
        () => {
          resolve(true);
        },errorCB);
      });
    });
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

  getWith(structure) {
    return new Promise ((resolve, reject) => {
      db.transaction((tx) => {//custom select
        tx.executeSql(
          'select ' + (structure.rows?? "*") + ' from ' + this.#name + ' ' +
          this.joins(structure.joins) +
          (structure.where?'where '+structure.where:''), [],
          (tx, results) => resolve(results.rows)
        ,errorCB);
      });
    });
  }

  db() {
    return db;
  }

  type() {
    return type;
  }
}

export default Model;