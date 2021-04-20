import Server from '../../server/Server';

class ApiResourceController {
  static load = async (token) => Server.getRequest(
    'resources',
    {Authorization: 'Bearer ' + token}
  );
}

export default ApiResourceController;