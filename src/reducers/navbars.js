import { FETCH_MENU_FULFILLED, FETCH_MENU_REJECTED, FETCH_MENU_PENDING } from '../config/fetching';

import { UPDATE_SUBHEADER, UPDATE_UPPERHEADER } from '../actions/getNavbar-action'

export const initialStateNavbar = {
    navbar: [],
    id: '1',
    activeItem: 'Göstəricilər',
    activeSubItem: 'Əsas',
    fetching: true

}

function navbar(state = initialStateNavbar, action) {

    switch (action.type) {

        case FETCH_MENU_PENDING:
            return {
                ...state,
                fetching: true
            };
        case FETCH_MENU_FULFILLED:
            return {
                ...state,
                navbar: action.payload,
                fetching: false,

            };
        case FETCH_MENU_REJECTED:
            return {

                ...state,
                error: action.payload
            };
        case UPDATE_SUBHEADER:
            return {
                ...state,
                id: action.payload.id,
                activeItem: action.payload.name

            }

        case UPDATE_UPPERHEADER:
            return {
                ...state,
                activeSubItem: action.payload.nameupper
            }
        case 'CLEAR_NAV':
            return {
                ...initialStateNavbar,
            }

        default:
            return state;
    }

}

export default navbar