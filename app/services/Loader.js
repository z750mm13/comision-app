import User from '../models/user';
import Validity from '../models/Validity';
import Area from '../models/Area';
import Perfil from '../../constants/Perfil';
import Rango from '../../constants/Rango';
import Areas from '../../constants/Areas';

class Loader {

  static initApp(){
    return new Promise((resolve, reject) => {
      if (Perfil.llave === "")
      User.get().then((usuarios)=>{
        if(usuarios.length === 1) {
          Loader.setPerfil(usuarios._array[0].token,usuarios._array[0].nombre,usuarios._array[0].apellidos);
          console.log("El perfil de " + Perfil.nombre + " ha sido cargado.");
          console.log("La llave de " + Perfil.nombre + " es: " + Perfil.llave);
          Validity.get().then((validities) => {
              if(validities.length===1) {
                Loader.setRango(validities._array[0].inicio, validities._array[0].fin);
                console.log("Se cargo del rango de " + validities._array[0].inicio + " a " + validities._array[0].fin);
              } else if(validities.length > 1) {
                Validity.clear().then((limpio)=>{
                  Loader.setRango("","");
                  User.clear().then((limpiado)=>{
                    Loader.setPerfil("","","");
                    console.log("El perfil y rango presentaban iregularidades por lo que se limpiaron.");
                  });
                });
              } else {
                console.log("No existe registro de rango.");
              }
              Area.get().then((areas) => {
                areas._array.forEach(area => Areas.areas.push({id:area.id + "", title:area.nombre}));
                console.log("Se han cargado las " + areas.length + " areas.");
                resolve(true);
              });
            })
            .catch((error) => User.clear().then((limpio)=>Loader.setPerfil("","","")));
        } else if (usuarios.length > 1){
          User.clear().then((limpiado) => {
            Loader.setPerfil("","","");
            console.log("El perfil contiene inconsistencias y se limpio -> " + limpiado);
            resolve(true);
          })
        } else {
          resolve(true);
        }
      }).catch((error) => reject(error));
      else resolve(true)
    });
  }

  static setPerfil( llave, nombre, apellidos ) {
    Perfil.llave = llave;
    Perfil.nombre = nombre;
    Perfil.apellidos = apellidos;
  }

  static setRango(inicio, fin) {
    Rango.inicio = inicio;
    Rango.fin = fin;
  }
}

export default Loader;