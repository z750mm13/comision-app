import ApiUserController from './ApiUserController';
import User from '../models/user';
import Perfil from '../../constants/Perfil';

class UserController{
  static load() {
    return new Promise((resolve,reject) =>{
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
              console.log(error);
            });
        }).catch(function (error){
          console.log("Api Error:");
          console.log(error);
        });
    });
  }
}

export default UserController;