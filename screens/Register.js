import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";

import { Block, Text } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme, Login } from "../constants";
import Auth from '../constants/acceso/Auth';
import Perfil from '../constants/Perfil';
import UserController from '../app/controllers/UserController';
const { width, height } = Dimensions.get("screen");

function Register(props) {  
  const { navigation } = props;

    const initalState = {
      email: "",
      password: "",
      error: 0,
      cargando: false
    };

    const [state, setState] = useState(initalState);
    const handleChangeText = (value, name) => {
      setState({ ...state, [name]: value });
    };
    
    const iniciar_sesion = () => {
      if(state.cargando || Perfil.llave !== "") return;
      console.log("Iniciando sesión");
      if(state.email === "" | state.password === ""){
        console.log("Error interno");
        handleChangeText(422,"error");
        return;
      }
      handleChangeText(true, "cargando");
      Auth.login(state.email, state.password)
        .then(function(response){
          Perfil.llave = response.data.access_token;
          console.log("Sesión iniciada");
          UserController.load()
            .then(function(respuesta){
              handleChangeText(false, "cargando");
              navigation.navigate("Home");
            })
        })
        .catch(function (error) {
          console.log("Error externo");
          handleChangeText(false, "cargando");
          if(error.response){
            handleChangeText(error.response.status,"error");
            console.log(error.response.status);
          } else if (error.request) {
            handleChangeText(404,"error");
            console.log(error.request);
          } else {
            handleChangeText(1,"error");
            console.log("Se desconoce el error");
          }
        });
    };

    const error = () => {
      if(state.error === 422)
      return (
        <Text color={argonTheme.COLORS.ERROR}>Error en los datos</Text>
      );
      else if(state.error === 404)
      return (
        <Text color={argonTheme.COLORS.ERROR}>Error en la conexión</Text>
      )
      else if(state.error === 1){
        return (
          <Text color={argonTheme.COLORS.ERROR}>No se conce el error</Text>
        )
      }
      else return (
        <Text></Text>
      )
    }

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
                    <Block middle>{error()}</Block>
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
