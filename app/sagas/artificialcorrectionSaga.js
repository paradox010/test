import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, take, fork, select, cancel} from 'redux-saga/effects';
import artificialcorrectionApi from 'app_api/artificialcorrectionApi';
import { List, Map } from 'immutable';
import {Tooltip} from "antd"
import knowledgegraphApi from "app_api/knowledgegraphApi";

function* getDocConceptList(params){
    try {
        const result = yield call(artificialcorrectionApi.getDocConceptList,params.args);
        const payload = result.map((item,index)=>({
            title: item.name,
            key: index.toString(),
            value: item.id,
            hasTitleBtn: true,
            idPath: `0/${item.id}`
        }))
        yield put({type:"artificialcorrection/GET_LIST_OK",payload:payload})
        const defaultItem = result[0];
        if (defaultItem) {
            // yield call(setFieldsValues, {values: defaultItem});
            yield call(setTreeSelect, {selectKey:['0'], selectInfo: {...defaultItem, idPath: `0/${defaultItem.id}`}});
            // yield call(entryShowInstance);
            yield call(getTableContent,{args: {
                    docType: defaultItem.name,
                    page: 1,
                    pageSize: 10
                }});
           const name = defaultItem.name;
            yield put({type:"artificialcorrection/GET_TITLE_NAME",name})
        }
    } catch (error) {
        yield put({type: 'FETCH_FAILED', error});
    }

}
function* onLoadEntityTreeData({args:{treeNode,newTreeData}}){
    const loadData = yield call(artificialcorrectionApi.selectConceptByPid, {id: treeNode.props.nodeValue});
    if (loadData.length) {
        treeNode.props.dataRef.children = loadData.map((item,index)=>{
            return {
                title: item.name,
                key: `${treeNode.props.eventKey}-${index}`,
                value: item.id,
                // hasTitleBtn: true,
                idPath: `${treeNode.props.idPath}/${item.id}`
            }
        })
    }
    yield put({type:"artificialcorrection/GET_LIST_OK",payload:newTreeData})
}
function* changeEntityTreeSelect({args: {selectKey, selectValue,selectName, selectIdPath}}){
    const result = yield call(artificialcorrectionApi.getDocConceptList,{id:selectValue})
    yield call(setTreeSelect, {selectKey, selectInfo: {...result, idPath: selectIdPath}});
    yield call(getTableContent,{args:{
            docType: selectName,
            page: 1,
            pageSize: 6
        }});
    yield call(changeNoticeName,{args:selectName})
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

    }
    yield put({type: 'artificialcorrection/CHANGE_ENTITY_TREE_SELECT', args: {entityTreeSelectInfo}});

}
function* getTableContent(params){

    const result = yield call(artificialcorrectionApi.getTableContent,params);
    const results = result.documentList.map((item)=>({
        key: item.resourceId,
        resourceId:item.resourceId,
        eventTemplateId:item.eventTemplateId,
        name: (<Tooltip placement="top" title={item.documentName}>
            <span>{item.documentName}</span>
        </Tooltip>),
        datetime: item.publishTime,
        annotateperson: item.annotate,
        tagtime: '2018.05.03 05:11',
        completiondegree: item.completion,
        eventList:item.eventList
    }));
    yield put({type:'artificialcorrection/GET_TABLE_CONTENT',results})
    const totalPage = result.total;
    yield put({type:"artificialcorrection/GET_TOTAL_PAGE",totalPage})
}
//修改文档列表名称
function* changeNoticeName(params){
    const name = params.args;
    yield put({type:"artificialcorrection/GET_TITLE_NAME",name})
}
function* watchCreateLesson() {
    yield[
        takeLatest('artificialcorrection/saga/GET_LIST', getDocConceptList),
        takeLatest('artificialcorrection/saga/CHANGE_ENTITY_TREE_SELECT',changeEntityTreeSelect),
        takeLatest('artificialcorrection/saga/GET_TABLE_CONTENT',getTableContent),
        takeLatest("artificialcorrection/saga/CHANGE_NOTICE_TITLE",changeNoticeName),
        takeLatest('artificialcorrection/saga/ONLOAD_ENTITY_TREEDATA',onLoadEntityTreeData)

    ];
}


export default function* artificialcorrectionSaga() {
    yield watchCreateLesson()
}
