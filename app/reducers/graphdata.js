import { fromJS, Map, List, toJS} from 'immutable';


const initialState =fromJS({
//	[{nodes,links,legendData,selectedNode}]
	graphList:[],
	index:-1,
	showEntities:30,
	showLayers:3,
	loading:true,
});
const graphdata = (state = initialState, action) => {
    switch (action.type) {
		case 'graphdata/LOADING':
			return state.set('loading',action.payload)
		case 'graphdata/APPLY':
			//指针移动，删除指针list后所有数据
			return state.set('graphList',state.get('graphList').set(state.get('index')+1,fromJS(action.payload)))
				.set('index',state.get('index')+1)
		case 'graphdata/UNDO':
			if(state.get('index')>0){
				return state.set('index', state.get('index')-1)
			}else{
				return state
			}
		case 'graphdata/REDO':
			if(state.get('index')<state.get('graphList').count()-1){
				return state.set('index',state.get('index')+1)
			}else{
				return state
			}
        case 'graphdata/INIT_GRAPH' :
			const list = List([ 0 ]);
			return state.set('graphList', list.set(0, fromJS(action.payload)))
					.set('index',0)
		case 'graphdata/CHANGE_SELECTEDNODE' :
			//考虑immutable的原始api merge!
			const t = state.getIn(['graphList',state.get('index')]).toJS();
			return state.set('graphList',state.get('graphList').set(state.get('index')+1,fromJS({...t,selectedNode:action.args})))
				.set('index',state.get('index')+1)
		case 'graphdata/EXPAND_GRAPH':
			const listq = state.get('graphList').slice(0,state.get('index')+1)
			return state.set('graphList',listq.set(state.get('index')+1,fromJS(action.payload)))
				.set('index',state.get('index')+1)
		case 'graphdata/CHANGE_SHOWENTITIES':
			return state.set('showEntities',action.args)
        default:
            return state;
    }
};
//const graphdata = undoable(graphdatad)

export default graphdata