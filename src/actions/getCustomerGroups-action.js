import { API_BASE } from '../config/env';
import axios from 'axios';
import { getToken } from '../config/token';
import filterCustomerData from '../config/filterCustomerData';


export function getCustomers() {

    return dispatch => {

        dispatch({
            type: 'FETCH_CUSTOMERS',
            payload: axios.post(`${API_BASE}/customers/get.php`, {
                token: getToken()
            }).then(result => result.data)
                .then(data => data.Body)
        })

    }
}



export function updateCustomerSelect(value) {
    return {
        type: 'UPDATE_CUSTOMER_VALUE',
        payload: {
            customerValue: value
        }
    }
}



export function getCustomersData(id) {
    filterCustomerData.id = id
    filterCustomerData.token = getToken()
    return dispatch => {

        dispatch({
            type: 'FETCH_CUSTOMERS_DATA',
            payload: axios.post(`${API_BASE}/customers/getdata.php`, filterCustomerData).then(result => result.data)
                .then(data => data.Body)
        })

    }
}





export function getCustomersFast(fastValue) {

    return dispatch => {

        dispatch({
            type: 'FETCH_CUSTOMERS_FAST',
            payload: axios.post(`${API_BASE}/customers/getfast.php`, {
                token: getToken(),
                fast: fastValue
            }).then(result => result.data)
                .then(data => data.Body)
        })

    }
}

