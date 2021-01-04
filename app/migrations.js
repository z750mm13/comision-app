import User from './models/user';
class Migration {
  static migrate() {
    User.migrate();
  }
}
export default Migration;