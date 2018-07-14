import { fromJS, Map, List} from 'immutable';

const initialState = fromJS({
    nullTemplate:{},
    eventList:[],
    menuList:[],
    menuDataList:"[]",
    eventTemplateId:"",
    resourceId:"",
    checkboxMenu:[],
    checkboxMenuList:[],
    getMoreDocs:{},
    next:{},
    last:{},
    tabMapList:"[]",
    addEventStatus:false

});
export default (state = initialState, action) => {
    switch (action.type) {
        case 'label/ADD_NULL_OK':
            return state.set('nullTemplate', action.result);
        case "label/GET_LIST_OK":
            return state.set('eventList', action.result);
        // case "label/GET_MENU_LIST_OK":
        //     return state.set('menuList',action.menuList);
        // case "label/GET_MENU_DATA_LIST_OK":
        //     return state.set("menuDataList",action.menuDataListArr);
        case "label/GET_EVENT_TEMPLATED_ID":
            return state.set("eventTemplateId",action.eventTemplateId);
        case "label/GET_RESOURCE_ID":
            return state.set("resourceId",action.resourceId);
        case "label/GET_CHECK_MENU_OK":
            return state.set("checkboxMenu",action.checkboxMenu);
        case "label/GET_CHECK_CHECKED_LIST_OK":
            return state.set('checkboxMenuList',action.checkboxCheckedList);
        case "label/GET_MORE_DOC_OK":
            return state.set("getMoreDocs",action.result);
        case "label/GET_MORE_DOC_LAST":
            return state.set('last',action.last);
        case "label/GET_MORE_DOC_NEXT":
            return state.set('next',action.next);
        case "label/GET_MENU_TAB_LIST_OK":
            return state.set('tabMapList',action.tabMapListArr);
        case 'label/test':
            return state.merge(action.payload);
        case "label/ADD_EVENT_STATUS":
            return state.set("addEventStatus",true)
        default:
            return state;
    }
};
