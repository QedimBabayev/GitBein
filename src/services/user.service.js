import axios from 'axios';
import authHeader from './auth-header';
import { API_LOGIN } from "../config/env";




class UserService {
  getPublicContent() {
    return axios.get(API_LOGIN + 'all');
  }

  getUserBoard() {
    return axios.get(API_LOGIN + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_LOGIN + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_LOGIN + 'admin', { headers: authHeader() });
  }
}

export default new UserService();