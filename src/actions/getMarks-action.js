import { API_BASE } from '../config/env';
import axios from 'axios';
import filterMark from '../config/filterMark';
import { getToken } from '../config/token';

export const FETCH_MARK = 'FETCH_MARK'


export default function getMarks() {
    filterMark.token = getToken()
    return dispatch => {
        dispatch({
            type: FETCH_MARK,
            payload: axios.post(`${API_BASE}/marks/get.php`,
            filterMark
            ).then(result => result.data)
                .then(data => data)
        })
    }
}