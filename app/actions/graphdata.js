export const initGraph = args => ({
    type: 'graphdata/saga/GET_GRAPH',
	args
})
//export const addNodes = args => ({
//    type: 'graphData/saga/ADD_NODES',
//    args
//})
export const expandGraph = args => ({
    type: 'graphdata/saga/GET_EXPAND_GRAPH',
    args
})

export const changeSelectedNode = args => ({
    type: 'graphdata/CHANGE_SELECTEDNODE',
    args
})
export const changeShowEntities = args => ({
    type: 'graphdata/CHANGE_SHOWENTITIES',
    args
})

export const undoGraph = () => ({
    type: 'graphdata/UNDO',
    
})

export const redoGraph = () => ({
    type: 'graphdata/REDO',
    
})
export const loading = args => ({
    type: 'graphdata/LOADING',
    args
})