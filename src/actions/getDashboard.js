import { API_BASE } from '../config/env';
import axios from 'axios';
import { getToken } from '../config/token';
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD'


export  function fetchDashboard() {
    return dispatch => {
        dispatch({
            type: 'FETCH_DASHBOARD',
            payload: axios.post(`${API_BASE}/dashboard/get.php`,
            {
                token: getToken()
            }
            ).then(result => result.data)
                .then(data => data)
        })
    }
}

