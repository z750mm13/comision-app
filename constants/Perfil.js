//
class Perfil {
  static llave = "";
  static nombre = "";
  static apellidos = "";

  static limpiar = () => {
    console.log("Se limpió el Perfil");
    this.llave = "";
    this.nombre = "";
    this.apellidos = "";
  }
}

export default Perfil;