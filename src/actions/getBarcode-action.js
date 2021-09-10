import { API_BASE } from '../config/env';
import axios from 'axios';
import filterBarcode from '../config/filterBarcode'
import { getToken } from '../config/token';

export const FETCH_BARCODE = 'FETCH_BARCODE'
export const DELETE_BARCODE = 'DELETE_BARCODE'


export  function getBarcode(weight) {
    filterBarcode.token = getToken()
    weight === true ? filterBarcode.w = 1 : filterBarcode.w = 0
    return dispatch => {
        dispatch({
            type: 'FETCH_BARCODE',
            payload: axios.post(`${API_BASE}/barcode/get.php`,
                filterBarcode
            ).then(result => result.data)
                .then(data => data)
        })
    }
}


export  function deleteBarcode(){
	return {
		type: DELETE_BARCODE,
		payload: {
			barcode :'',
          
		}
	}
}
