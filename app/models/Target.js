import Model from './Model';
class Target {
  static JSONuser = {
    subarea_id: "integer",
    questionnaire_id: "integer"
  };

  static target = new Model(this.JSONuser, "target");

  static autoincrement = Target.target.setAutoincrement(false);

  /**
   * 
   * @param {id del target} id
   * @param {id de la subárea} subarea_id
   * @param {id del cuestionario} questionnaire_id
   */
  static add(id,subarea_id, questionnaire_id){
    let data = [id,subarea_id,questionnaire_id]
    return Target.target.add(data);
  }

  static get() {
    return Target.target.get();
  }

  static migrate() {
    return Target.target.migrate();
  }

  static clear() {
    return Target.target.clear();
  }
}

export default Target;