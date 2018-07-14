import Immutable, { fromJS ,Map, List} from 'immutable';

const initialState = fromJS({
    activeTag: null,
    activeTagName: '',
    currentTab: 'entityType',
    currentTagIndex: 0,
    tagList: {},
    isSearch: false,
    searchResultList: [],
    checkModal: false,
    searchKeyword: '',
    prevKeyword: '',
    formData: {},
    lastFormData: {},
    currentFormIsUpdate: false,
    isEdit:false
});

export default (state = initialState, action) => {
    switch (action.type) {
        case 'typesystem/CHANGE_TAB': //设置当前选中项目
            return state.set('currentTab', action.currentTab);
        case 'typesystem/CHANGE_ACTIVE_TAG':
            const {tag: {value, label, index}} = action;
            return state.set('activeTag', value)
                        .set('activeTagName', label)
                        .set('currentTagIndex', index);
        case 'typesystem/CLEAN_SEARCH_LIST': // 清除选中列表~
            return state.set('isSearch', false)
                        .set('searchKeyword', '')
                        .set('prevKeyword', '')
                        .set('searchResultList', List([]));
        case 'typesystem/RESET_TAGLIST':
            return state.set('activeTag', null)
                        .set('activeTagName', null)
                        .set('currentTagIndex', null);
        case 'typesystem/GET_TAGLIST_OK':
            return state.set('tagList', fromJS(action.payload));
        case 'typesystem/CHANGE_SEARCH_KEYWORD':
            return state.set('searchKeyword', action.searchKeyword);
        case 'typesystem/SEARCH_OK':
            return state.set('isSearch', true)
                        .set('prevKeyword', action.payload.keyword)
                        .set('searchResultList', List(action.payload.list));
        case 'typesystem/TRIGGER_CHECK_MODAL':
            return state.set('checkModal', action.isShow);
        case 'typesystem/SET_EDIT_VALUE':
            return state.set('lastFormData', fromJS(action.payload))
                        .set('currentFormIsUpdate', false)
                        .set('isEdit', false)
                        .set('formData', fromJS(action.payload));
        case 'typesystem/MERGE_FIELDS_VALUES':
            return state.set('formData', state.get('formData').merge(action.data))
                        .set('currentFormIsUpdate', true);
        case 'typesystem/CANCEL_SELECTED_TAG':
            return state.set('lastFormData', Map({}))
                        .set('currentFormIsUpdate', false);
        case 'typesystem/UPADTE_TAGLIST':
            return state.setIn(['tagList', action.payload.currentTab], action.payload.newCurrentTagList)

        case 'typesystem/RESET_FIELD_VALUES':
            const newFormData = state.get('formData').map(x => ({value: undefined}));
            console.log('newFormData：', newFormData);
            return state.set('formData', newFormData)
                        .set('currentFormIsUpdate', true);
        case 'typesystem/TO_DO_EIDT':
            return state.set('isEdit', true)
        case 'typesystem/ADD_TAG_SUCCESS':
            return state.merge(Map({ ...action.payload}))
        case 'typesystem/COMMON_MERGE_STATE':
            return state.merge(action.payload)
        default:
            return state;
    }
};
