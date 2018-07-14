import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    conceptList:[],
    entityTreeSelectInfo:[],
    getTableContent:[],
    noticeTitle:"",
    totalPage:1
});
export default (state = initialState, action) => {
    switch (action.type) {
        case 'artificialcorrection/GET_LIST_OK':
            return state.set('conceptList', fromJS(action.payload));
        case 'artificialcorrection/CHANGE_ENTITY_TREE_SELECT':
            return state.set('entityTreeSelectInfo', fromJS(action.args.entityTreeSelectInfo))
        case 'artificialcorrection/GET_TABLE_CONTENT':
            return  state.set('getTableContent',action.results)
        case "artificialcorrection/GET_TITLE_NAME":
            return state.set('noticeTitle',action.name);
        case "artificialcorrection/GET_TOTAL_PAGE":
            return state.set('totalPage',action.totalPage)
        default:
            return state;
    }
};
