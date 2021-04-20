import axios from 'axios';
import { apiConfig } from '../config/config';
class Server {
  static accept = {Accept: 'application/json'};

  static getRequest = async (route, heads) => axios({
    method: 'GET',
    url: apiConfig.baseUrl + route,
    headers: (heads? Object.assign(this.accept,heads) : this.accept)
  });

  static postRequest = async (route, heads, data) => axios({
    method: 'POST',
    url: apiConfig.baseUrl + route,
    data: (data? data: {}),
    headers: (heads? Object.assign(this.accept,heads) : this.accept)
  });
}

export default Server;