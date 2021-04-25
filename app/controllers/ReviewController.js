import Review from '../models/Review';
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
}

export default ReviewController;