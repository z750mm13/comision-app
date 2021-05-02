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
    let response = await this.uploader(Perfil.llave, reviews);
    return response.data;
  }
  /**
   * Subida al servidor
   */
  static async uploader(token, reviews) {
    let response = await Server.postRequest(
      'reviews',
      {Authorization: 'Bearer ' + token},
      reviews
    );
    if(!response) return null;
    return response;
  }
}

export default ReviewController;