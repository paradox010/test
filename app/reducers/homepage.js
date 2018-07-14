import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    infoList:[],
    editList:{}
});
export default (state = initialState, action) => {
    switch (action.type) {
        case 'homepage/GET_LIST_OK':
            return state.set('infoList', action.payload);
        case "homepage/EDIT_LIST_OK":
            return state.set('editList',action.result);
        case "homepage/ADD_LIST_OK":
            return state.set('infoList', action.result);
        default:
            return state;
    }
};
