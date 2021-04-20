import Target from '../models/Target';
import Question from '../models/Question';
import Subarea from '../models/Subarea';
import Validity from '../models/Validity';

class QuestionnaireController {
  /**
   * Carga de datos de la base de datos
   */
  static index(subarea_id) {
    return new Promise((resolve,reject) => {
      Subarea.getById(subarea_id)
      .then(subarea => {
        console.log("Subarea load: OK");
        let data = {subarea:subarea._array[0], questionnaires:[], questions:[], validity: null}
        Target.getQestionnaires("target.subarea_id="+subarea_id)
          .then((questionnaires) => {
            let ids = [];
            questionnaires._array.forEach(questionnaire => {
              ids.push(questionnaire.id);
            });
            data.questionnaires = questionnaires._array;
            console.log("Questionnaires load: OK");
            if(ids.length === 0) resolve(data);
            Question.getWhere(ids)
              .then(questions => {
                data.questions = questions._array;
                console.log("Questions load: OK");
                Validity.get()
                  .then(validities => {
                    console.log("Validity load: OK");
                    data.validity = validities._array[0];
                    resolve(data);
                  }) .catch(error => {console.log(error); reject(error)});
              }).catch(error=>{console.log(error); reject(error)});
          })
          .catch(error=>{console.log(error); reject(error)});
        })
        .catch(err => {console.log(err); reject(err)})
    });
  }
}

export default QuestionnaireController;