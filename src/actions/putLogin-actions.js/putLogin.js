import { API_LOGIN } from '../../config/env';
import axios from 'axios';


export default function putLogin(values) {
    return dispatch => {
        dispatch({
            type: 'PUT_LOGIN',
            payload: axios.post(`${API_LOGIN}/send.php`,
                values
            )
                .then(result => result.data.Body)
                .then((data) => {
                    if (data.Token) {
                        localStorage.setItem("user", JSON.stringify(data));
                    }
                    return data
                })




        })
    }
}
