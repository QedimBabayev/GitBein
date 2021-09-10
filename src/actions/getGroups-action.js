import { API_BASE } from '../config/env';
import axios from 'axios';
import { getToken } from '../config/token';
import filterObject from '../config/filterObject'



export  function getGroups(controllerName) {

    return dispatch => {
     
            dispatch({
                type: 'FETCH_GROUPS',
                payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`, {
                    token : getToken(),
                }).then(result => result.data)
                    .then(data => data.Body)
            })

    }
}




export  function getGroupsFast(controllerName) {
    filterObject.token = getToken()

    return dispatch => {
     
            dispatch({
                type: 'FETCH_FAST_GROUPS',
                payload: axios.post(`${API_BASE}/` + controllerName + `/getfast.php`, filterObject).then(result => result.data)
                    .then(data => data.Body)
            })

    }
}



export  function getOwners(controllerName) {
    filterObject.token = getToken()
    return dispatch => {
     
            dispatch({
                type: 'FETCH_OWNERS',
                payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`, {token:getToken()}).then(result => result.data)
                    .then(data => data.Body)
            })

    }
}


export  function getDepartments(controllerName) {
    filterObject.token = getToken()

    return dispatch => {
     
            dispatch({
                type: 'FETCH_DEPARTMENTS',
                payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`, {token:getToken()}).then(result => result.data)
                    .then(data => data.Body)
            })

    }
}

