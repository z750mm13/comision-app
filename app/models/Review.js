import Model from './Model';
class Review {
  static JSONuser = {
    valor: "integer",
    descripcion: "varchar(150)",
    evidencia: "text",
    validity_id: "integer",
    question_id: "integer",
    target_id: "integer",
  };

  static review = new Model(this.JSONuser, "review");
  
  /**
   * Agregado de un elemento a la base de datos
   * @param {Valor de la respuesta} valor
   * @param {Descripcion del problema} descripcion
   * @param {Imágen de la evidencia} evidencia
   * @param {Periodo de la evaluación} validity_id
   * @param {Pregunta asociada} question_id
   * @param {Objetivo asociado} target_id
   */
  static add(valor, descripcion, evidencia, validity_id, question_id, target_id) {
    let data = [valor, descripcion, evidencia, validity_id, question_id, target_id];
    return Review.review.add(data);
  }

  static addMany(reviews) {
    let length = reviews.length;
    let _array = [];
    reviews.forEach(review => {
      _array.push(review.valor);
      _array.push(review.descripcion);
      _array.push(review.evidencia);
      _array.push(review.validity_id);
      _array.push(review.question_id);
      _array.push(review.target_id);
    });
    return Review.review.addMany({length:length,_array:_array});
  }

  static get() {
    return Review.review.get();
  }

  static migrate() {
    return Review.review.migrate();
  }

  static clear() {
    return Review.review.clear();
  }
}

export default Review;