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
    if(!resources) throw CustomerError('No se pudo acceder a los recursos');
    //Ajuste de datos
    resources = resources.data;

    //Carga de áreas
    let areas = await Area.addMany(resources.areas);
    if(!areas) throw CustomerError('No se guardaron las areas');
    console.log("Areas cargadas: true");
    areas = resources.areas;

    //Carga de subáreas
    let subareas = await Subarea.addMany(resources.subareas);
    if (!subareas) throw CustomerError('No se guardaron las subareas');
    console.log("Subareas cargadas: true");

    for(const area of areas) {
      subareas = await Area.subareas(area.id);
      if(!subareas) throw CustomerError('No se cargaron las subareas');
      // Carga de areas a la ram
      let data = [];
      let area_id = "";
      for(const subarea of subareas._array) {
        data.push({
          id:subarea.id,
          title: subarea.nombre,
          estado: subarea.estado,
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
    let targets = await Target.addMany(resources.targets);
    if (!targets) throw CustomerError('No se guardaron los targets');
    console.log("Targets cargados: true");
    
    //Carga de questionnaires
    //console.log(resources.questionnaires);
    let questionnaires = await Questionnaire.addMany(resources.questionnaires);
    if (!questionnaires) throw CustomerError('No se guardaron los questionnaires');
    console.log("Questionnaires cargados: true");

    //Carga de questions
    let questions = await Question.addMany(resources.questions);
    if (!questions) throw CustomerError('No se guardaron los questions');
    console.log("Questions cargados: true");

    //Carga de validity
    let validity = await Validity.add(resources.validity);
    if (!validity) console.log('No se guardo el validity');
    else {
      if (resources.validity)
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