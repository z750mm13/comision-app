import React,{ useState,useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
// Icos
import { ScrollView, StyleSheet, Dimensions, Image, ActivityIndicator } from "react-native";
// Galio components
import { Block, Text, theme } from "galio-framework";
// Argon themed components
import { argonTheme } from "../constants";
import { Button, Input } from "../components";
// Custom component
import RadioButtonContainer from "../components/RadioButtonContainer";
//Datos
import ReviewController from '../app/controllers/ReviewController';
import Subarea from '../app/models/Subarea';
import Subareas from '../app/vars/Subareas';

const { width } = Dimensions.get("screen");

function Review(props) {
  //Permisos
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Lo sentimos, se necesita permisos para acceder a la camara');
          console.log('No hay permisos');
        } else {
          console.log('Permisos sedidos');
        }
      }
    })();
  }, []);
  //Opciones de ruta
  const { navigation,route } = props;
  //Propiedades
  let subarea = route.params.array.subarea;
  let questionnaires = route.params.array.questionnaires;
  let questions = route.params.array.questions;
  let validity = route.params.array.validity;
  let onBack = route.params.onBack;
  //Ajuste de datos iniciales
  const [pregunta, setPregunta] = useState({cuestionario:0,pregunta:0, contador: 1, foto:null, estado:true, descripcion:''});
  const [respuestas, setRespuestas] = useState([]);
  const [espera,setEspera] = useState(false);
  const [cargado, setCargado] = useState (false);

  if(!cargado){
  questionnaires.forEach(questionnaire => {
    questionnaire.questions = [];
    questions.forEach(question => {
      if(question.questionnaire_id === questionnaire.id) {
        questionnaire.questions.push(question);
        if(respuestas.length <= questions.length)
        respuestas.push({
          valor:true,
          descripcion:null,
          evidencia:null,
          validity_id:(validity?validity.id:0),
          question_id:question.id,
          target_id:questionnaire.target_id
        });
      }
    });
  });
  setCargado(true);
  }

  // declaración de metodos
  const tomarFoto = async () => {
    if(!espera) {
      setEspera(true);
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
        base64:true,
      });

      console.log('data:image/jpg;base64,'+result.base64);

      if (!result.cancelled) {
        setPregunta({...pregunta,foto:'data:image/jpg;base64,'+result.base64});
        respuestas[pregunta.contador - 1].evidencia='data:image/jpg;base64,'+result.base64;
      }
      setEspera(false);
    }
  };

  renderButton = () => {
    return (
      <Block center>
        <Button 
          color="default"
          style={styles.button}
          onPress={()=>{
            if(pregunta.cuestionario<questionnaires.length) {
              let cuestionario = questionnaires[pregunta.cuestionario];
              if(cuestionario && !espera) {
                if(pregunta.pregunta + 1 < cuestionario.questions.length) setPregunta({
                  ...pregunta,
                  contador: pregunta.contador + 1,
                  pregunta: pregunta.pregunta + 1,
                  foto: null,
                  descripcion: ''
                });
                else setPregunta({
                    contador    : pregunta.contador + 1,
                    cuestionario: pregunta.cuestionario + 1,
                    pregunta    : 0,
                    foto: null,
                    descripcion: ''
                  });
              }
            } else if(!espera) { // Almacenamiento de las preguntas en la base de datos
              setEspera(true);
              console.log('Guardando datos');
              ReviewController.addMany(respuestas)
                .then((response)=>{
                  console.log(response);
                  console.log(respuestas.length + ' respuestas agregadas correctamente.');
                  Subarea.updateEstado(subarea.id, 1).then((valor) => {
                    Subareas.subareas[subarea.area_id][subarea.index].estado = 1;
                    console.log(Subareas.subareas[subarea.area_id][subarea.index]);
                    console.log('Subarea actualizada.');
                    setEspera(false);
                    onBack();
                    navigation.goBack();
                  })
                  .catch(error=>console.log(error));
                }).catch(err=>{
                  console.log(err);
                  setEspera(false);
                })
            }
            console.log(respuestas.length);
          }}
        >
          {espera? <Block center><ActivityIndicator/></Block>:questionnaires[pregunta.cuestionario]&&questionnaires[pregunta.cuestionario].questions[pregunta.pregunta]?'Siguiente':'Guardar'}
        </Button>
      </Block>
    );
  }

  const renderQestionnaires = (questionnaire,pregunta, total) => {
    return(
      <Block style={styles.block}>
        {questionnaire?<Block>
          <Text
              center
              h4
              style={{ marginBottom: theme.SIZES.BASE / 2 }}
              color={"#3D4144"}
          >
            {questionnaire.tipo}
          </Text>
          <Text
            center
            size={16}
            color={theme.COLORS.MUTED}
            style={styles.productDescription}
          >
            {questionnaire.descripcion}
          </Text>
          {renderQuestions(questionnaire.questions[pregunta.pregunta], pregunta.contador, total)}
        </Block>
        : <Block><Text
            center
            h4
            style={{ marginBottom: theme.SIZES.BASE / 2 }}
            color={"#3D4144"}
          >
            {pregunta.contador>1?'Cuestionario finalizado':'Sin cuestionarios'}
          </Text></Block>}
      </Block>
    );
  };

  const renderQuestions = (question, actual, total) => {
    const data = [
      {
        text: "Si",
      },
      {
        text: "No",
      },
    ];
    return (
      <Block>
        {question?
          <Block>
          <Text center style={{color:"#777"}}>Pregunta {actual} de {total}.</Text>
            <Text size={16} style={styles.title}>
              {question.encabezado}
            </Text>
            <RadioButtonContainer values={data} onPress={onRadioButtonPress} />
          </Block> :
          <Text size={16} style={styles.title}>
            Sin preguntas
          </Text>
        }
      </Block>
    );
  };

  let renderTextArea = () => {
    if(!pregunta.estado & pregunta.cuestionario<questionnaires.length)
      return <Block>
        <Input
          value={pregunta.descripcion}
          placeholder="Descripción"
          onChangeText={texto=>{
            if(!espera){
              pregunta.descripcion=texto;
              respuestas[pregunta.contador - 1].descripcion=texto;
            }
          }}
          iconContent={<Block />}
          value={respuestas[pregunta.contador - 1].descripcion}
        />
        <Button
        color="success"
        style={styles.button}
        onPress={tomarFoto}
        >
              Evidencia
        </Button>
        {espera? <Block center><ActivityIndicator/></Block> : pregunta.foto && <Block center card shadow ><Image source={{ uri: pregunta.foto }} style={{ width: 200, height: 200 }} /></Block>}
      </Block>
    else return null;
  }

  const onRadioButtonPress = (itemIdx) => {
    let nuevo = itemIdx?false:true;
    setPregunta({...pregunta,estado:nuevo});
    respuestas[pregunta.contador - 1].valor = nuevo;
    if(nuevo) {
      setPregunta({...pregunta, foto:null, estado:true, descripcion:''});
      respuestas[pregunta.contador - 1].evidencia=null;
      respuestas[pregunta.contador - 1].descripcion=null;
      console.log(respuestas[pregunta.contador - 1]);
    };
  };

  //Renderización de pantalla
  return (
    <Block flex center>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Block flex>
          <Text center size={34} style={styles.area}>
            {subarea.nombre}
          </Text>
          <Block>
            {renderQestionnaires(questionnaires[pregunta.cuestionario],pregunta, questions.length)}
            {renderTextArea()}
            {renderButton()}
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER
  },
  subtitle: {
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    color: argonTheme.COLORS.HEADER
  },
  block: {
    marginBottom: 44
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10
  },
  input: {
    borderBottomWidth: 1
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY
  },
  inputInfo: {
    borderBottomColor: argonTheme.COLORS.INFO
  },
  inputSuccess: {
    borderBottomColor: argonTheme.COLORS.SUCCESS
  },
  inputWarning: {
    borderBottomColor: argonTheme.COLORS.WARNING
  },
  inputDanger: {
    borderBottomColor: argonTheme.COLORS.ERROR
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center"
  },
  productDescription: {
    paddingTop: theme.SIZES.BASE,
    // paddingBottom: theme.SIZES.BASE * 2,
  },
  area: {
    marginTop: 20,
    // paddingBottom: theme.SIZES.BASE * 2,
  },
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0
  },
});

export default Review;