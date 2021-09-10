import { API_BASE } from '../config/env';
import axios from 'axios';
import { getToken } from '../config/token';

export function getSpendItems() {
    return dispatch => {
        dispatch({
            type: 'FETCH_SPENDITEMS',
            payload: axios.post(`${API_BASE}/spenditems/get.php`,{
                token: getToken()
            }
            ).then(result => result.data)
                .then(data => data)
        })

    }
}




