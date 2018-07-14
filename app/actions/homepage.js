export const gethomepagelist = () => ({
    type: 'homepage/saga/GET_LIST'
})

export const editHomePageList=params=>({
    type:'homepage/saga/EDIT_LIST',
    params
})
export const addHomePageList=params=>({
    type:'homepage/saga/ADD_LIST',
    params
})
export const deleteItem=params=>({
    type:'homepage/saga/DELETE_ITEM',
    params
})