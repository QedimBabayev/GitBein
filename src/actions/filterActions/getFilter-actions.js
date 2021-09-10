import { API_BASE } from '../../config/env';
import axios from 'axios';
import {getToken } from '../../config/token';



export  function getFilterDatas(controllerName) {
    return dispatch => {
            dispatch({
                type: 'FETCH_FILTER_DATAS',
                payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`, {
                    token : getToken(),
                }).then(result => result.data)
                    .then(data => data.Body)
            })

    }
}
