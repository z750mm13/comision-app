import Model from './Model';
import Areas from '../../constants/Areas';

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
  static add(id,nombre, area) {
    let data = [id,nombre,area]
    return Area.area.add(data);
  }

  static addMany(areas) {
    let length = areas.length;
    let _array = [];
    areas.forEach(area => {
      Areas.areas.push({id:area.id + "", title:area.nombre});
      _array.push(area.id);
      _array.push(area.nombre);
      _array.push(area.area);
    });
    return Area.area.addMany({length:length,_array:_array});
  }

  static subareas(id) {
    return Area.area.getWith({
      rows:"subarea.*",
      joins: [{
        type:"inner join",
        table: "subarea",
        left:"area.id",
        right:"subarea.area_id"
      }],
      where: "area.id = " + id
    });
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