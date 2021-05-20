import {Platform} from 'react-native';
import Review from '../models/Review';
import Server from '../../server/Server';
import Perfil from '../../constants/Perfil';

class ReviewController {
  /**
   * Carga un conjunto de respuestas al almacen local
   */
  static addMany(reviews) {
    return Review.addMany(reviews);
  }

  /**
   * Vacia los datos locales
   */
  static clearData() {
    return Review.clear();
  }
  /**
   * Almacena el recorrido en el sistema
   */
  static async uploadData() {
    let reviews = await Review.get();
    if(!reviews) return null;
    reviews = this.addImage(reviews._array);
    let response = await this.uploader(Perfil.llave, reviews);
    return response.data;
  }

  static addImage(reviews) {
    const body = new FormData();
    let i = 0;
    for (const review of reviews) {
      /** Estado de la revisión */
      body.append('valor'+i,review.valor);             //Valores
      body.append('evidencia'+i, review.evidencia? {   //Evidencias
        uri: Platform.OS === 'android'? review.evidencia : review.evidencia.replace('file://', ''),
        name:'photo1.jpg',
        type: 'image/jpg'
      }: null);
      body.append('descripcion'+i,review.descripcion); //Descripciones
      /** IDs */
      body.append('question_id'+i,review.question_id); //Question ids
      body.append('target_id'+i,review.target_id);     //Target ids
      i++;
    }
    body.append('total',i);
    return body;
  }

  /**
   * 
   * @param {Toten de acceso a la API} token 
   * @param {Evaluaciones a subir} reviews 
   * @returns 
   */
  static async uploader(token, reviews) {
    let response = await Server.postRequest(
      'reviews',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      },
      reviews
    );
    if(!response) return null;
    return response;
  }
}

export default ReviewController;