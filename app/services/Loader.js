import User from '../models/user';
import Perfil from '../../constants/Perfil';

class Loader {

  static initApp(){
    return new Promise((resolve, reject) => {
      if (Perfil.llave === "")
      User.get().then((usuarios)=>{
        if(usuarios.length === 1) {
          Perfil.llave = usuarios._array[0].token;
          Perfil.nombre = usuarios._array[0].nombre;
          Perfil.apellidos = usuarios._array[0].apellidos;
          console.log("El perfil de " + Perfil.nombre + " ha sido cargado.");
          console.log("La llave de " + Perfil.nombre + " es: " + Perfil.llave);
          resolve(true);
        } else if (usuarios.length > 1){
          User.clear().then((limpiado) => {
            Perfil.llave = "";
            Perfil.nombre = "";
            Perfil.apellidos = "";
            console.log("El perfil contiene inconsistencias y se limpio -> " + limpiado);
            resolve(true);
          })
        } else {
          resolve(true);
        }
      });
      else resolve(true)
    });
  }
}

export default Loader;