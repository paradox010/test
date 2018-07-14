import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import labelApi from 'app_api/labelApi';
import { List, Map } from 'immutable';

//获取空白模板
function* addNullTemplate(params){
    try {
        const result = yield call(labelApi.addNullTemplate,params.args);
       yield put({type:"label/ADD_NULL_OK",result})
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }

}
//获取事件列表
function* getEventList(params){
    const result = yield call(labelApi.getEventList, params);
    let menuList =[];
    let menuDataList =[];
    let checkboxMenu=[];
    let checkboxCheckedList=[];
    let tabMapList = [];


    let evenListArr = [];
    let tabMapLists = [];
    for(let i =0;i<result.eventList.length;i++){
        evenListArr[i]=[];
        tabMapLists[i]=[];
        for(let key in result.eventList[i]){
            if(key==="tabMap"){
                for(let maps in result.eventList[i].tabMap){
                    if(maps!=="事件名称"){
                        tabMapLists[i].push({name:maps,dataTab:result.eventList[i].tabMap[maps]})
                    }

                }
            }
            if(key!=="eventId"&&key!=="tabMap"&&key!=="事件名称"){
                evenListArr[i].push({name:key,value:result.eventList[i][key],key:i+key+"eventDataList"})
            }
        }
    }

    result.eventList.map((item,index)=>{
        for(let keys in item) {
            if (keys === "事件名称"){
                menuList.push({name:item[keys],key:index+keys+"eventList",eventId:item.eventId})
            }
        }
    });
    for(let i =0;i<result.eventList.length;i++){
        checkboxMenu[i]=[];
        checkboxCheckedList[i]=[];
        for(let keys in result.eventList[i]) {
            if (keys !== "事件名称" && keys!=="eventId" && keys!=="tabMap"){
                {/*<span>{resultOne[keys]}</span>*/}
                checkboxMenu[i].push({ label:<p style={{display:"inline-block",width:250}}> <span style={{display:"flex",justifyContent:"space-between"}}><span>{keys }</span></span></p>, value: keys });
                checkboxCheckedList[i].push(keys);
            }
        }
    }


    // menuDataListArr.push(menuDataList);
    let menuDataListArr=JSON.stringify(evenListArr);
    let tabMapListArr=JSON.stringify(tabMapLists);
    const eventTemplateId = params.args.eventTemplateId;
    const resourceId = params.args.resourceId;
    yield put({type:"label/GET_EVENT_TEMPLATED_ID",eventTemplateId});
    yield put({type:"label/GET_RESOURCE_ID",resourceId});
    yield put({type: 'label/test', payload: {menuList:menuList, menuDataList: menuDataListArr, tabMapList: tabMapListArr }})
    // yield put({type:"label/GET_MENU_LIST_OK",menuList});
    // console.log(111);
    // yield put({type:"label/GET_MENU_DATA_LIST_OK",menuDataListArr});
    // console.log(222);
    //
    // yield put({type:"label/GET_MENU_TAB_LIST_OK",tabMapListArr});
    // console.log(333);
    yield put({type:"label/GET_LIST_OK",result});
    yield put({type:"label/GET_CHECK_MENU_OK",checkboxMenu});
    yield put({type:"label/GET_CHECK_CHECKED_LIST_OK",checkboxCheckedList});
}
//新增事件列表
function* insertEvent(params){
    const result = yield call(labelApi.insertEvent,params);
    if(result!==""){
        yield put({type:"label/ADD_EVENT_STATUS"});
    }
    yield call(getEventList,{args:{
        resourceId:params.args.resourceId,
        eventTemplateId:params.args.eventTemplateId,
    }})

}
//修改列表信息数据
function* changeDataMenu(params){
    const menuDataListArr = params.args;
    yield put({type:"label/GET_MENU_DATA_LIST_OK",menuDataListArr});
}
//删除事件
function* deleteEvent(params){
    const result = yield call(labelApi.deleteEvent,params);
    //获取列表数据
    //immutable对象；（map=>对象,list=>数组）
    const menuListData = yield select(state => state.getIn(['label', 'menuList']).toJS());
    const menuDataList = yield select(state => state.getIn(['label', 'menuDataList']));
    let menuList = [...menuListData];
    let deleteIndex = null;
    for(let i=0;i<menuList.length;i++){
        if(menuList[i].eventId===params.args.eventId){
            menuList.splice(i,1)
            deleteIndex=i
        }
    }
    // menuList.delete(deleteIndex)
    let menuDatas = JSON.parse(menuDataList);
    menuDatas.splice(deleteIndex,1);
    const menuDataListArr=JSON.stringify(menuDatas);
    yield put({type: 'label/test', payload: { menuList:menuList,menuDataList: menuDataListArr }})
    // yield put({type:"label/GET_MENU_LIST_OK",menuList});

}
//更新事件
function* updateEvent(params){
    const result = yield call(labelApi.updateEvent,params);
    // console.log(result);
}
//获取更多列表
function* getMoreDoc(params){
    const result = yield call(labelApi.getMoreDoc,params);
    const next = result.next;
    const last = result.last;
    yield put({type:"label/GET_MORE_DOC_OK",result});
    yield put({type:"label/GET_MORE_DOC_LAST",last});
    yield put({type:"label/GET_MORE_DOC_NEXT",next});
}
function* watchCreateLesson() {
    yield[
        takeLatest('label/saga/ADD_NULL_OK', addNullTemplate),
        takeLatest('label/saga/GET_LIST_OK', getEventList),
        takeLatest('label/saga/INSERT_EVENT_OK',insertEvent),
        takeLatest("label/saga/CHANGE_DATA_MENU_OK",changeDataMenu),
        takeLatest("lable/saga/DELETE_EVENT_OK",deleteEvent),
        takeLatest('label/saga/UPDATE_EVENT_OK',updateEvent),
        takeLatest("label/saga/GET_MORE_DOC_OK",getMoreDoc)

    ];
}


export default function* artificialcorrectionSaga() {
    yield watchCreateLesson()
}
