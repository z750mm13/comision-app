import Model from './Model';
class User {

  static JSONuser = {
    nombre: "varchar(45)",
    apellidos: "varchar(90)",
    token: "varchar(200)"
  };

  static user = new Model(this.JSONuser, "user");

  /**
   * 
   * @param {Nombre del usuario} nombre 
   * @param {Apellidos del usuario} apellidos 
   * @param {Token de acceso} token 
   */
  static add(nombre, apellidos, token){
    let data = [nombre,apellidos,token]
    return User.user.add(data);
  }

  static get() {
    return User.user.get();
  }

  static migrate() {
    return User.user.migrate();
  }

  static clear() {
    return User.user.clear();
  }
}

export default User;