import Model from './Model';
class Area {
  static JSONuser = {
    nombre: "varchar(150)",
    area: "varchar(150)"
  };

  static area = new Model(this.JSONuser, "area");

  static autoincrement = Area.area.setAutoincrement(false);

  /**
   * 
   * @param {id del área} id
   * @param {nombre del área} nombre
   * @param {extención del área "Alarcón"} area
   */
  static add(id,nombre, area){
    let data = [id,nombre,area]
    return Area.area.add(data);
  }

  static get() {
    return Area.area.get();
  }

  static migrate() {
    return Area.area.migrate();
  }

  static clear() {
    return Area.area.clear();
  }
}

export default Area;