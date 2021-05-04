import Model from './Model';
import Review from './Review';

class Subarea {
  static JSONuser = {
    nombre: "varchar(150)",
    area_id: "integer",
    estado: "integer"
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
    let data = [id,nombre,area_id, 0]
    return Subarea.subarea.add(data);
  }

  static addMany(subareas) {
    let length = subareas.length;
    let _array = [];
    subareas.forEach(subarea => {
      _array.push(subarea.id);
      _array.push(subarea.nombre);
      _array.push(subarea.area_id);
      _array.push(subarea.estado);
    });
    return Subarea.subarea.addMany({length:length,_array:_array});
  }

  static get() {
    return Subarea.subarea.get();
  }

  static getById(id) {
    return Subarea.subarea.getWith({
      rows:"subarea.*",
      where: "subarea.id = " + id
    });
  }

  static deleteReviews(subarea_id) {
    return Review.review.deleteIn('id',{
      sql:'select review.id from review '+
      'inner join target on target.id = review.target_id '+
      'inner join subarea on subarea.id = target.subarea_id '+
      'where subarea.id = '+subarea_id
    });
  }

  static migrate() {
    return Subarea.subarea.migrate();
  }

  static updateEstado(subarea_id, value) {
    return Subarea.subarea.updateData(subarea_id, 'estado', value);
  }

  static addColumn(column) {
    return Subarea.subarea.addColumn(column);
  }

  static clear() {
    return Subarea.subarea.clear();
  }
}

export default Subarea;