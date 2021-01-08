import React, {useState} from 'react';
import { StyleSheet, Dimensions, ScrollView, Text } from 'react-native';

import { Camera } from 'expo-camera';

import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import ProgressDialog from 'react-native-progress-dialog';

import Subareas from '../app/vars/Subareas';

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

renderArticles = (params) => {
  if(params && params.tabId) {
    estado.idTab = params.tabId
    console.log("Renderizando " + params.tabId);
    let tab = estado.idTab;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        {renderArticle(tab)}
      </ScrollView>
    )
  }
}

function renderArticle( id ) {
  if(Subareas.subareas[id] === undefined) return null;
  return(
  <Block flex>
    {Subareas.subareas[id].map((prop) => {
      return (<Card item={prop} horizontal  />);
    })}
  </Block>
  )
}

function Home (props) {
  const { route } = props;
  
  return (
    <Block flex center style={styles.home}>
      {renderProcessLoader(route.params)}
      {renderArticles(route.params)}
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