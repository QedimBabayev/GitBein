export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.Body.Token) {
      return { Authorization: 'Bearer ' + user.Body.Token };
    } else {
      return {};
    }
  }