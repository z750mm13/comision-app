import Server from '../../server/Server';

class Auth {
  static login = async (email, password) => Server.postRequest(
    'auth/login',
    null,
    {
      email,
      password
    }
  )

  static logout = async (token) => Server.getRequest(
    'auth/logout',
    {Authorization: 'Bearer ' + token}
  )
}

export default Auth;