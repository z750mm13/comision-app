import React, {useState} from 'react';
import { StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import articles from '../constants/articles';

const { width } = Dimensions.get('screen');

renderArticles = (params) => {
  if(params)
  console.log("Renderezando " + params.tabId);
  else return null;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.articles}>
      {renderArticle(params.tabId)}
    </ScrollView>
  )
}

function renderArticle( id ) {
  if(id === "popular")
  return(
  <Block flex>
    <Card item={articles[0]} horizontal  />
    <Block flex row>
      <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
      <Card item={articles[2]} />
    </Block>
  </Block>
  )
  else if(id === "beauty")
  return (
    <Block flex>
    <Card item={articles[3]} horizontal />
    <Card item={articles[4]} full />
    </Block>
  )
  else return null;
}

function Home (props) {
  const { route } = props;
  const initalState = {
    load: false
  };
  
  const [state, setState] = useState(initalState);
  
  return (
    <Block flex center style={styles.home}>
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