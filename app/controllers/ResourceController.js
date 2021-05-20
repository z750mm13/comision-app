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
import Review from '../models/Review';

class ResourceController {
  static clearing = false;
  /**
   * Carga de datos de la api al storage local
   */
  static async load() {
    // Carga de datos del servidor
    let resources = await ApiResourceController.load(Perfil.llave);
    if(!resources) console.log('No se pudo acceder a los recursos');
    //Ajuste de datos
    resources = resources.data;
    console.log(resources);

    //Carga de áreas
    let areas = null;
    if(resources.areas.length !== 0)
    areas = await Area.addMany(resources.areas);
    if(!areas) console.log('No se guardaron las areas');
    console.log("Areas cargadas: true");
    areas = resources.areas;

    //Carga de subáreas
    let subareas = null;
    if(resources.subareas.length !== 0)
    subareas = await Subarea.addMany(resources.subareas);
    if (!subareas) console.log('No se guardaron las subareas');
    console.log("Subareas cargadas: true");

    for(const area of areas) {
      subareas = await Area.subareas(area.id);
      if(!subareas) console.log('No se cargaron las subareas');
      // Carga de areas a la ram
      let data = [];
      let area_id = "";
      for(const subarea of subareas._array) {
        data.push({
          id:subarea.id,
          title: subarea.nombre,
          estado: subarea.estado,
          cuestionarios: subarea.cuestionarios,
          image: 'https://images.unsplash.com/photo-1607544835807-d79eefc44ee4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          cta: 'Realizar evaluación',
          area_id: subarea.area_id
        });
        area_id = subarea.area_id;
      }
      Subareas.subareas[area_id] = data;
    }
    console.log("Se han cargado las " + areas.length + " areas.");

    //Carga de targets
    let targets = null;
    if(resources.targets.length !== 0)
    targets = await Target.addMany(resources.targets);
    if (!targets) console.log('No se guardaron los targets');
    console.log("Targets cargados: true");
    
    //Carga de questionnaires
    let questionnaires = null;
    if(resources.questionnaires.length !== 0)
    questionnaires = await Questionnaire.addMany(resources.questionnaires);
    if (!questionnaires) console.log('No se guardaron los questionnaires');
    console.log("Questionnaires cargados: true");

    //Carga de questions
    let questions = null;
    if(resources.questions.length !== 0)
    questions = await Question.addMany(resources.questions);
    if (!questions) console.log('No se guardaron los questions');
    console.log("Questions cargados: true");

    //Carga de validity
    let validity = null;
    if (resources.validity)
    validity = await Validity.add(resources.validity.id, resources.validity.inicio, resources.validity.fin);
    if (!validity) console.log('No se guardo el validity');
    else {
      ResourceController.setRango(resources.validity);
      console.log("Validity cargado: true");
    }
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
                                Review.clear().then((review)=>resolve(true))
                                .catch(()=>reject)
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