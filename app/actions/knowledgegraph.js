export const initKnowledgegraph = () => ({
    type: 'knowledgegraph/saga/INIT_PAGE'
})

export const onLoadEntityTreeData = args => ({
    type: 'knowledgegraph/saga/ONLOAD_ENTITY_TREEDATA',
    args
})

export const onLoadCopyEntityTreeData = args => ({
    type: 'knowledgegraph/saga/ONLOAD_COPY_ENTITY_TREEDATA',
    args
})

export const changeEntityTreeSelect = args => ({
    type: 'knowledgegraph/saga/CHANGE_ENTITY_TREE_SELECT',
    args
})

export const updateEntityBaseInfo = args => ({
    type: 'knowledgegraph/saga/UPDATE_ENTITY_BSAE_INFO',
    args
})

export const addEntityBaseInfo = args => ({
    type: 'knowledgegraph/saga/ADD_ENTITY_BSAE_INFO',
    args
})

export const deleteAddEntity = args => ({
    type: 'knowledgegraph/saga/DELETE_ENTITY',
    args
})

export const changeSubTab = args => ({
    type: 'knowledgegraph/saga/CHANGE_SUB_TAB',
    args
})

export const changeTab = args => ({
    type: 'knowledgegraph/saga/CHANGE_TAB',
    args
})

export const changeEventActiveTag = args => ({
    type: 'knowledgegraph/saga/GET_EVENT_TAG_DETAIL',
    args
})

export const entryShowInstance = args => ({
    type: 'knowledgegraph/saga/ENTRY_SHOW_INSTANCE',
    args
})

export const showEntityPropConf = args => ({
    type: 'knowledgegraph/saga/SHOW_ENTITY_PROP_CONF',
    args
})

export const handleEntityPropEdit = args => ({
    type: 'knowledgegraph/saga/ENTITY_PROP_EDIT',
    args
})

export const handleEntityPropAdd = args => ({
    type: 'knowledgegraph/saga/ENTITY_PROP_ADD',
    args
})
export const todoEdit = () => ({
    type:'knowledgegraph/TO_DO_EIDT'
})
export const toDoNotEdit=()=>({
    type:'knowledgegraph/TO_DO_NOT_EIDT'
})
export const disabledEdit=()=>({
    type:'knowledgegraph/TO_DISABLED_EIDT'
})


export const enterAddEntity = (info) => {
    return (dispatch,getState) => {
        dispatch(resetFieldsValues());
        dispatch({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload:'add'})
        dispatch({type: 'knowledgegraph/ENTER_ADD_ENTITY', payload: info})
    }
}
export const enterShowGraph = () => {
    return (dispatch,getState) => {
		//发送数据获取graph数据，graph页面，
//        dispatch(resetFieldsValues());
        dispatch({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload:'graph'})
    }
}

export const mergeFieldsValues = args => ({
    type: 'knowledgegraph/MERGE_FIELDS_VALUES',
    args
})

export const changeRenderType = payload => ({
    type: 'knowledgegraph/CHANGE_RENDERTYPE',
    payload
})


export const setFieldsValues = args => ({
    type: 'knowledgegraph/SET_FIELDS_VALUES',
    args
})

export const resetFieldsValues = args => ({
    type: 'knowledgegraph/RESET_FIELDS_VALUES',
    args
})
export const deleteEvent = (args,index) => ({
    type: 'knowledgegraph/saga/DELETE_EVENT_OK',
    args,
    index
})
export const changeTabStatus=(args)=>({
    type: 'knowledgegraph/CHANGE_RENDERTYPE',
    args
})
export const changeFormStatus=(args)=>({
    type:'knowledgegraph/saga/CHANGE_FORM_STATUS',
    args
})
export const recoverFormStatus=()=>({
    type:'knowledgegraph/saga/RECOVER_FORM_STATUS',
})
export const needCloseEditArea = flag => ({
    type:'knowledgegraph/NEED_CLOSE_EDIT_AREA',
    flag
})