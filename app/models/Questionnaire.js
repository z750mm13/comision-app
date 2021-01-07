import Model from './Model';
class Questionnaire {
  static JSONuser = {
    tipo: "varchar(150)",
    descripcion:"varchar(150)",
    requirement_id: "integer"
  };

  static questionnaire = new Model(this.JSONuser, "questionnaire");

  static autoincrement = Questionnaire.questionnaire.setAutoincrement(false);

  /**
   * 
   * @param {id del questionnaire} id
   * @param {id de la subárea} tipo
   * @param {id del cuestionario} descripcion
   */
  static add(id,tipo, descripcion, requirement_id){
    let data = [id,tipo,descripcion,requirement_id]
    return Questionnaire.questionnaire.add(data);
  }

  static addMany(questionnaires) {
    let length = questionnaires.length;
    let _array = [];
    questionnaires.forEach(questionnaire => {
      _array.push(questionnaire.id);
      _array.push(questionnaire.tipo);
      _array.push(questionnaire.descripcion);
      _array.push(questionnaire.requirement_id);
    });
    return Questionnaire.questionnaire.addMany({length:length,_array:_array});
  }

  static get() {
    return Questionnaire.questionnaire.get();
  }

  static migrate() {
    return Questionnaire.questionnaire.migrate();
  }

  static clear() {
    return Questionnaire.questionnaire.clear();
  }
}

export default Questionnaire;