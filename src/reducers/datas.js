import {
    FETCH_DATA_FULFILLED,
    FETCH_DATA_REJECTED,
    FETCH_DATA_PENDING,
    FETCH_SPENDITEMS_PENDING,
    FETCH_SPENDITEMS_FULFILLED,
    FETCH_SPENDITEMS_REJECTED,
    FETCH_DATAFAST_PENDING,
    FETCH_DATAFAST_FULFILLED,
    FETCH_DATAFAST_REJECTED,
    FETCH_SECONDARYDATA_PENDING,
    FETCH_SECONDARYDATA_FULFILLED,
    FETCH_PROFIT_PENDING,
    FETCH_PROFIT_FULFILLED,
    FETCH_PROFIT_REJECTED,
    FETCH_DOCUMENT_PENDING,
    FETCH_DOCUMENT_FULFILLED,
    FETCH_DOCUMENT_REJECTED,
    FETCH_CHECK_PENDING,
    FETCH_CHECK_FULFILLED,
    FETCH_CHECK_REJECTED,


} from '../config/fetching';
import { UPDATE_CHANGEPAGE } from '../actions/getData-action'

const FETCH_PAGE_FULFILLED = 'FETCH_PAGE_FULFILLED'
const FETCH_PAGE_PENDING = 'FETCH_PAGE_PENDING'
const UPDATE_POSITIONS = 'UPDATE_POSITIONS'
const UPDATE_POSITIONS_BARCODE = 'UPDATE_POSITIONS_BARCODE'
export const initialState = {
    fetching: false,
    fetchingSave: false,
    fetchingLinked: false,
    fetchingEdit: true,
    save: false,
    send: false,
    datas: [],
    documents: [],
    documentInfo: [],
    profit: [],
    profitInfo: {},
    headerDatas: [],
    responseId: '',
    responseCustomerId: '',
    responseProductId: '',
    responseStockId: '',
    responseFromStockId: '',
    checkDatas: [],
    checkLoading: true,
    error: {},
    columns: [],
    changePage: false,
    loading: true,
    lang: 'eng',
    barcode: false,
    doc: [],
    additionalInfo: [],
    secondaryDatas: [],
    searching:''




};
function datas(state = initialState, action) {

    switch (action.type) {

        case FETCH_DATA_PENDING:
            return {
                ...state,
                fetching: true,
                changePage: true,
                loading: true
            };

        case FETCH_CHECK_PENDING:
            return {
                ...state,
            };
        case FETCH_DOCUMENT_PENDING:
            return {
                ...state,
                fetchingLinked: true,
            };


        case FETCH_PROFIT_PENDING:
            return {
                ...state,
                fetching: true,
                changePage: true,
                loading: true
            };
        case FETCH_SECONDARYDATA_PENDING:
            return {
                ...state,
                fetching: true,
                changePage: true,
                loading: true
            };
        case FETCH_DATAFAST_PENDING:
            return {
                ...state,
                fetching: true,
                changePage: true,
                loading: true
            };
        case FETCH_SPENDITEMS_PENDING:
            return {
                ...state,
            };
        case FETCH_SPENDITEMS_FULFILLED:
            return {
                ...state,
                spenditems: action.payload.Body.List
            };
        case FETCH_SPENDITEMS_REJECTED:
            return {
                ...state,
                error: action.payload

            };
        case FETCH_DATA_FULFILLED:
            return {
                ...state,
                headerDatas: action.payload.Body.List[0],
                datas: action.payload.Body.List,
                additionalInfo: action.payload.Body,
                totalDatas: action.payload.Body.Count,
                totalLimit: action.payload.Body.Limit,
                fetching: false,
                changePage: false,
                loading: false



            };

        case 'UPDATE_CHECK':
            return {
                ...state,
                checkDatas: action.payload.checkdata
            };
        case FETCH_PROFIT_FULFILLED:
            return {
                ...state,
                profit: action.payload.Body.SpendItems,
                profitInfo: action.payload.Body,
                fetching: false,
                changePage: false,
                loading: false
            };
        case FETCH_DOCUMENT_FULFILLED:
            return {
                ...state,
                documents: action.payload.Body.List,
                documentInfo: action.payload.Body,
                fetchingLinked: false,
            };

        case FETCH_SECONDARYDATA_FULFILLED:
            return {
                ...state,
                secondaryDatas: action.payload.Body.List,
                fetching: false,
                changePage: false,
                loading: false
            };

        case FETCH_DATAFAST_FULFILLED:
            return {
                ...state,
                headerDatas: action.payload.Body.List[0],
                datas: action.payload.Body.List,
                totalDatas: action.payload.Body.Count,
                totalLimit: action.payload.Body.Limit,
                fetching: false,
                changePage: false,
                loading: false



            };
        case FETCH_PAGE_PENDING:
            return {
                ...state,
                fetchingEdit: true,
            };
        case 'UPDATE_SEARCH':
            return {
                ...state,
                searching:action.payload.searchValue
            };


        case FETCH_PAGE_FULFILLED:
            return {
                ...state,
                fetchingEdit: false,
                doc: action.payload.Body.List,
            };
        case FETCH_DATA_REJECTED:
            return {
                ...state,
                fetchingEdit: true,
                error: action.payload
            };

        case UPDATE_POSITIONS:
            return {
                ...state,
                dataSource: action.payload.positions,
            };
        case UPDATE_POSITIONS_BARCODE:
            return {
                ...state,
                barcode: action.payload,
            };
        case UPDATE_CHANGEPAGE:
            return {

                ...state,
                changePage: true,
            };
        default:
            return state;
    }

}

export default datas