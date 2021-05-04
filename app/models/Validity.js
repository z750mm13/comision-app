import Model from './Model';
class Validity {
  static JSONuser = {
    inicio: "varchar(150)",
    fin: "varchar(150)"
  };

  static validity = new Model(this.JSONuser, "validity");

  static autoincrement = Validity.validity.setAutoincrement(false);

  /**
   * 
   * @param {id del validity} id
   * @param {id de la subárea} inicio
   * @param {id del cuestionario} descripcion
   */
  static add(id,inicio, fin){
    let data = [id,inicio,fin];
    return Validity.validity.add(data);
  }

  static get() {
    return Validity.validity.get();
  }

  static migrate() {
    return Validity.validity.migrate();
  }

  static clear() {
    return Validity.validity.clear();
  }
}

export default Validity;