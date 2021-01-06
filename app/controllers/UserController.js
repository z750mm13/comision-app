import ApiUserController from './ApiUserController';
import Auth from '../../constants/acceso/Auth';
import User from '../models/user';
import Perfil from '../../constants/Perfil';

class UserController {
  static clearing = false;
  /**
   * Carga de datos de la api al storage local
   */
  static load() {
    return new Promise((resolve,reject) => {
      ApiUserController.load(Perfil.llave)
        .then(function (response) {
          Perfil.nombre = response.data.nombre;
          Perfil.apellidos = response.data.apellidos;
          User.add(Perfil.nombre, Perfil.apellidos, Perfil.llave)
            .then(function (agregado){
              console.log("Perfil de " + Perfil.nombre + " cargado -> "+ agregado);
              resolve(true);
            }).catch(function (error){
              console.log("SQL Error:");
              reject(error);
            });
        }).catch(function (error){
          console.log("Api Error:");
          reject.log(error);
        });
    });
  }
  static clearData() {
    return new Promise((resolve,reject) => {
      Auth.logout(Perfil.llave).then(function(response){
        User.clear()
          .then((cleared) => {
            Perfil.limpiar();
            resolve(true);
          })
          .catch((error) => reject(error))
      }).catch((error) => reject(error))
    });
  }
}

export default UserController;