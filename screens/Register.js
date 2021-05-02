import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { Toast } from 'popup-ui';

import { Block, Text } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme, Login } from "../constants";
import Auth from '../constants/acceso/Auth';
import Perfil from '../constants/Perfil';
import UserController from '../app/controllers/UserController';
import ResourceController from '../app/controllers/ResourceController';

const { width, height } = Dimensions.get("screen");

function Register(props) {  
  const { navigation } = props;
  const [toast,setToast] = useState(null);

  renderToast = () => {
    if(!toast) return null;
    Toast.show(toast);
    setToast(null);
    return null;
  };

    const initalState = {
      email: "",
      password: "",
      error: 0,
      cargando: false,
      accion: ""
    };

    const [state, setState] = useState(initalState);
    const handleChangeText = (value, name) => {
      setState({ ...state, [name]: value });
    };
    
    const iniciar_sesion = () => {
      if(state.cargando || Perfil.llave !== "") return;
      console.log("Iniciando sesión");
      if(state.email === "" | state.password === ""){
        setToast({
          title: 'Error',
          text: 'Error en los datos.',
          color: '#f5365c'
        });
        return;
      }
      handleChangeText(true, "cargando");
      Auth.login(state.email, state.password)
        .then(function(response){
          Perfil.llave = response.data.access_token;
          console.log("Sesión iniciada");
          UserController.load()
            .then(function(respuesta) {
              ResourceController.load()
                .then(function(salida) {
                  //Carga de subáreas
                  handleChangeText(false, "cargando");
                  navigation.navigate("Home");
                }).catch(err => {
                  console.log(err);
                  handleChangeText(false, "cargando")
                })
            })
        })
        .catch(function (error) {
          console.log("Error externo");
          handleChangeText(false, "cargando");
          handleChangeText("","accion");
          if(error.response){
            setToast({
              title: 'Error',
              text: 'Error ' + error.response.status,
              color: '#f5365c'
            });
            console.log(error.response);
          } else if (error.request) {
            setToast({
              title: 'Error',
              text: 'Error en la conexión.',
              color: '#f5365c'
            });
            console.log(error.request);
          } else {
            setToast({
              title: 'Error',
              text: 'Error desconocido.',
              color: '#f5365c'
            });
            console.log("Se desconoce el error");
          }
        });
    };

    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={16}>
                  Iniciar Sesión
                </Text>
              </Block>
              <Block flex>
                <Block flex={0.1} middle>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        onChangeText={(value) => handleChangeText(value, "email")}
                        borderless
                        placeholder="Correo"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        onChangeText={(value) => handleChangeText(value, "password")}
                        password
                        borderless
                        placeholder="Contraseña"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block row width={width * 0.75}>
                      <Text
                        checkboxStyle={{
                          borderWidth: 3
                        }}
                        color={argonTheme.COLORS.BLACK}
                      >Ir a </Text>
                      <Button
                        disabled={state.cargando}
                        style={{ width: 100 }}
                        color="transparent"
                        textStyle={{
                          color: argonTheme.COLORS.PRIMARY,
                          fontSize: 14
                        }}
                      >
                        Comisión SH
                      </Button>
                    </Block>
                    <Block middle>
                      <Button
                        disabled={state.cargando}
                        color="primary"
                        style={styles.createButton}
                        onPress={()=>iniciar_sesion()}
                      >
                        {
                          state.cargando?
                          (<ActivityIndicator />):
                          (<Text bold size={14} color={argonTheme.COLORS.WHITE}>INICIAR SESIÓN</Text>)
                        }
                      </Button>
                      {renderToast()}
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});
export default Register;
