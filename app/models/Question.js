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

  static get() {
    return Question.question.get();
  }

  static migrate() {
    return Question.question.migrate();
  }

  static clear() {
    return Question.question.clear();
  }
}

export default Question;