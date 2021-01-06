import ApiResourceController from './ApiResourceController';

import Perfil from '../../constants/Perfil';
import Rango from '../../constants/Rango';
import Areas from '../../constants/Areas';

import Area from '../models/Area';
import Subarea from '../models/Subarea';
import Target from '../models/Target';
import Questionnaire from '../models/Questionnaire';
import Question from '../models/Question';
import Validity from '../models/Validity';

class ResourceController {
  static clearing = false;
  /**
   * Carga de datos de la api al storage local
   */
  static load() {
    return new Promise((resolve,reject) => {
      ApiResourceController.load(Perfil.llave)
        .then(function (response) {
          //Carga en ram de datos
          //Carga de datos en la base de datos
          let data = response.data;
          ResourceController.loadAreas(data.areas);
          ResourceController.loadSubareas(data.subareas);
          ResourceController.loadTargets(data.targets);
          ResourceController.loadQuestionnaires(data.questionnaires);
          ResourceController.loadQuestions(data.questions);
          ResourceController.loadValidity(data.validity);
          resolve(true);
        }).catch(function (error){
          console.log("Api Error:");
          reject(error);
        });
    });
  }

  static clearData() {
    return new Promise((resolve,reject) => {
      Area.clear()
        .then(
          (area) => {Areas.limpiar();
            Subarea.clear()
            .then(
              (subarea) => Target.clear()
                .then(
                  (target) => Questionnaire.clear()
                    .then(
                      (questionnaire) => Question.clear()
                        .then(
                          (question) => Validity.clear()
                            .then(
                              (validity) => {
                                Rango.limpiar();
                                resolve(true);
                              }
                            ).catch(() => reject)
                        ).catch(()=>reject)
                    ).catch(()=>reject)
                ).catch(()=>reject)
            ).catch(()=>reject)
        }).catch(()=>reject)
    });
  }

  static loadAreas(areas) {
    areas.forEach(area => {
      Area.add(area.id,area.nombre,area.area)
        .then((agregada) => {
          Areas.areas.push({id:area.id + "", title:area.nombre});
          console.log(area.nombre + " agregada. ->" + agregada);
        })
        .catch((error)=> console.log(area.nombre + " no agregada ->" + error))
    });
  }

  static loadSubareas(subareas) {
    subareas.forEach(subarea => {
      Subarea.add(subarea.id,subarea.nombre,subarea.area_id)
        .then((agregada) => console.log(subarea.nombre + " agregada. ->" + agregada))
        .catch((error)=> console.log(subarea.nombre + " no agregada ->" + error))
    });
  }

  static loadTargets(targets) {
    targets.forEach(target => {
      Target.add(target.id,target.subarea_id,target.questionnaire_id)
        .then((agregada) => console.log(target.id + " target agregada. ->" + agregada))
        .catch((error)=> console.log(target.id + " target no agregada ->" + error))
    });
  }
  
  static loadQuestionnaires(questionnaires) {
    questionnaires.forEach(questionnaire => {
      Questionnaire.add(questionnaire.id,questionnaire.tipo,questionnaire.descripcion,questionnaire.requirement_id)
        .then((agregada) => console.log(questionnaire.tipo + " agregada. ->" + agregada))
        .catch((error)=> console.log(questionnaire.tipo + " no agregada ->" + error))
    });
  }
  
  static loadQuestions(questions) {
    questions.forEach(question => {
      Question.add(question.id,question.encabezado,question.questionnaire_id)
        .then((agregada) => console.log(question.encabezado + " agregada. ->" + agregada))
        .catch((error)=> console.log(question.encabezado + " no agregada ->" + error))
    });
  }
  
  static loadValidity(validities) {
    if(validities === null) return;
    validities.forEach(validity => {
      Validity.add(validity.id,validity.inicio,validity.fin)
        .then((agregada) => {
          console.log(validity.inicio + " agregada. ->" + agregada);
          Rango.inicio = validity.inicio;
          Rango.fin = validity.fin;
        })
        .catch((error)=> console.log(validity.inicio + " no agregada ->" + error))
    });
  }
}

export default ResourceController;