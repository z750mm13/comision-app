import User from './models/user';
import Area from './models/Area';
import Subarea from './models/Subarea';
import Target from './models/Target';
import Questionnaire from './models/Questionnaire';
import Question from './models/Question';
import Validity from './models/Validity';
import Review from './models/Review';
class Migration {
  static migrate() {
    //Validity
    Validity.migrate();
    //User
    User.migrate();
    //Area
    Area.migrate();
    //Subarea
    Subarea.migrate();
    //Target
    Target.migrate();
    //Questionnaire
    Questionnaire.migrate();
    //Question
    Question.migrate();
    //Review
    Review.migrate();
  }
}
export default Migration;