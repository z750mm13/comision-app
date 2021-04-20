import Model from './Model';
class Question {
  static JSONuser = {
    encabezado: "varchar(150)",
    questionnaire_id: "integer"
  };

  static question = new Model(this.JSONuser, "question");

  static autoincrement = Question.question.setAutoincrement(false);

  /**
   * 
   * @param {id del question} id
   * @param {id de la subárea} encabezado
   * @param {id del cuestionario} descripcion
   */
  static add(id,encabezado, questionnaire_id){
    let data = [id,encabezado,questionnaire_id]
    return Question.question.add(data);
  }

  static addMany(questions) {
    let length = questions.length;
    let _array = [];
    questions.forEach(question => {
      _array.push(question.id);
      _array.push(question.encabezado);
      _array.push(question.questionnaire_id);
    });
    return Question.question.addMany({length:length,_array:_array});
  }

  static get() {
    return Question.question.get();
  }

  static getWhere(wheres) {
    return Question.question.getWith({
      rows:"*",
      where: Question.question.orSingleColumn(wheres,'question.questionnaire_id')
    });
  }

  static migrate() {
    return Question.question.migrate();
  }

  static clear() {
    return Question.question.clear();
  }
}

export default Question;