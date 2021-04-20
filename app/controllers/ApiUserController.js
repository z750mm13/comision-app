import Server from '../../server/Server';

class ApiUserController {
  static load = async (token) => Server.getRequest(
    'user',
    {Authorization: 'Bearer ' + token}
  );
}

export default ApiUserController;