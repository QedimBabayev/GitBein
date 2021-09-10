import axios from "axios";
import { API_LOGIN } from "../config/env";

class AuthService {
  login(username, password) {
    return axios
      .post(API_LOGIN + "/send.php", { username, password })
      .then((response) => {
        if (response.data.Body.Token) {
            console.loglog('geldi')
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_LOGIN + "signup", {
      username,
      email,
      password,
    });
  }
}

export default new AuthService();