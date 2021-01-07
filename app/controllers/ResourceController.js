import ApiResourceController from './ApiResourceController';

import Perfil from '../../constants/Perfil';
import Rango from '../../constants/Rango';
import Areas from '../../constants/Areas';
import Subareas from '../vars/Subareas';

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
          Area.addMany(data.areas)
            .then((areasOk) => {
              console.log("Areas cargadas: " + areasOk);
              Subarea.addMany(data.subareas)
                .then((subareasOk) => {
                  console.log("Subareas cargadas: " + subareasOk);
                  Target.addMany(data.targets)
                    .then((targetOk) => {
                      console.log("Targets cargados: " + targetOk);
                      Questionnaire.addMany(data.questionnaires)
                        .then((questionnaireOk) => {
                          console.log("Questionnaires cargados: " + questionnaireOk);
                          Question.addMany((data.questions))
                            .then((questionOk) => {
                              console.log("Questionns cargadas: " + questionOk);
                              if(data.validity) {
                                Validity.add(data.validity.id,data.validity.inicio,data.validity.fin)
                                  .then((validityOk) => {
                                    console.log("Validity cargada: " + validityOk);
                                    Area.get().then((areas) => {
                                      areas._array.forEach(area => {
                                        Area.subareas(area.id).then((subareasSQL) => {
                                          let data = [];
                                          let area_id = "";
                                          subareasSQL._array.forEach(subarea => {
                                            data.push({
                                              id:subarea.id,
                                              title: subarea.nombre,
                                              image: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
                                              cta: 'Realizar evaluación'
                                            });
                                            area_id = subarea.area_id;
                                          });
                                          Subareas.subareas[area_id] = data;
                                        });
                                      });
                                      console.log("Se han cargado las " + areas.length + " areas.");
                                      resolve(true);
                                    });
                                });
                                ResourceController.setRango(data.validity);
                              } else {
                                Area.get().then((areas) => {
                                  areas._array.forEach(area => {
                                    Area.subareas(area.id).then((subareasSQL) => {
                                      let data = [];
                                      let area_id = "";
                                      subareasSQL._array.forEach(subarea => {
                                        data.push({
                                          id: subarea.id,
                                          title: subarea.nombre,
                                          image: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
                                          cta: 'Realizar evaluación'
                                        });
                                        area_id = subarea.area_id;
                                      });
                                      Subareas.subareas[area_id] = data;
                                    });
                                  });
                                  console.log("Resources cargados correctamente");
                                  resolve(true);
                                });
                              }
                          });
                      });
                  });
              });
          });
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
              (subarea) => { Subareas.limpiar();
                Target.clear()
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
            }).catch(()=>reject)
        }).catch(()=>reject)
    });
  }

  static setRango(validity) {
    Rango.inicio = validity.inicio;
    Rango.fin = validity.fin;
  }
}

export default ResourceController;