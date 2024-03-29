import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { TouchableOpacity, StyleSheet, Platform, Dimensions, Alert } from 'react-native';
import { Button, Block, NavBar, Text, theme } from 'galio-framework';
import UserController from '../app/controllers/UserController';
import ResourceController from '../app/controllers/ResourceController';
import ReviewController from '../app/controllers/ReviewController';
import Subarea from '../app/models/Subarea';
import Subareas from '../app/vars/Subareas';

import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const confirma_cerrar_sesion = ( navigation ) => {
  Alert.alert('Cerrar Sesión', 'Si no ha guardado sus cambios estos se perderán. ¿Desea cerrar su sesión?',[
    {text:'Si', onPress: () => cerrar_sesion(navigation)},
    {text:'No', onPress: () => console.log('Sin cerrar sesión')}
  ])
}

const confirma_subir_dados = ( navigation ) => {
  Alert.alert('Subir datos', '¿Está seguro que desea subir sus datos?',[
    {text:'Si', onPress: () => subirDatos(navigation)},
    {text:'No', onPress: () => console.log('Sin subir datos')}
  ])
}

function cerrar_sesion( navigation ) {
  navigation.setParams({ process: "si" });
  UserController.clearData().then(function(response){
    navigation.setParams({ process: "no" })
    ResourceController.clearData().then(()=>{
      console.log("Cesion cerrada exitosamente!");
      navigation.navigate('Onboarding');
    })
  })
  .catch(function (error){
    navigation.setParams({ process: "no" })
    console.log('Cierre de sesion -> ' + error);
  });
}

function subirDatos( navigation ) {
  navigation.setParams({ process: "si" });
  console.log('Subiendo datos');
  ReviewController.uploadData().then(resolve => {
    for(const subarea of resolve.agregadas) {
      Subarea.updateEstado(subarea.id, 2).then((valor) => {
        Subareas.find(subarea.id).estado = 2;
        Subarea.deleteReviews(subarea.id).then(value =>console.log('Revisiones eliminadas: '+value))
        .catch(error=>console.log(error));
      })
      .catch(error=>console.log(error));
    }
    navigation.setParams({
      process: "no",
      toast:{
        title: 'Carga completa',
        text: resolve.message+(resolve.duplicados.length?' Pero han fallado '+resolve.duplicados.length+'. Consulta la plataforma para arreglarlo.':''),
        color: (resolve.duplicados.length||resolve.code===404?'#fb6340':'#2ecc71')
      }
    });
  }).catch(err => {
    console.log(err);
    navigation.setParams({
      process: "no",
      toast:{
        title: 'Carga incompleta',
        text: 'Ha fallado la conexión. Intentelo más tarde.',
        color: '#f5365c'
      }
    });
  });
}

const EngineButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => confirma_cerrar_sesion(navigation)}
  >
    <Icon
      family="ArgonExtra"
      size={16}
      name="engine-start"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    
  </TouchableOpacity>
);
// <Block middle style={styles.notify} />

const BasketButton = ({isWhite, style, navigation}) => ( //cloudupload
  <TouchableOpacity style={[styles.button, style]}
    onPress={() => confirma_subir_dados(navigation)}
  >
    <Icon
      family="ArgonExtra"
      size={16}
      name="spaceship"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const SearchButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      size={16}
      family="Galio"
      name="search-zoom-in"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }
  renderRight = () => {
    const { white, title, navigation } = this.props;

    if (title === 'Title') {
      return [
        <BasketButton key='basket-title' navigation={navigation} isWhite={white} />,
        <EngineButton key='chat-title' navigation={navigation} isWhite={white} />
      ]
    }

    switch (title) {
      case 'Inicio':
        return ([
          <BasketButton key='basket-home' navigation={navigation} isWhite={white} />,
          <EngineButton key='chat-home' navigation={navigation} isWhite={white} />
        ]);
      case 'Deals':
        return ([
          <BasketButton key='basket-categories' navigation={navigation} />,
          <EngineButton key='chat-categories' navigation={navigation} />
        ]);
      case 'Categories':
        return ([
          <BasketButton key='basket-categories' navigation={navigation} isWhite={white} />,
          <EngineButton key='chat-categories' navigation={navigation} isWhite={white} />
        ]);
      case 'Category':
        return ([
          <BasketButton key='basket-deals' navigation={navigation} isWhite={white} />,
          <EngineButton key='chat-deals' navigation={navigation} isWhite={white} />
        ]);
      case 'Profile':
        return ([
          <BasketButton key='basket-deals' navigation={navigation} isWhite={white} />,
          <EngineButton key='chat-profile' navigation={navigation} isWhite={white} />
        ]);
      case 'Product':
        return ([
          <SearchButton key='search-product' navigation={navigation} isWhite={white} />,
          <BasketButton key='basket-product' navigation={navigation} isWhite={white} />
        ]);
      case 'Search':
        return ([
          <BasketButton key='basket-search' navigation={navigation} isWhite={white} />,
          <EngineButton key='chat-search' navigation={navigation} isWhite={white} />
        ]);
      case 'Settings':
        return ([
          <BasketButton key='basket-search' navigation={navigation} isWhite={white} />,
          <EngineButton key='chat-search' navigation={navigation} isWhite={white} />,
        ]);
      default:
        break;
    }
  }
  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={'#8898AA'}
        //onFocus={() => navigation.navigate('Pro')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="search-zoom-in" family="ArgonExtra" />}
      />
    );
  }
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>{optionLeft || 'Beauty'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON}/>
            <Text size={16} style={styles.tabTitle}>{optionRight || 'Fashion'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;
    
    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => {
          navigation.setParams({ tabId: id })}
        } />
    )
  }
  renderHeader = () => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch() : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  }
  render() {
    const { back, title, white, transparent, bgColor, iconColor, titleColor, navigation, ...props } = this.props;

    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor }
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          left={
            <Icon 
              name={back ? 'chevron-left' : "menu"} family="entypo" 
              size={20} onPress={this.handleLeftPress} 
              color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
              style={{ marginTop: 2 }}
            />
              
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: argonTheme.COLORS.HEADER
  },
});

export default withNavigation(Header);
