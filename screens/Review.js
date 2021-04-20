import React,{ useState } from "react";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// Icos
import { ScrollView, StyleSheet, Dimensions } from "react-native";
// Galio components
import { Block, Text, theme } from "galio-framework";
// Argon themed components
import { argonTheme } from "../constants";
import { Button, Input } from "../components";
// Custom component
import RadioButtonContainer from "../components/RadioButtonContainer";

const { width } = Dimensions.get("screen");

function Review(props) {
  //Opciones de ruta
  const { navigation,route } = props;
  //Propiedades
  let subarea = route.params.array.subarea;
  let questionnaires = route.params.array.questionnaires;
  let questions = route.params.array.questions;
  let validity = route.params.array.validity;
  //Ajuste de datos iniciales
  const [pregunta, setPregunta] = useState({cuestionario:0,pregunta:0, contador: 1});
  const [respuestas, setRespuestas] = useState([]);
  const [estado, setEstado] = useState(true);

  questionnaires.forEach(questionnaire => {
    questionnaire.questions = [];
    questions.forEach(question => {
      if(question.questionnaire_id === questionnaire.id) {
        questionnaire.questions.push(question);
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

  // declaración de metodos
  renderButton = () => {
    return (
      <Block center>
        <Button 
          color="default"
          style={styles.button}
          onPress={()=>{
            let cuestionario = questionnaires[pregunta.cuestionario];
            if(cuestionario) {
              if(pregunta.pregunta + 1 < cuestionario.questions.length) setPregunta({
                ...pregunta,
                contador: pregunta.contador + 1,
                pregunta: pregunta.pregunta + 1
              });
              else setPregunta({
                  contador    : pregunta.contador + 1,
                  cuestionario: pregunta.cuestionario + 1,
                  pregunta    : 0
                });
            }
          }}
        >
          {questionnaires[pregunta.cuestionario]&&questionnaires[pregunta.cuestionario].questions[pregunta.pregunta]?'Siguiente':'Guardar'}
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
    if(!estado)
      return <Block>
        <Input right placeholder="Descripción" onChangeText={texto=>console.log(texto)} iconContent={<Block />} />
        <Button
        color="success"
        style={styles.button}
        onPress={()=>navigation.navigate("Camara")}
        >
              Evidencia
        </Button>
      </Block>
    else return null;
  }

  const onRadioButtonPress = (itemIdx) => {
    setEstado(itemIdx?false:true);
    respuestas[pregunta.contador - 1].valor = (itemIdx?false:true);
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
  }
});

export default Review;