import React, {useState} from 'react';
import { StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { Toast } from 'popup-ui';

import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import ProgressDialog from 'react-native-progress-dialog';

//Eliminar review
import Review from '../app/models/Review';
import Subareas from '../app/vars/Subareas';
import QuestionnaireController from '../app/controllers/QuestionnaireController';

const { width } = Dimensions.get('screen');

const estado = {
  cargando: false,
  idTab: '',
  subareas:[]
};

renderProcessLoader = (params) => {
  if(params && params.process)
    estado.cargando = (params.process==="si");
  let proceso = estado.cargando;
  return (proceso?
    (<ProgressDialog visible label="Cargando..."/>):
    null
  )
}

function Home (props) {
  const { navigation,route } = props;
  const [carga, setCarga] = useState (false);

  renderArticles = (params,navigation) => {
    if(params && params.tabId) {
      estado.idTab = params.tabId
      console.log("Renderizando " + params.tabId);
      let tab = estado.idTab;
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}>
          {renderArticle(tab,navigation)}
        </ScrollView>
      )
    }
  }

  function renderArticle( id, navigation ) {
    if(Subareas.subareas[id] === undefined) return null;
    let i = 0;
    return(
    <Block flex>
      {Subareas.subareas[id].map((prop) => {
        prop.index = i;
        i++;
        let callback = () => {
          let data = {};
          Review.get().then(data=>console.log(data._array))
          .catch(error=>console.log());
          if(prop.estado!==0) {
            navigation.setParams({
              toast:{
                title: 'Cuestionario completado',
                text: 'Si quiere editarlo puede hacerlo en la plataforma.',
                color: '#2ecc71'
              }
            });
            return;
          }
          if(prop.id)
          navigation.setParams({ process: "si" });
          QuestionnaireController.index(prop.id)
            .then(response=>{
              navigation.setParams({ process: "no" });
              response.subarea.index = prop.index;
              data.array = response;
              data.onBack = () => {setCarga(true);};
              navigation.navigate('Cuestionario',data);
            }).catch(err => {
              navigation.setParams({ process: "no" });
              console.log(err);
            });
        };
        return (
          <Card callback={callback} item={prop} horizontal/>);
      })}
    </Block>
    )
  }

  renderToast = (params) => {
    if(!params) return null;
    if(!params.toast) return null;
    let toast = params.toast;
    Toast.show(toast);
    delete params.toast;
    activate = true;
    return null;
  };
  return (
    <Block flex center style={styles.home}>
      {renderToast(route.params)}
      {renderProcessLoader(route.params)}
      {renderArticles(route.params,navigation)}
    </Block>
  );
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;