export const getDocConceptList=args=>({
    type:"artificialcorrection/saga/GET_LIST",
    args
})

export const changeEntityTreeSelect=args=>({
    type:"artificialcorrection/saga/CHANGE_ENTITY_TREE_SELECT",
    args
})

export const getTableContent=args=>({
    type:"artificialcorrection/saga/GET_TABLE_CONTENT",
    args
})
export const changeNoticeTitle=args=>({
    type:"artificialcorrection/saga/CHANGE_NOTICE_TITLE",
    args
})
export const onLoadEntityTreeData = args => ({
    type: 'artificialcorrection/saga/ONLOAD_ENTITY_TREEDATA',
    args
})