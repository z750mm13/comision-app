import Model from './Model';

class Subarea {
  static JSONuser = {
    nombre: "varchar(150)",
    area_id: "integer"
  };

  static subarea = new Model(this.JSONuser, "subarea");

  static autoincrement = Subarea.subarea.setAutoincrement(false);

  /**
   * 
   * @param {id de la subárea} id
   * @param {nombre de la subárea} nombre
   * @param {id del área asiciada} area_id
   */
  static add(id,nombre, area_id){
    let data = [id,nombre,area_id]
    return Subarea.subarea.add(data);
  }

  static addMany(subareas) {
    let length = subareas.length;
    let _array = [];
    subareas.forEach(subarea => {
      _array.push(subarea.id);
      _array.push(subarea.nombre);
      _array.push(subarea.area_id);
    });
    return Subarea.subarea.addMany({length:length,_array:_array});
  }

  static get() {
    return Subarea.subarea.get();
  }

  static migrate() {
    return Subarea.subarea.migrate();
  }

  static clear() {
    return Subarea.subarea.clear();
  }
}

export default Subarea;