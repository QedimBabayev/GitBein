import { API_BASE } from '../config/env';
import axios from 'axios';
import filterObject from '../config/filterObject'
import { getToken } from '../config/token';
import { getCustomersData } from './getCustomerGroups-action';
import { fetchProfile } from './getProfile-action';
export const UPDATE_CHANGEPAGE = 'UPDATE_CHANGEPAGE'


export function fetchData(controllerName, object) {
    filterObject.token = getToken()
    return dispatch => {
        dispatch({
            type: 'FETCH_DATA',
            payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`,
                object ? object : filterObject
            ).then(result => result.data)
                .then(data => data)
        })

    }
}


export function updateCheck(newcheckdata) {
    return {
        type: 'UPDATE_CHECK',
        payload: {
            checkdata: newcheckdata
        }
    }

}


export function updateSearchInput(value) {
    return {
        type: 'UPDATE_SEARCH',
        payload: {
            searchValue: value
        }
    }

}


export function fetchCheck(controllerName, object) {
    filterObject.token = getToken()
    return dispatch => {
        dispatch({
            type: 'FETCH_CHECK',
            payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`,
                object
            ).then(result => result.data)
                .then(data => dispatch(updateCheck(data.Body.List))).then(s => dispatch(getCustomersData(s.payload.checkdata[0].CustomerId)))
        })

    }
}
export function fetchProfit(controllername, object) {
    filterObject.token = getToken()
    return dispatch => {
        dispatch({
            type: 'FETCH_PROFIT',
            payload: axios.post(`${API_BASE}/` + controllername + `/get.php`,
                object ? object : filterObject
            ).then(result => result.data)
                .then(data => data)
        })

    }
}

export function fetchDocuments(object) {
    filterObject.token = getToken()
    return dispatch => {
        dispatch({
            type: 'FETCH_DOCUMENT',
            payload: axios.post(`${API_BASE}/documents/get.php`,
                object
            ).then(result => result.data)
                .then(data => data)
        })

    }
}
export function fetchSecondaryData(controllerName) {
    filterObject.token = getToken()
    return dispatch => {
        dispatch({
            type: 'FETCH_SECONDARYDATA',
            payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`,
                filterObject
            ).then(result => result.data)
                .then(data => data)
        })

    }
}

export function fetchDataFast(controllerName) {
    filterObject.token = getToken()

    return dispatch => {


        dispatch({
            type: 'FETCH_DATAFAST',
            payload: axios.post(`${API_BASE}/` + controllerName + `/getfast.php`,
                filterObject
            ).then(result => result.data)
                .then(data => data)
        })

    }
}



export function fetchPage(controllerName) {
    filterObject.token = getToken()

    return dispatch => {

        dispatch({
            type: 'FETCH_PAGE',
            payload: axios.post(`${API_BASE}/` + controllerName + `/get.php`,
                filterObject
            ).then(result => result.data)
                .then(data => data)
        })
    }
}



export function updateChangePage(bool) {
    return {
        type: UPDATE_CHANGEPAGE,
        payload: {
            changePage: bool
        }
    }
}

