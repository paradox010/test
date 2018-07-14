import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import knowledgegraphApi from 'app_api/knowledgegraphApi';
import typesystemApi from 'app_api/typesystemApi';
import { List, Map, fromJS } from 'immutable';

function* initKnowledgegraph() {
    yield call(changeTab, {
        args:{ currentTab:'entity' }
    })
}


function* changeSubTab({args}) {
    const knowledgegraph = yield select(state => state.get('knowledgegraph').toJS());
    const { currentFormIsUpdate} = knowledgegraph;
    let flag = true;

    if(currentFormIsUpdate){
        yield put({type:"knowledgegraph/PAGE_IS_CHANGE"})
        flag = yield call(canelCurrentEditHandle);
    }
    if(flag){
        const result = yield call(knowledgegraphApi[args.currentTab==='entity'?'selectConceptByPid':'selectEventTemplateByPid'], {id: '0'});
        const payload = result.map((item,index)=>({
            title: item.name,
            key: index.toString(),
            value: item.id,
            hasTitleBtn: true,
            idPath: `0/${item.id}`
        }));
        yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload}); //设置 entityTreeData
        if (args.currentTab === 'entity') {
            yield put({type: 'knowledgegraph/SET_COPY_TREE_DATA', payload}); //设置 copyEntityTreeData
        }
        
        const defaultItem = result[0];
        
        if (defaultItem) {
            yield call(setFieldsValues, {values: defaultItem});
            yield call(setTreeSelect, {selectKey:['0'], selectInfo: {...defaultItem, idPath: '0/${defaultItem.id}'}});
            // yield call(entryShowInstance, {args:{
            //         currentTab: args.currentTab,
            //         subTab: args.subTab,
            //         page:1,
            //         pageSize:6
            //     }});
        }
        yield put({type: 'knowledgegraph/CHANGE_TAB', args});
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
    }else{
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})        
    }
}

function* changeTab({args}) {
    const knowledgegraph = yield select(state => state.get('knowledgegraph').toJS());
    const { currentFormIsUpdate} = knowledgegraph;
    let flag = true;

    if(currentFormIsUpdate){
        yield put({type:"knowledgegraph/PAGE_IS_CHANGE"})
        flag = yield call(canelCurrentEditHandle);
    }
    if(flag){
        // 获取实体/实例的分类列表
        const result = yield call(knowledgegraphApi[args.currentTab==='entity'?'selectConceptByPid':'selectEventTemplateByPid'], {id: '0'});
        
        const payload = result.map((item,index)=>({
            title: item.name,
            key: index.toString(),
            value: item.id,
            hasTitleBtn: true,
            idPath: `0/${item.id}`
        }));
        yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload}); //设置 entityTreeData
        
        if (args.currentTab === 'entity') {
            yield put({type: 'knowledgegraph/SET_COPY_TREE_DATA', payload}); //设置 copyEntityTreeData
        }
        const defaultItem = result[0];
        const defaultId = defaultItem['id'];
        yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_DEFAULTID',  defaultId}); 
        if (defaultItem) {
            yield call(setFieldsValues, {values: defaultItem});
            yield call(setTreeSelect, {selectKey:['0'], selectInfo: {...defaultItem, idPath: '0/${defaultItem.id}'}});
            yield call(entryShowInstance, {args:{
                    currentTab: args.currentTab,
                    page:1,
                    pageSize:6
                }});
        }
        yield put({type: 'knowledgegraph/CHANGE_TAB', args});
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
    }else{
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
    }

}

function* onLoadEntityTreeData({args:{treeNode,newTreeData}}){
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
    const loadData = yield call(knowledgegraphApi[currentTab==='entity'?'selectConceptByPid':'selectEventTemplateByPid'], {id: treeNode.props.nodeValue});
    if (loadData.length) {
        treeNode.props.dataRef.children = loadData.map((item,index)=>{
            return {
                title: item.name,
                key: `${treeNode.props.eventKey}-${index}`,
                value: item.id,
                hasTitleBtn: true,
                idPath: `${treeNode.props.idPath}/${item.id}`
            }
        })
    }
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newTreeData})
}

function* onLoadCopyEntityTreeData({args:{treeNode,newTreeData}}){
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
    const loadData = yield call(knowledgegraphApi.selectConceptByPid, {id: treeNode.props.nodeValue});
    if (loadData.length) {
        treeNode.props.dataRef.children = loadData.map((item,index)=>{
            return {
                title: item.name,
                key: `${treeNode.props.eventKey}-${index}`,
                value: item.id,
                hasTitleBtn: true,
                idPath: `${treeNode.props.idPath}/${item.id}`
            }
        })
    }
    yield put({type: 'knowledgegraph/SET_COPY_TREE_DATA', payload: newTreeData})
}



function* changeEntityTreeSelect({args: {selectKey, selectValue, selectIdPath, subTab}}){
    
    const knowledgegraph = yield select(state => state.get('knowledgegraph').toJS());
    const { currentFormIsUpdate} = knowledgegraph;
    let flag = true;

    console.log('currentFormIsUpdate：', currentFormIsUpdate);
    if(currentFormIsUpdate){
        yield put({type:"knowledgegraph/PAGE_IS_CHANGE"})
       flag = yield call(canelCurrentEditHandle);
    }
    
    if(flag){
        const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
        const result = yield call(knowledgegraphApi[currentTab==='entity'?'selectConceptById':'selectEventTemplateById'], {id: selectValue})
        yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: 'entity'});
        yield call(setTreeSelect, {selectKey, selectInfo: {...result, idPath: selectIdPath}})
        yield call(setFieldsValues, {values: result});
        yield call(entryShowInstance, {args:{
                page:1,
                pageSize:6,
                currentTab,
                subTab
            }});
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
    }else{
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
    }

}

function* updateEntityBaseInfo({args: {values, CB}}){
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']).toJS());
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));

    const id = yield call(knowledgegraphApi[currentTab==='entity'?'updateConceptBaseInfoById':'updateEventTemplateBaseInfoById'], {...values, id: entityTreeSelectInfo.entityTreeSlecetValue});
    if (id) {
        let keyStr = entityTreeSelectInfo.entityTreeSlecetKey[0].replace(/-/g, ',children,');
        const keyArr = keyStr.split(',');
        const newEntityTreeData = entityTreeData.setIn([...keyArr, 'title'], values.name);
        yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newEntityTreeData.toJS()});
        yield put({type: 'knowledgegraph/UPDATE_ENTITY_SUCCESS', payload: values.name});
        CB();
    }
}

function* addEntityBaseInfo({args: {values, CB}}) {
    const addToDoData = yield select(state => state.getIn(['knowledgegraph', 'addToDoData']));
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));

    const params = {
        ...values,
        pid: addToDoData.get('value'),
        parentName: addToDoData.get('title'),
        idPath: addToDoData.get('idPath')
    }
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
    const newId = yield call(knowledgegraphApi[currentTab==='entity'?'insertConceptReturnId':'insertEventTemplateReturnId'], params);
    CB();
    if (newId) {
        const currentKey = addToDoData.get('key');
        let keyStr = currentKey.replace(/-/g, ',children,');
        const keyArr = keyStr.split(',');
        const hasChildren = entityTreeData.getIn([...keyArr, 'children']);
        if (!!hasChildren) {
            const newEntityTreeData = entityTreeData.setIn([...keyArr, 'children'], hasChildren.push(Map({
                title: values.name,
                key: `${currentKey}-${Number(_.last(hasChildren.getIn([hasChildren.size-1, 'key']).split('-')))+1}`,
                value: newId,
                idPath: `${addToDoData.get('idPath')}/${newId}`,
                hasTitleBtn: true
            })));
            yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newEntityTreeData.toJS()});
        }
        yield put({type: 'knowledgegraph/ADD_ENTITY_SUCCESS'});
    }
}

function* deleteEntity({args}){
    const entityTreeSlecetValue = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo', 'entityTreeSlecetValue']));
    const {value, key} = args.info;
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
    yield call(knowledgegraphApi[currentTab==='entity'?'deleteConceptById':'deleteEventTemplateById'], {id: value});
    args.CB()
    const entityTreeData = yield select(state => state.getIn(['knowledgegraph', 'entityTreeData']));
    let keyStr = key.replace(/-/g, ',children,');
    const keyArr = keyStr.split(',');
    const newKeyArr = _.dropRight(keyArr);
    const hasChildren = entityTreeData.getIn(newKeyArr);
    let newEntityTreeData = null;
    //进行删除时，如果该节点下面只有一个子节点，那么就把children字段删除
    if (!!hasChildren && hasChildren.size === 1) {
        newEntityTreeData = entityTreeData.deleteIn([...newKeyArr]);
    }else {
        // 删除之后导致key混乱，由于树key的规则是按下标来排序，所以删除的时候也要同时将当前节点下所有子节点的下标重置
        // const newChild = hasChildren.delete(_.last(keyArr)).map((item,index)=>{
        //     let _key = item.get('key');
        //     return item.set('key', _key.substring(0, _key.lastIndexOf('-') + 1) + index)
        // })
        let deleteIndex = null;
        hasChildren.map((item,index)=>{
            if (item.get('key') === key) {
                deleteIndex = index
            }
        })
        const newChild = hasChildren.delete(deleteIndex)
        // const newChild = hasChildren.delete(_.last(keyArr));
        newEntityTreeData = entityTreeData.setIn(newKeyArr, newChild)
    }
    // yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: null});
    // yield put({type: 'knowledgegraph/DELETE_ENTITY_SUCCESS'});
    yield put({type: 'knowledgegraph/GET_ENTITY_TREEDATA_OK', payload: newEntityTreeData.toJS()});
    const {key: selectKey, value: selectValue, idPath: selectIdPath} = newEntityTreeData.get(0).toJS();
    //若删除的为选中的，切换为第一个标签
    if (entityTreeSlecetValue === value) {
        yield call(changeEntityTreeSelect, {args: {selectKey: [selectKey], selectValue, selectIdPath}})
    }
}

function* getEventTagDetail({args: {type, value}}){
    const eventDetail = yield call(knowledgegraphApi.listEventByType, {type});
    yield put({type: 'knowledgegraph/GET_EVENT_TAG_DETAIL_OK', payload: eventDetail});
    yield put({type: 'knowledgegraph/CHANGE_TAGLIST_ACTIVETAG', args: {activeTag: value}});

}

function* entryShowInstance(datas){
    if(!datas.args.subTab) {
        yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: 'example'})
    }else{
        // knowledgegraph Type
        yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: datas.args.subTab})
    }    
    const entityTreeSlecetValue = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo', 'entityTreeSlecetValue']));
    const entityTreeSlecetLabel = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo', 'entityTreeSlecetLabel']));
    const params = datas.args.currentTab==='entity'?{pid: entityTreeSlecetValue}:{type: entityTreeSlecetLabel};
    let args = {currentTab:datas.args.currentTab};
    yield put({type: 'knowledgegraph/CHANGE_TAB', args});
    params['page']=datas.args.page;
    params['pageSize']=datas.args.pageSize;
    //获取实体默认列表的值
    const result = yield call(knowledgegraphApi[datas.args.currentTab==='entity'?'selectEntityByPid':'listEventByType'], params);
    // yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: 'instance'});
    //获取到 showInstance、instanceTableData、showEntityPropConf、isEdit
    
    yield put({type: 'knowledgegraph/ENTRY_SHOW_INSTANCE', args:{data: result, key: entityTreeSlecetValue}});

}

function* showEntityPropConf(){
    yield put({type: 'knowledgegraph/SHOW_ENTITY_PROP_CONF'})
}

function* entityPropEdit({args}){
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
    if (args.item) {
        const result = yield call(knowledgegraphApi[currentTab==='entity'?'updateRelationOrAttribute':'updateRoleOrAttribute'], args.item);
        if (result) {
            yield call(knowledgegraphApi[currentTab==='entity'?'updateConceptAttribute':'updateEventTemplateAttribute'], args.data);
        }
        args.CB(result);
    }else {
        //删除操作
        yield call(knowledgegraphApi[currentTab==='entity'?'updateConceptAttribute':'updateEventTemplateAttribute'], args.data)
    }

}

function* entityPropAdd({args}){
    const currentTab = yield select(state => state.getIn(['knowledgegraph', 'currentTab']));
    const id = yield call(knowledgegraphApi[currentTab==='entity'?'insertRelationOrAttribute':'insertRoleOrAttribute'], args.item);
    if (id) {
        const addItem = args.data[args.item.propType==='数值'?'attrList':currentTab==='entity'?'relationList':'roleList'];
        addItem[0].id = id;
        yield call(knowledgegraphApi[currentTab==='entity'?'updateConceptAttribute':'updateEventTemplateAttribute'], args.data);
        const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'entityTreeSelectInfo']));
        yield put({type: 'knowledgegraph/UPDATE_ENTITY_SELECT_INFO', payload: entityTreeSelectInfo.set('entityTreeSlecetItem', fromJS(args.data))})
        //同步更新外面数据，切换时吧数据增加
    }
    args.CB(id);
}


// factory FN
function* setFieldsValues({values: {pid, name, photoBase64, description}}){
    const fieldsValue = {
        name: {value: name},
        pid: {value: pid},
        description: {value: description},
        photoBase64: {value: photoBase64}
    }
    yield put({type: 'knowledgegraph/SET_FIELDS_VALUES', payload: fieldsValue})
}

function* setTreeSelect({selectKey, selectInfo}){
    const entityTreeSelectInfo = {
        entityTreeSlecetKey: selectKey,
        entityTreeSlecetValue: selectInfo.id,
        entityTreeSlecetLabel: selectInfo.name,
        entityTreeSlecetPValue: selectInfo.pid,
        entityTreeSlecetPLabel: selectInfo.parentName || '暂无',
        entityTreeSlecetIdPath: selectInfo.idPath,
        entityTreeSlecetItem: selectInfo,

    };
    yield put({type: 'knowledgegraph/CHANGE_ENTITY_TREE_SELECT', args: {entityTreeSelectInfo}})
}
//
function* deleteEvent(params){

    let result = yield call(knowledgegraphApi.deleteEventById,params);
    yield put({type: 'knowledgegraph/DELETE_EVENT', result:result});
    const entityTreeSelectInfo = yield select(state => state.getIn(['knowledgegraph', 'currentEventTagDetail']).toJS());
    entityTreeSelectInfo.map((item,index)=>{
        if(item.deleteId===params.args.id){
            entityTreeSelectInfo.splice(index,1);
        }
    });
    yield put({type: 'knowledgegraph/GET_EVENT_TAG_DETAIL_OK', payload: entityTreeSelectInfo});

}
//修改或新建过程中是否弹出阻断弹框
function* canelCurrentEditHandle(handle) {
    const needCheck = yield select(state => state.get('knowledgegraph').get('currentFormIsUpdate'));
    const needChecks = yield select(state => state.get('knowledgegraph').get('radiosChange'));
    if (needCheck || needChecks) {
        const action = yield take('knowledgegraph/NEED_CLOSE_EDIT_AREA');

        // yield cancel(listenCancel);
        if (action.flag) return true
        else {
            if (handle) {
                yield put(handle);
            }
            return false
        }
    }else {
        return true
    }
}
//切换列表选项时判断
function* changeRadioStatus(params){
    const currentFormIsUpdate = true;
    let flag = true;
    if(currentFormIsUpdate){
        yield put({type:"knowledgegraph/PAGE_IS_CHANGE"})
            yield put({type:"knowledgegraph/RADIOS_CHANGE_EDIT",payload:true})
        flag = yield call(canelCurrentEditHandle);

    }
    if(flag){
        yield put({type: 'knowledgegraph/CHANGE_RENDERTYPE', payload: params.args});
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
        yield put({type:"knowledgegraph/RADIOS_IS_CHANGE",payload:true})
    }else{
        yield put({type:"knowledgegraph/PAGE_IS_NOT_CHANGE"})
        yield put({type:"knowledgegraph/RADIOS_IS_CHANGE",payload:false})

    }
}
function* recoverFormStatus(){
    yield put({type:"knowledgegraph/RADIOS_CHANGE_EDIT",payload:false})
}
        //图表saga
function* getGraph({args}){
	//判断请求来自实体还是实例 args.type value type name
	yield put({type:'graphdata/LOADING',payload:true})
  	const result = yield call(knowledgegraphApi.resetGraph,{mongoId:args.name,type:args.type,page:1,pageSize:30})
	if(result){
		const legendData = result.categoryList;
    	const nodes = result.nodeList;
    	const links = result.relationList;
	
		const selectedNode = args;
		yield put({type:'graphdata/INIT_GRAPH',payload:{nodes,links,legendData,selectedNode}})
		yield put({type:'graphdata/LOADING',payload:false})
	}else{
		//onError
		
		yield put({type:'graphdata/LOADING',payload:false})
	}
    
}
function* getExpandGraph({args}){
	const params = {
		"sourceNodeList":[
			{
				"mongoId": args.name,
				"type": args.type
			}
		],
		"page":1,
		"pageSize":30
	}
	yield put({type:'graphdata/LOADING',payload:true})
  	const result = yield call(knowledgegraphApi.expandGraph,params)
	 
	const gl = yield select(state => state.getIn(['graphdata', 'graphList']).toJS())
	const index = yield select(state => state.getIn(['graphdata', 'index']))
	const{nodes,links,legendData}=gl[index];
	
	//node去重复
	const _nodes = nodes;
	for(let i=0;i<result.nodeList.length;i++){
		if(_nodes.some(node=>node.name===result.nodeList[i].name)){
			
		}else{
			_nodes.push(result.nodeList[i])
		}
	}
    const _links =[...links,...result.relationList];
    const _legendData = [...legendData,...result.categoryList];
	const _selectedNode = args;
    yield put({type:'graphdata/EXPAND_GRAPH',payload:{nodes:_nodes,links:_links,legendData:_legendData,selectedNode:_selectedNode}})
	yield put({type:'graphdata/LOADING',payload:false})
}
function* watchCreateLesson() {
    yield[
        takeLatest('knowledgegraph/saga/INIT_PAGE', initKnowledgegraph),
        takeLatest('knowledgegraph/saga/CHANGE_TAB', changeTab),
        takeLatest('knowledgegraph/saga/CHANGE_SUB_TAB', changeSubTab),
        takeLatest('knowledgegraph/saga/ONLOAD_ENTITY_TREEDATA', onLoadEntityTreeData),
        takeLatest('knowledgegraph/saga/CHANGE_ENTITY_TREE_SELECT', changeEntityTreeSelect),
        takeLatest('knowledgegraph/saga/UPDATE_ENTITY_BSAE_INFO', updateEntityBaseInfo),
        takeLatest('knowledgegraph/saga/ADD_ENTITY_BSAE_INFO',addEntityBaseInfo),
        takeLatest('knowledgegraph/saga/DELETE_ENTITY', deleteEntity),
        takeLatest('knowledgegraph/saga/GET_EVENT_TAG_DETAIL', getEventTagDetail),
        takeLatest('knowledgegraph/saga/ENTRY_SHOW_INSTANCE', entryShowInstance),
        takeLatest('knowledgegraph/saga/SHOW_ENTITY_PROP_CONF', showEntityPropConf),
        takeLatest('knowledgegraph/saga/ENTITY_PROP_EDIT', entityPropEdit),
        takeLatest('knowledgegraph/saga/ENTITY_PROP_ADD', entityPropAdd),
        takeLatest('knowledgegraph/saga/DELETE_EVENT_OK',deleteEvent),
        takeLatest('knowledgegraph/saga/ONLOAD_COPY_ENTITY_TREEDATA',onLoadCopyEntityTreeData),
        takeLatest('knowledgegraph/saga/CHANGE_FORM_STATUS',changeRadioStatus),
        takeLatest('knowledgegraph/saga/RECOVER_FORM_STATUS',recoverFormStatus),
		//图表saga
        takeLatest('graphdata/saga/GET_GRAPH',getGraph),
        takeLatest('graphdata/saga/GET_EXPAND_GRAPH',getExpandGraph)

    ];
}

export default function* knowledgegraphSaga() {
    yield watchCreateLesson()
}
